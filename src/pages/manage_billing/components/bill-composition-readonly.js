import * as React from 'react';
import { Table } from 'antd';
import { Utils } from 'obiman-data-models';

export default class BillCompositionReadonly extends React.Component {
  render = () => <Table
    size='small'
    columns={[
      {
        title: 'Product',
        dataIndex: 'label'
      },
      {
        title: 'Qty',
        dataIndex: 'quantity'
      },
      {
        title: 'Price',
        render: (text, { price }) => `${new Utils().getCurrencySymbol(this.props.currency)}${price.toFixed(2)}`,
        align: 'right'
      },
      {
        title: 'Amt',
        render: (text, { price, quantity }) => `${new Utils().getCurrencySymbol(this.props.currency)}${(price * quantity).toFixed(2)}`,
        align: 'right'
      }
  ]}
    dataSource={this.props.composition.map(entity => ({ ...entity, key: entity.id }))}
    pagination={false}
  />
}