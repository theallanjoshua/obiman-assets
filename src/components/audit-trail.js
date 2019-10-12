import * as React from 'react';
import Timestamp from './timestamp';

export default class AuditTrail extends React.Component {
  render = () => <div>
    {this.props.prefixText}
    {' '}
    <Timestamp value={this.props.date}/>
    {` by ${this.props.user}`}
  </div>
}