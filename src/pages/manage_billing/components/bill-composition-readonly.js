import * as React from 'react';
import { Table } from 'antd';
import { Utils, Order } from 'obiman-data-models';

export default class BillCompositionReadonly extends React.Component {
  getStatusShortHandLabel = status => (new Order().getStates().filter(({ id }) => id === status)[0] || { business: { shortLabel: '' }, customer: { shortLabel: '' } })[this.props.isCustomerView ? 'customer' : 'business'].shortLabel;
  render = () => this.props.composition.length ? <Table
    size='small'
    columns={[
      {
        title: 'Qty',
        dataIndex: 'quantity',
        width: '50px'
      },
      {
        title: 'Product',
        dataIndex: 'label'
      },
      {
        title: 'Price',
        render: (text, { price, quantity = 1 }) => `${new Utils().getCurrencySymbol(this.props.currency)}${price * quantity}`,
        align: 'right'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render: (text, { status, children = [], quantity }) => {
          const orderPositiveEndState = new Order().getPositiveEndState();
          if(status) {
            return this.getStatusShortHandLabel(status);
          } else {
            const positiveEndStateOrdersCount = children.filter(({ status }) => status === orderPositiveEndState).length;
            return positiveEndStateOrdersCount === quantity ? this.getStatusShortHandLabel(orderPositiveEndState) : `${positiveEndStateOrdersCount}/${quantity} ${this.getStatusShortHandLabel(orderPositiveEndState)}`;
          }
        }
      },
    ]}
    dataSource={this.props.composition.map(entity => ({
      ...entity,
      key: entity.id,
      children: entity.children.map(child => ({ ...child, key: child.orderId }))
    }))}
    pagination={false}
  /> : null
}