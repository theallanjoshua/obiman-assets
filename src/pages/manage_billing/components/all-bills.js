import * as React from 'react';
import { Spin, Card, Button, Empty, Tooltip } from 'antd';
import {
  EDIT_BILL_BUTTON_TEXT,
  PRINT_BILL_BUTTON_TEXT
} from '../../../constants/manage-billing';
import BillTotal from './bill-total';
import BillCompositionReadonly from './bill-composition-readonly';
import { Bill } from 'obiman-data-models';

const Frills = ({ isBottom }) => <div style={{ paddingLeft: '10px' }}>
  {[ ...new Array(10) ].map((item, index) => <span
    key={index}
    style={{
      width: 0,
      height: 0,
      borderLeft: '15px solid transparent',
      borderRight: '15px solid transparent',
      [isBottom ? 'borderTop' : 'borderBottom']: '15px solid white'
    }}
  />)}
</div>

export default class AllBills extends React.Component {
  render = () => <Spin spinning={this.props.loading}>
  {this.props.bills.length ?
    <div className='flex-wrap'>
      {this.props.bills.map(item => {
        const bill = new Bill(item);
        const billData = bill.get();
        return <div key={billData.id} >
          <Frills />
          <Card
            bordered={false}
            style={{
              maxWidth: '90vw',
              width: '300px',
              margin: '10px'
            }}
            bodyStyle={{ padding: '0px' }}
            title={<div>
              <div className='flex-wrap space-between'>
                {billData.source}
                {` (${billData.sourceId})`}
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
            children={<>
              <BillCompositionReadonly
                composition={bill.getGroupedComposition()}
                currency={this.props.currency}
              />
              <BillTotal
                bill={billData}
                currency={this.props.currency}
              />
            </>}
          />
          <Frills isBottom />
        </div>
      })}
    </div> :
  <Empty description='No bills available' />}
</Spin>
}