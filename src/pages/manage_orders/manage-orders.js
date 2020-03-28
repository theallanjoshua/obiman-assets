import * as React from 'react';
import { Alert, Button } from 'antd';
import { MANAGE_ORDERS_PAGE_TITLE } from '../../constants/manage-orders';
import PageHeader from '../../components/page-header';
import { Consumer } from '../../context';
import AllOrders from './components/all-orders';
import { fetchAllProducts } from '../../utils/products';
import { fetchBills } from '../../utils/bills';
import { fetchOrders, getEnrichedOrders } from '../../utils/orders';

class ManageOrdersComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      products: [],
      bills: [],
      orders: []
    }
  }
  componentDidMount = () => {
    const { businessId } = this.props;
    if(businessId) {
      this.fetchOngoingOrders()
    }
  }
  componentDidUpdate = prevProps => {
    const { businessId } = this.props;
    if(prevProps.businessId !== businessId && businessId) {
      this.fetchOngoingOrders()
    }
  }
  fetchOngoingOrders = async () => {
    const { businessId } = this.props;
    this.setState({ loading: true, errorMessage: '' });
    try {
      const products = await fetchAllProducts(businessId);
      const bills = await fetchBills(businessId, { status: ['Open'] });
      const orderIds = bills.reduce((acc, { composition }) => [ ...acc, ...composition.filter(({ orderId }) => orderId).map(({ orderId }) => orderId) ], []);
      const orders = await fetchOrders(businessId, orderIds);
      const enrichedOrders = getEnrichedOrders(orders, products, bills);
      this.setState({ products, bills, orders: enrichedOrders });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  render = () => <>
    <PageHeader
      title={MANAGE_ORDERS_PAGE_TITLE(this.state.orders.length)}
      extra={<Button
        icon='reload'
        onClick={this.fetchOngoingOrders}
      />}
    />
    <br />
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    <br />
    <br />
    <AllOrders
      businessId={this.props.businessId}
      loading={this.state.loading}
      orders={this.state.orders}
      fetchOngoingOrders={this.fetchOngoingOrders}
    />
  </>;
}

export default class ManageOrders extends React.Component {
  componentDidMount = () => document.title = 'Orders - Obiman';
  render = () => <Consumer>
    {({ currentBusiness }) => <ManageOrdersComponent businessId={currentBusiness.id} />}
  </Consumer>
}