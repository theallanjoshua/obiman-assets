import * as React from 'react';
import { Alert, Button } from 'antd';
import AllBills from '../../manage_billing/components/all-bills';
import { fetchBillsByCustomer, getEnrichedBills } from '../../../utils/bills';
import { fetchAllIngredients } from '../../../utils/ingredients';
import { fetchAllProducts, getEnrichedProducts } from '../../../utils/products';
import { fetchOrders } from '../../../utils/orders';
import { fetchBusinesses } from '../../../utils/businesses';
import { Bill } from 'obiman-data-models';

export default class OpenBills extends React.Component {
  constructor() {
    super();
    const bill = new Bill;
    this.state = {
      loading: false,
      errorMessage: '',
      bills: [],
      ingredients: [],
      products: [],
      orders: [],
      businesses: [],
      query: {
        status: bill.getStates().filter(state => state !== bill.getPositiveEndState() && state !== bill.getNegativeEndState())
      }
    }
  }
  componentDidMount = () => this.fetchBills();
  fetchIngredients = async businessId => {
    try {
      const ingredients = await fetchAllIngredients(businessId);
      const { ingredients: existingIngredients } = this.state;
      await this.setState({ ingredients: [ ...existingIngredients, ...ingredients.map(item => ({ ...item, businessId })) ] });
    } catch (error) {
      throw error;
    }
  }
  fetchProducts = async businessId => {
    try {
      const products = await fetchAllProducts(businessId);
      const { ingredients, products: existingProducts } = this.state;
      const enrichedProducts = getEnrichedProducts(products, ingredients.filter(item => item.businessId === businessId));
      await this.setState({ products: [ ...existingProducts, ...enrichedProducts.map(item => ({ ...item, businessId })) ] });
    } catch (error) {
      throw error;
    }
  }
  fetchOrders = async (businessId, bills) => {
    try {
      const orderIds = bills
        .filter(item => item.businessId === businessId)
        .reduce((acc, { composition }) => [ ...acc, ...composition.filter(({ orderId }) => orderId).map(({ orderId }) => orderId) ], []);
      const orders = await fetchOrders(businessId, orderIds);
      const { orders: existingOrders } = this.state;
      await this.setState({ orders: [ ...existingOrders, ...orders.map(item => ({ ...item, businessId })) ] });
    } catch (error) {
      throw error;
    }
  }
  fetchBills = async () => {
    const { email } = this.props;
    this.setState({ loading: true, errorMessage: '' });
    try {
      const { bills } = await fetchBillsByCustomer(email, this.state.query);
      const businessIds = [ ...new Set(bills.map(({ businessId }) => businessId)) ];
      await Promise.all(businessIds.map(businessId => this.fetchIngredients(businessId)));
      await Promise.all(businessIds.map(businessId => this.fetchProducts(businessId)));
      await Promise.all(businessIds.map(businessId => this.fetchOrders(businessId, bills)));
      const businesses = await fetchBusinesses(businessIds);
      const { products, orders } = this.state;
      const enrichedBills = getEnrichedBills(bills, products, orders);
      this.setState({ bills: enrichedBills, businesses });
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
    {this.state.errorMessage ? <Alert message='Oops!' description={this.state.errorMessage} type='error' showIcon /> : null}
    <br />
    <br />
    <AllBills
      isCustomerView
      loading={this.state.loading}
      bills={this.state.bills}
      ingredients={this.state.ingredients}
      products={this.state.products}
      orders={this.state.orders}
      bills={this.state.bills}
      allBusinesses={this.state.businesses}
      onSuccess={this.fetchBills}
    />
  </>;
}