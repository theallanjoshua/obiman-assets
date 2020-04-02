import * as React from 'react';
import { Card, Button, Tooltip, Alert } from 'antd';
import {
  EDIT_BILL_BUTTON_TEXT,
  PRINT_BILL_BUTTON_TEXT
} from '../../../constants/manage-billing';
import BillTotal from './bill-total';
import BillCompositionReadonly from './bill-composition-readonly';
import { Bill as BDM, Order } from 'obiman-data-models';
import { ORDERS_API_URL } from '../../../constants/endpoints';
import Network from '../../../utils/network';

const order = new Order();
const orderCancelState = order.getStates().filter(({ isNegative, isEndState }) => isNegative && !isEndState)[0];

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

export default class Bill extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      successMessage: '',
      selectedOrderIds: []
    }
  }
  onSelectionChange = selectedOrderIds => this.setState({ selectedOrderIds });
  cancelOrders = async () => {
    const { bill: { businessId }, orders } = this.props;
    const ordersToUpdate = orders
      .filter(({ id }) => this.state.selectedOrderIds.includes(id))
      .map(order => new Order(order)
        .setStatus(orderCancelState.id)
        .get())
    this.setState({ loading: true, errorMessage: '', successMessage: '' });
    try {
      await Network.put(ORDERS_API_URL(businessId), ordersToUpdate);
      this.setState({ successMessage: 'Cancellation request successful', selectedOrderIds: [] });
      this.props.onSuccess();
      setTimeout(() => this.setState({ successMessage: '' }), 2000);
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  saveBill = async bill => {
    const { label } = new BDM().getStateById(bill.status)[this.props.isCustomerView ? 'customer' : 'business'];
    this.setState({ loading: true, errorMessage: '', successMessage: '' });
    try {
      await this.props.onSave(bill);
      this.setState({ errorMessage: '', successMessage: `${label} successfully` });
      setTimeout(() => this.setState({ successMessage: '' }), 2000);
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  render = () => {
    const bill = new BDM(this.props.bill);
    const billData = bill.get();
    const { nextStates } = bill.getStateById(billData.status)[this.props.isCustomerView ? 'customer' : 'business'];
    return <>
      <Frills />
      <Card
        loading={this.state.loading}
        bordered={false}
        style={{
          maxWidth: '90vw',
          width: '300px',
          margin: '10px'
        }}
        bodyStyle={{ padding: '0px' }}
        title={<div className='flex-wrap space-between'>
          {`${this.props.isCustomerView ? `${billData.businessLabel} (` : ''}${billData.source} ${billData.sourceId}${this.props.isCustomerView ? ')' : ''}`}
          <div>
            {this.props.isCustomerView && bill.getEndStates().includes(billData.status) ? null : <Tooltip
              title={EDIT_BILL_BUTTON_TEXT}
              children={<Button
                type='link'
                icon='edit'
                onClick={() => this.props.showEditModal(billData)}
              />}
            />}
            <Tooltip
              title={PRINT_BILL_BUTTON_TEXT}
              children={<Button
                type='link'
                icon='printer'
                onClick={() => this.props.showPrintModal(billData)}
              />}
            />
          </div>
        </div>}
        children={<>
          <BillCompositionReadonly
            composition={bill.getGroupedComposition()}
            currency={billData.currency}
            billStatus={billData.status}
            isCustomerView={this.props.isCustomerView}
            selectedOrderIds={this.state.selectedOrderIds}
            onSelectionChange={this.onSelectionChange}
          />
          <br />
          <div style={{ padding: '0px 24px 24px 24px' }}>
            <BillTotal
              bill={billData}
              currency={billData.currency}
              isCustomerView={this.props.isCustomerView}
            />
            <br />
            {this.state.errorMessage ? <Alert message='Oops!' description={this.state.errorMessage} type='error' showIcon /> : null}
            {this.state.successMessage ? <Alert message='Yay!' description={this.state.successMessage} type='success' showIcon /> : null}
            {this.state.successMessage || this.state.errorMessage ? <br /> : null}
            {this.state.selectedOrderIds.length ? <Button
              style={{ margin: '5px' }}
              children={orderCancelState.id}
              type={'danger'}
              block
              disabled={this.state.loading}
              onClick={this.cancelOrders}
            /> : !billData.composition.filter(({ status }) => !order.getEndStates().includes(status)).length ? <div className='space-around'>
              {nextStates.map(({ id, label }) => <Button
                style={{ margin: '5px' }}
                key={id}
                children={label}
                type={bill.getStateById(id).isNegative ? 'danger' : 'primary'}
                block
                disabled={this.state.loading}
                onClick={() => this.saveBill({ ...billData, status: id })}
              />)}
            </div> : null}
          </div>
        </>}
      />
      <Frills isBottom />
    </>
  }
}