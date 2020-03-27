import * as React from 'react';
import { Alert } from 'antd';
import AllBills from '../../manage_billing/components/all-bills';
import { fetchBillsByCustomer } from '../../../utils/bills';
import { Bill } from 'obiman-data-models';

export default class PastBills extends React.Component {
  constructor() {
    super();
    const bill = new Bill;
    this.state = {
      loading: false,
      errorMessage: '',
      bills: [],
      query: {
        status: [ bill.getPositiveEndState(), bill.getNegativeEndState() ]
      }
    }
  }
  componentDidMount = () => this.fetchBills();
  fetchBills = async () => {
    const { email } = this.props;
    this.setState({ loading: true, errorMessage: '' });
    try {
      const bills = await fetchBillsByCustomer(email, this.state.query);
      this.setState({ bills });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  render = () => <>
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    <br />
    <br />
    <AllBills
      loading={this.state.loading}
      bills={this.state.bills}
      isCustomerView
    />
  </>;
}