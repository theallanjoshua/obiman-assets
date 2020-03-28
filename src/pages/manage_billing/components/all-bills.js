import * as React from 'react';
import { Spin, Card, Button, Empty, Tooltip } from 'antd';
import {
  EDIT_BILL_BUTTON_TEXT,
  PRINT_BILL_BUTTON_TEXT
} from '../../../constants/manage-billing';
import BillTotal from './bill-total';
import BillCompositionReadonly from './bill-composition-readonly';
import { Bill } from 'obiman-data-models';
import EditBill from './edit-bill';
import PrintBill from './print-bill';
import { Business } from 'obiman-data-models';

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
  constructor() {
    super();
    this.state = {
      showEditModal: false,
      showPrintModal: false,
      billToUpdate: {},
      billToPrint: {}
    }
  }
  showEditModal = billToUpdate => this.setState({ billToUpdate, showEditModal: true });
  showPrintModal = billToPrint => this.setState({ billToPrint, showPrintModal: true });
  hideModal = () => this.setState({ showEditModal: false, showPrintModal: false });
  render = () => <Spin spinning={this.props.loading}>
  {(this.props.bills || []).length ?
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
                {this.props.isCustomerView ? billData.businessLabel : `${billData.source} ${billData.sourceId}`}
                <div>
                  {this.props.isCustomerView && [ bill.getPositiveEndState(), bill.getNegativeEndState() ].includes(billData.status) ? null : <Tooltip
                    title={EDIT_BILL_BUTTON_TEXT}
                    children={<Button
                      type='link'
                      icon='edit'
                      onClick={() => this.showEditModal(bill)}
                    />}
                  />}
                  <Tooltip
                    title={PRINT_BILL_BUTTON_TEXT}
                    children={<Button
                      type='link'
                      icon='printer'
                      onClick={() => this.showPrintModal(bill)}
                    />}
                  />
                </div>
              </div>
            </div>}
            children={<>
              <BillCompositionReadonly
                composition={bill.getGroupedComposition()}
                currency={billData.currency}
                isCustomerView={this.props.isCustomerView}
              />
              <BillTotal
                bill={billData}
                currency={billData.currency}
              />
            </>}
          />
          <Frills isBottom />
        </div>
      })}
    </div> :
  <Empty description='No bills available' />}
  <EditBill
    visible={this.state.showEditModal}
    billToUpdate={this.state.billToUpdate}
    businessId={this.state.billToUpdate.businessId}
    currency={this.state.billToUpdate.currency}
    hideModal={this.hideModal}
    ingredients={(this.props.ingredients || []).filter(({ businessId }) => businessId === this.state.billToUpdate.businessId)}
    products={(this.props.products || []).filter(({ businessId }) => businessId === this.state.billToUpdate.businessId)}
    orders={(this.props.orders || []).filter(({ businessId }) => businessId === this.state.billToUpdate.businessId)}
    sources={(this.props.allBusinesses.filter(({ id }) => id === this.state.billToUpdate.businessId)[0] || new Business().get()).billSources}
    onSuccess={this.props.onSuccess}
    isCustomerView={this.props.isCustomerView}
  />
  <PrintBill
    visible={this.state.showPrintModal}
    billToPrint={this.state.billToPrint}
    hideModal={this.hideModal}
    currentBusiness={this.props.allBusinesses.filter(({ id }) => id === this.state.billToUpdate.businessId)[0] || new Business().get()}
  />
</Spin>
}