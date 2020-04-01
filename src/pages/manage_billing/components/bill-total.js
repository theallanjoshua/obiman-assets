import * as React from 'react';
import { Statistic } from 'antd';
import { Bill, Utils } from 'obiman-data-models';

const bill = new Bill();
const BILL_STATES = [{
  condition: status => status === 'Pay',
  getLabel: (status, isCustomerView) => bill.getStateById(status)[isCustomerView ? 'customer' : 'business'].label,
  color: '#ffbf00'
  }, {
  condition: status => !bill.getEndStates().includes(status),
  getLabel: () => 'To pay',
  color: '#cf1322'
},{
  condition: status => bill.getPositiveEndState() === status,
  getLabel: (status, isCustomerView) => bill.getStateById(status)[isCustomerView ? 'customer' : 'business'].label,
  color: '#52c41a'
}, {
  condition: status => bill.getNegativeEndState() === status,
  getLabel: (status, isCustomerView) => bill.getStateById(status)[isCustomerView ? 'customer' : 'business'].label,
  color: '#bfbfbf'
}];

export default class BillTotal extends React.Component {
  render = () => <div>
    <div className='space-between bottom-align'>
      <strong>Total:</strong>
      <Statistic
        precision={2}
        prefix={new Utils().getCurrencySymbol(this.props.currency)}
        value={this.props.bill.taxlessTotal}
        style={{ float: 'right' }}
      />
    </div>
    {Object.keys(this.props.bill.tax).map(type => <div
      key={type} className='space-between bottom-align'>
      <strong>{type}:</strong>
      <Statistic
        precision={2}
        prefix={`+ ${new Utils().getCurrencySymbol(this.props.currency)}`}
        value={this.props.bill.tax[type]}
        style={{ float: 'right' }}
        valueStyle={{ fontSize: 'initial' }}
      />
    </div>)}
    <br />
      {BILL_STATES
        .filter(({ condition }) => condition(this.props.bill.status))
        .filter((item, index) => index === 0)
        .map(({ getLabel, color }) => <div key={this.props.bill.status} className='space-between bottom-align'>
        <strong>{getLabel(this.props.bill.status, this.props.isCustomerView)}:</strong>
        <Statistic
          precision={2}
          prefix={new Utils().getCurrencySymbol(this.props.currency)}
          value={this.props.bill.total}
          valueStyle={{ color }}
        />
      </div>)}
  </div>
}