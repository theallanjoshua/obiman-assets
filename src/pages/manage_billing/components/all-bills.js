import * as React from 'react';
import { Spin, Card, Button, Table, Statistic, Empty } from 'antd';
import { Utils } from 'obiman-data-models';
import { EDIT_BILL_BUTTON_TEXT } from '../../../constants/manage-billing';

export default class AllBills extends React.Component {
  render = () => <Spin spinning={this.props.loading}>
  {this.props.bills.length ?
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {this.props.bills.map(bill => <Card
        key={bill.id}
        style={{ minWidth: '300px', maxWidth: '300px', width: '300px', margin: '5px'}}
        title={bill.label}
        extra={<Button
          type='link'
          icon='edit'
          children={EDIT_BILL_BUTTON_TEXT}
          onClick={() => this.showEditModal(bill)}
        />}
        children={<div>
          <Table
            columns={[ { dataIndex: 'label' }, { dataIndex: 'quantity' } ]}
            dataSource={bill.composition.map(entity => ({ ...entity, key: entity.id }))}
            showHeader={false}
            pagination={false}
          />
          <br />
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end'
          }} >
            <Statistic
              title={'Total'}
              prefix={new Utils().getCurrencySymbol(this.props.currency)}
              value={bill.total}
            />
          </div>
        </div>}
      />)}
    </div> :
  <Empty description='No bills available' />}
</Spin>
}