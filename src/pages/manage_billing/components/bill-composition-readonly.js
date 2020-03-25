import * as React from 'react';
import { Table } from 'antd';
import { Utils } from 'obiman-data-models';

export default class BillCompositionReadonly extends React.Component {
  render = () => <Table
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
        dataIndex: 'status'
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