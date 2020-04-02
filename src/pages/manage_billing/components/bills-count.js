import * as React from 'react';
import { fetchBills } from '../../../utils/bills';
import { Alert, Spin } from 'antd';

export default class BillsCount extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      count: 0
    }
  }
  componentDidMount = () => this.fetchBillsCount();
  componentDidUpdate = prevProps => {
    const { businessId } = this.props;
    const { businessId: existingBusinessId } = prevProps;
    if(businessId !== existingBusinessId) this.fetchBillsCount();
  }
  fetchBillsCount = async () => {
    const { businessId, query } = this.props;
    if(businessId) {
      this.setState({ loading: true, errorMessage: '' });
      try {
        const { count } = await fetchBills(businessId, { ...query, onlyCount: true });
        this.setState({ count });
      } catch (errorMessage) {
        this.setState({ errorMessage });
      }
      this.setState({ loading: false });
    }
  }
  render = () => this.state.loading ? <Spin /> :
  this.state.errorMessage ? <Alert
    message='Oops!'
    description={this.state.errorMessage}
    type='error'
    showIcon
  /> : this.state.count;
}