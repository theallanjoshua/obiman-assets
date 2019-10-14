import * as React from 'react';
import { Table, Statistic } from 'antd';
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
        render: (text, { price }) => <Statistic
          precision={2}
          prefix={new Utils().getCurrencySymbol(this.props.currency)}
          value={price}
          valueStyle={{ fontSize: 'initial' }}
        />,
        align: 'right'
      },
      {
        title: 'Amt',
        render: (text, { price, quantity }) => <Statistic
          precision={2}
          prefix={new Utils().getCurrencySymbol(this.props.currency)}
          value={price * quantity}
          valueStyle={{ fontSize: 'initial' }}
        />,
        align: 'right'
      }
  ]}
    dataSource={this.props.composition.map(entity => ({ ...entity, key: entity.id }))}
    pagination={false}
  />
}