import * as React from 'react';
import { Button, Form, Select } from 'antd';
import { Bill } from 'obiman-data-models';
import DateRange from '../../../components/date-range';

const bill = new Bill();

export default class SearchBills extends React.Component {
  constructor() {
    super();
    this.state = {
      status: [bill.getStartState()],
      source: [],
      updatedDateFrom: undefined,
      updatedDateTo: undefined
    }
  }
  setSource = source => this.setState({ source });
  setStatus = status => this.setState({ status });
  onUpdateDateChange = ({ from, to }) => this.setState({ updatedDateFrom: from, updatedDateTo: to });
  onSubmit = () => this.props.onChange(this.state);
  render = () => <Form
    layout='inline'
    className='center-align flex-wrap'
  >
    <Form.Item
      label={'Status'}
      children={
        <Select
          mode='multiple'
          style={{ minWidth: '200px' }}
          showSearch
          allowClear
          filterOption
          placeholder={'Eg: Open'}
          optionFilterProp='children'
          value={this.state.status || undefined}
          onChange={this.setStatus}
        >
          {[ bill.getStartState(), ...bill.getOtherStates(), bill.getEndState() ].map(state => <Select.Option key={state} value={state} children={state}/>)}
        </Select>
      }
    />
    <Form.Item
      label={'Source'}
      children={
        <Select
          mode='multiple'
          style={{ minWidth: '200px' }}
          showSearch
          allowClear
          filterOption
          placeholder={'Eg: Uber eats'}
          optionFilterProp='children'
          value={this.state.source || undefined}
          onChange={this.setSource}
        >
          {this.props.sources.map(source => <Select.Option key={source} value={source} children={source}/>)}
        </Select>
      }
    />
    <Form.Item
      label={'Date'}
      children={<DateRange
        from={this.state.updatedDateFrom}
        to={this.state.updatedDateTo}
        onChange={this.onUpdateDateChange}
      />}
    />
    <Form.Item
      children={<Button
        icon='search'
        children='Search'
        onClick={this.onSubmit}
      />}
    />
  </Form>
}