import * as React from 'react';
import { Statistic } from 'antd';
import { Utils } from 'obiman-data-models';

const STATUS_MAP = {

};

export default class BillTotal extends React.Component {
  render = () => <div>
    <div
      className='space-between bottom-align'
      style={{ padding: '10px 24px' }}
    >
      <strong>Total:</strong>
      <Statistic
        precision={2}
        prefix={new Utils().getCurrencySymbol(this.props.currency)}
        value={this.props.bill.taxlessTotal}
        style={{ float: 'right' }}
      />
    </div>
    {Object.keys(this.props.bill.tax).map(type => <div
      key={type}
      className='space-between bottom-align'
      style={{ padding: '10px 24px' }}
    >
      <strong>{type}:</strong>
      <Statistic
        precision={2}
        prefix={`+ ${new Utils().getCurrencySymbol(this.props.currency)}`}
        value={this.props.bill.tax[type]}
        style={{ float: 'right' }}
        valueStyle={{ fontSize: 'initial' }}
      />
    </div>)}
    <div
      className='space-between bottom-align'
      style={{ padding: '24px' }}
    >
      <strong>To pay:</strong>
      <Statistic
        precision={2}
        prefix={new Utils().getCurrencySymbol(this.props.currency)}
        value={this.props.bill.total}
        valueStyle={{ color: '#cf1322' }}
      />
    </div>
  </div>
}