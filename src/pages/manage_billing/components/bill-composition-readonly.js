import * as React from 'react';
import { Table } from 'antd';
import { Utils, Order } from 'obiman-data-models';

const getBusinessStatusShortLabel = status => (new Order()
  .getStates()
  .filter(({ id }) => id === status)[0] || { business: { shortLabel: '' } }
).business.shortLabel;

export default class BillCompositionReadonly extends React.Component {
  render = () => <Table
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
            return getBusinessStatusShortLabel(status);
          } else {
            const positiveEndStateOrdersCount = children.filter(({ status }) => status === orderPositiveEndState).length;
            return positiveEndStateOrdersCount === quantity ? getBusinessStatusShortLabel(orderPositiveEndState) : `${positiveEndStateOrdersCount}/${quantity} ${getBusinessStatusShortLabel(orderPositiveEndState)}`;
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
  />
}