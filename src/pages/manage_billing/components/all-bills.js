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
                {` ${billData.sourceId}`}
                <div>
                  {!this.props.disableEdit ? <Tooltip
                    title={EDIT_BILL_BUTTON_TEXT}
                    children={<Button
                      type='link'
                      icon='edit'
                      onClick={() => this.showEditModal(bill)}
                    />}
                  /> : null}
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
                currency={this.props.currency || billData.currency}
              />
              <BillTotal
                bill={billData}
                currency={this.props.currency || billData.currency}
              />
            </>}
          />
          <Frills isBottom />
        </div>
      })}
    </div> :
  <Empty description='No bills available' />}
  {!this.props.disableEdit ? <EditBill
    visible={this.state.showEditModal}
    billToUpdate={this.state.billToUpdate}
    hideModal={this.hideModal}
    ingredients={this.props.ingredients || []}
    products={this.props.products || []}
    orders={this.props.orders || []}
    currency={this.props.currency}
    sources={this.props.sources || []}
    businessId={this.props.businessId}
    onSuccess={this.props.onSuccess}
  /> : null}
  <PrintBill
    visible={this.state.showPrintModal}
    billToPrint={this.state.billToPrint}
    hideModal={this.hideModal}
  />
</Spin>
}