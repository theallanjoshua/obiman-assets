import * as React from 'react';
import { Table } from 'antd';
import { Utils, Order, Bill } from 'obiman-data-models';

const bill = new Bill();
const order = new Order();
const orderCancelState = order.getStates().filter(({ isNegative, isEndState }) => isNegative && !isEndState)[0].id;

export default class BillCompositionReadonly extends React.Component {
  getStatusShortHandLabel = status => order.getStateById(status)[this.props.isCustomerView ? 'customer' : 'business'].label;
  render = () => this.props.composition.length ? <Table
    size='small'
    columns={[
      {
        title: 'Qty',
        dataIndex: 'quantity'
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
          const orderPositiveEndState = order.getPositiveEndState();
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
    expandIcon={null}
    expandRowByClick
    rowSelection={this.props.onSelectionChange && this.props.isCustomerView && !bill.getEndStates().includes(this.props.billStatus) ? {
      getCheckboxProps: ({ orderId, status }) => ({ disabled: !orderId || [ order.getNegativeEndState(), orderCancelState ].includes(status) }),
      selectedRowKeys: this.props.selectedOrderIds,
      onChange: this.props.onSelectionChange
    } : null}
  /> : null
}