import * as React from 'react';
import { Button, Form, Select, DatePicker } from 'antd';
import { Bill } from 'obiman-data-models';
import { DATE_TIME_FORMAT } from '../../../constants/app';

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
  setUpdatedDateFrom = updatedDateFrom => this.setState({ updatedDateFrom });
  setUpdatedDateTo = updatedDateTo => this.setState({ updatedDateTo });
  onSubmit = () => {
    const { status, source, updatedDateFrom, updatedDateTo } = this.state;
    const query = Object.keys(this.state).reduce((acc, key) => {
      switch(key) {
        case 'status': {
          return status.length ? [ ...acc, `status=${status.join(',')}` ]: [ ...acc ];
        };
        case 'source': {
          return source.length ? [ ...acc, `source=${source.join(',')}` ]: [ ...acc ];
        };
        case 'updatedDateFrom': {
          return updatedDateFrom ? [ ...acc, `updatedDateFrom=${updatedDateFrom.valueOf()}`] : [ ...acc ];
        };
        case 'updatedDateTo': {
          return updatedDateTo ? [ ...acc, `updatedDateTo=${updatedDateTo.valueOf()}`] : [ ...acc ];
        }
        default: {
          return [ ...acc ];
        }
      }
    }, []);
    console.log(query);
    this.props.onChange(query.join('&'));
  }
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
      label={'From'}
      children={<DatePicker
        style={{ width: '100%' }}
        showTime
        value={this.state.updatedDateFrom}
        format={DATE_TIME_FORMAT}
        onChange={this.setUpdatedDateFrom}
      />}
    />
    <Form.Item
      label={'To'}
      children={<DatePicker
        style={{ width: '100%' }}
        showTime
        value={this.state.updatedDateTo}
        format={DATE_TIME_FORMAT}
        onChange={this.setUpdatedDateTo}
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