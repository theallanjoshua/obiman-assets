import * as React from 'react';
import { Alert, Button } from 'antd';
import {
  MANAGE_BILLS_PAGE_TITLE,
  ADD_BILL_TEXT
} from '../../constants/manage-billing';
import PageHeader from '../../components/page-header';
import { Consumer } from '../../context';
import AllBills from './components/all-bills';
import AddBill from './components/add-bill';
import EditBill from './components/edit-bill';
import { fetchAllIngredients } from '../../utils/ingredients';
import { fetchAllProducts, getEnrichedProducts } from '../../utils/products';
import { fetchBills, getEnrichedBills } from '../../utils/bills';
import { fetchOrders } from '../../utils/orders';
import PrintBill from './components/print-bill';
import SearchBills from './components/search-bills';

class ManageBillingComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      ingredients: [],
      products: [],
      bills: [],
      orders: [],
      showAddModal: false,
      showEditModal: false,
      showPrintModal: false,
      billToUpdate: {},
      billToPrint: {},
      query: {
        status: ['Open']
      }
    }
  }
  componentDidMount = () => {
    const { businessId } = this.props;
    if(businessId) {
      this.fetchAllBills()
    }
  }
  componentDidUpdate = prevProps => {
    const { businessId } = this.props;
    if(prevProps.businessId !== businessId && businessId) {
      this.fetchAllBills()
    }
  }
  fetchAllBills = async () => {
    const { businessId } = this.props;
    this.setState({ loading: true, errorMessage: '' });
    try {
      const ingredients = await fetchAllIngredients(businessId);
      const products = await fetchAllProducts(businessId);
      const enrichedProducts = getEnrichedProducts(products, ingredients);
      const bills = await fetchBills(businessId, this.state.query);
      const orderIds = bills.reduce((acc, { composition }) => [ ...acc, ...composition.filter(({ orderId }) => orderId).map(({ orderId }) => orderId) ], []);
      const orders = await fetchOrders(businessId, orderIds);
      const enrichedBills = getEnrichedBills(bills, products, orders);
      this.setState({ ingredients, products: enrichedProducts, bills: enrichedBills, orders });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  showAddModal = () => this.setState({ showAddModal: true });
  showEditModal = billToUpdate => this.setState({ billToUpdate, showEditModal: true });
  showPrintModal = billToPrint => this.setState({ billToPrint, showPrintModal: true });
  hideModal = () => this.setState({ showAddModal: false, showEditModal: false, showPrintModal: false });
  onSearchChange = async query => {
    await this.setState({ query });
    this.fetchAllBills();
  }
  render = () => <>
    <PageHeader
      title={MANAGE_BILLS_PAGE_TITLE(this.state.bills.length)}
      extra={<Button
        type='primary'
        icon='plus'
        onClick={this.showAddModal}
        children={ADD_BILL_TEXT}
      />}
    />
    <br />
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    <br />
    <SearchBills
      sources={this.props.sources}
      onChange={this.onSearchChange}
    />
    <br />
    <br />
    <AllBills
      currency={this.props.currency}
      loading={this.state.loading}
      products={this.state.products}
      bills={this.state.bills}
      showEditModal={this.showEditModal}
      showPrintModal={this.showPrintModal}
    />
    <AddBill
      currency={this.props.currency}
      sources={this.props.sources}
      visible={this.state.showAddModal}
      hideModal={this.hideModal}
      businessId={this.props.businessId}
      ingredients={this.state.ingredients}
      products={this.state.products}
      orders={this.state.orders}
      fetchAllBills={this.fetchAllBills}
    />
    <EditBill
      currency={this.props.currency}
      sources={this.props.sources}
      visible={this.state.showEditModal}
      hideModal={this.hideModal}
      businessId={this.props.businessId}
      ingredients={this.state.ingredients}
      products={this.state.products}
      orders={this.state.orders}
      billToUpdate={this.state.billToUpdate}
      fetchAllBills={this.fetchAllBills}
    />
    <PrintBill
      visible={this.state.showPrintModal}
      hideModal={this.hideModal}
      products={this.state.products}
      billToPrint={this.state.billToPrint}
    />
  </>;
}

export default class ManageBilling extends React.Component {
  componentDidMount = () => document.title = 'Billing - Obiman';
  render = () => <Consumer>
    {({ currentBusiness }) => <ManageBillingComponent
      businessId={currentBusiness.id}
      currency={currentBusiness.currency}
      sources={currentBusiness.billSources || []}
    />}
  </Consumer>
}