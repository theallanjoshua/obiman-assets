import * as React from 'react';
import { DatePicker } from 'antd';
import { DATE_TIME_FORMAT } from '../constants/app';

export default class DateRange extends React.Component {
  constructor() {
    super();
    this.state = { endOpen: false };
  }
  onChange = (field, value) => {
    const { from, to } = this.props;
    this.props.onChange({ from, to, [field]: value });
  };
  onFromChange = value => this.onChange('from', value);
  onToChange = value => this.onChange('to', value);
  handleStartOpenChange = startOpen => this.setState({ endOpen: !startOpen });
  handleEndOpenChange = endOpen => this.setState({ endOpen });
  render = () => {
    const { from, to } = this.props;
    return (
      <div className='flex-wrap'>
        <DatePicker
          style={{
            width: '240px',
            margin: '2px'
          }}
          disabledDate={from => from && to && from.valueOf() > to.valueOf()}
          showTime
          format={DATE_TIME_FORMAT}
          value={from}
          placeholder={'From'}
          onChange={this.onFromChange}
          onOpenChange={this.handleStartOpenChange}
        />
        <DatePicker
          style={{
            width: '240px',
            margin: '2px'
          }}
          disabledDate={to => to && from && to.valueOf() <= from.valueOf()}
          showTime
          format={DATE_TIME_FORMAT}
          value={to}
          placeholder={'To'}
          onChange={this.onToChange}
          open={this.state.endOpen}
          onOpenChange={this.handleEndOpenChange}
        />
      </div>
    );
  }
}