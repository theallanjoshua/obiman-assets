import * as React from 'react';
import { Spin, Card, Button, Empty, Tooltip } from 'antd';
import {
  EDIT_BILL_BUTTON_TEXT,
  PRINT_BILL_BUTTON_TEXT
} from '../../../constants/manage-billing';
import BillTotal from './bill-total';
import BillCompositionReadonly from './bill-composition-readonly';

export default class AllBills extends React.Component {
  render = () => <Spin spinning={this.props.loading}>
  {this.props.bills.length ?
    <div className='flex-wrap'>
      {this.props.bills.map(bill => <Card
        key={bill.id}
        className='flex-column'
        style={{
          maxWidth: '90vw',
          width: '300px',
          margin: '5px'
        }}
        bodyStyle={{
          flexGrow: 1,
          padding: '0px'
        }}
        title={<div>
          <div className='flex-wrap space-between'>
            {bill.source}
            <div>
              <Tooltip
                title={EDIT_BILL_BUTTON_TEXT}
                children={<Button
                  type='link'
                  icon='edit'
                  onClick={() => this.props.showEditModal(bill)}
                />}
              />
              <Tooltip
                title={PRINT_BILL_BUTTON_TEXT}
                children={<Button
                  type='link'
                  icon='printer'
                  onClick={() => this.props.showPrintModal(bill)}
                />}
              />
            </div>
          </div>
        </div>}
        children={<div className='space-between flex-column' style={{ height: '100%' }}>
          <BillCompositionReadonly
            composition={bill.composition}
            currency={this.props.currency}
          />
          <BillTotal
            bill={bill}
            currency={this.props.currency}
          />
        </div>}
      />)}
    </div> :
  <Empty description='No bills available' />}
</Spin>
}