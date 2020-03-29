import * as React from 'react';
import { Alert, Button } from 'antd';
import AllBills from '../../manage_billing/components/all-bills';
import { fetchBillsByCustomer } from '../../../utils/bills';
import { Bill } from 'obiman-data-models';
import { fetchBusinesses } from '../../../utils/businesses';
import { NO_OF_BILLS_PER_REQUEST } from '../../../constants/manage-billing';

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
      },
      next: null
    }
  }
  componentDidMount = () => this.fetchBills();
  fetchBills = async () => {
    const { email } = this.props;
    this.setState({ loading: true, errorMessage: '' });
    try {
      const { bills, next } = await fetchBillsByCustomer(email, { ...this.state.query, size: NO_OF_BILLS_PER_REQUEST });
      const businessIds = [ ...new Set(bills.map(({ businessId }) => businessId)) ];
      const businesses = await fetchBusinesses(businessIds);
      this.setState({ bills, businesses, next });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  fetchMoreBills = async () => {
    const { email } = this.props;
    this.setState({ loading: true, errorMessage: '' });
    try {
      const { next: existingNext, bills: existingBills, businesses: existingBusinesses } = this.state;
      const { bills, next } = await fetchBillsByCustomer(email, { ...this.state.query, size: NO_OF_BILLS_PER_REQUEST, next: existingNext });
      const businessIds = [ ...new Set(bills.map(({ businessId }) => businessId)) ]
          .filter(businessId => !existingBusinesses.filter(({ id }) => id === businessId).length);
      const businesses = await fetchBusinesses(businessIds);
      this.setState({
        bills: [ ...existingBills, ...bills ],
        businesses: [ ...existingBusinesses, ...businesses ],
        next
      });
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
      next={this.state.next}
      onLoadMore={this.fetchMoreBills}
    />
  </>;
}