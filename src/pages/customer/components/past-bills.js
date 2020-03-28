import * as React from 'react';
import { Alert, Button } from 'antd';
import AllBills from '../../manage_billing/components/all-bills';
import { fetchBillsByCustomer } from '../../../utils/bills';
import { Bill } from 'obiman-data-models';
import { fetchBusinesses } from '../../../utils/businesses';

export default class PastBills extends React.Component {
  constructor() {
    super();
    const bill = new Bill;
    this.state = {
      loading: false,
      errorMessage: '',
      bills: [],
      businesses: [],
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
      const businessIds = [ ...new Set(bills.map(({ businessId }) => businessId)) ];
      const businesses = await fetchBusinesses(businessIds);
      this.setState({ bills, businesses });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  render = () => <>
    <div className='right-align'>
      <Button
        icon='reload'
        onClick={this.fetchBills}
      />
    </div>
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    <br />
    <br />
    <AllBills
      isCustomerView
      loading={this.state.loading}
      bills={this.state.bills}
      allBusinesses={this.state.businesses}
    />
  </>;
}