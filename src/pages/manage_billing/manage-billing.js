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
import { fetchAllIngredients } from '../../utils/ingredients';
import { fetchAllProducts, getEnrichedProducts } from '../../utils/products';
import { fetchBills, getEnrichedBills } from '../../utils/bills';
import { fetchOrders } from '../../utils/orders';
import SearchBills from './components/search-bills';
import GenerateBillQrCode from './components/generate-bill-qr-code';

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
      showGenerateQrCodeModal: false,
      query: { status: ['Open'] }
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
      const enrichedProducts = getEnrichedProducts(products, ingredients).map(item => ({ ...item, businessId }));
      const bills = await fetchBills(businessId, this.state.query);
      const orderIds = bills.reduce((acc, { composition }) => [ ...acc, ...composition.filter(({ orderId }) => orderId).map(({ orderId }) => orderId) ], []);
      const orders = await fetchOrders(businessId, orderIds);
      const enrichedBills = getEnrichedBills(bills, products, orders);
      this.setState({
        ingredients: ingredients.map(item => ({ ...item, businessId })),
        products: enrichedProducts,
        bills: enrichedBills,
        orders: orders.map(item => ({ ...item, businessId }))
      });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  showAddModal = () => this.setState({ showAddModal: true });
  showGenerateQrCodeModal = () => this.setState({ showGenerateQrCodeModal: true });
  hideModal = () => this.setState({ showAddModal: false, showGenerateQrCodeModal: false });
  onSearchChange = async query => {
    await this.setState({ query });
    this.fetchAllBills();
  }
  render = () => <>
    <PageHeader
      title={MANAGE_BILLS_PAGE_TITLE(this.state.bills.length)}
      extra={<>
        <Button
          style={{ marginRight: '4px' }}
          type='primary'
          icon='plus'
          onClick={this.showAddModal}
          children={ADD_BILL_TEXT}
        />
        <Button
          style={{ marginRight: '4px' }}
          icon='qrcode'
          children='Generate QR Code'
          onClick={this.showGenerateQrCodeModal}
        />
      </>}
    />
    <br />
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    <br />
    <SearchBills
      onChange={this.onSearchChange}
      sources={this.props.sources}
    />
    <br />
    <br />
    <AllBills
      loading={this.state.loading}
      ingredients={this.state.ingredients}
      products={this.state.products}
      orders={this.state.orders}
      bills={this.state.bills}
      onSuccess={this.fetchAllBills}
      currency={this.props.currency}
      sources={this.props.sources}
    />
    <AddBill
      visible={this.state.showAddModal}
      ingredients={this.state.ingredients}
      products={this.state.products}
      hideModal={this.hideModal}
      onSuccess={this.fetchAllBills}
      currency={this.props.currency}
      sources={this.props.sources}
      businessId={this.props.businessId}
    />
    <GenerateBillQrCode
      visible={this.state.showGenerateQrCodeModal}
      hideModal={this.hideModal}
      sources={this.props.sources}
      businessId={this.props.businessId}
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