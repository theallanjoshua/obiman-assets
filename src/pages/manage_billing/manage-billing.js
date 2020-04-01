import * as React from 'react';
import { Alert, Button } from 'antd';
import {
  MANAGE_BILLS_PAGE_TITLE,
  ADD_BILL_TEXT,
  NO_OF_BILLS_PER_REQUEST
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
import { Bill } from 'obiman-data-models';

const bill = new Bill();

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
      query: { status: bill.getStateIds().filter(id => !bill.getEndStates().includes(id)) },
      next: null,
      billsCount: 0
    }
  }
  componentDidMount = () => this.fetchAllBills();
  componentDidUpdate = prevProps => {
    const { id } = this.props.currentBusiness;
    const { id: existingId } = prevProps.currentBusiness;
    if(id !== existingId) this.fetchAllBills();
  }
  fetchAllBills = async () => {
    const { id: businessId } = this.props.currentBusiness;
    if(businessId) {
      this.setState({ loading: true, errorMessage: '' });
      try {
        const ingredients = await fetchAllIngredients(businessId);
        const products = await fetchAllProducts(businessId);
        const enrichedProducts = getEnrichedProducts(products, ingredients).map(item => ({ ...item, businessId }));
        const { count: billsCount } = await fetchBills(businessId, { ...this.state.query, onlyCount: true });
        const { bills, next } = await fetchBills(businessId, { ...this.state.query, size: NO_OF_BILLS_PER_REQUEST });
        const orderIds = bills.reduce((acc, { composition }) => [ ...acc, ...composition.filter(({ orderId }) => orderId).map(({ orderId }) => orderId) ], []);
        const orders = await fetchOrders(businessId, orderIds);
        const enrichedBills = getEnrichedBills(bills, products, orders);
        this.setState({
          ingredients: ingredients.map(item => ({ ...item, businessId })),
          products: enrichedProducts,
          bills: enrichedBills,
          orders: orders.map(item => ({ ...item, businessId })),
          next,
          billsCount
        });
      } catch (errorMessage) {
        this.setState({ errorMessage });
      }
      this.setState({ loading: false });
    }
  }
  fetchMoreBills = async () => {
    const { id: businessId } = this.props.currentBusiness;
    if(businessId) {
      this.setState({ loading: true, errorMessage: '' });
      try {
        const { products, next: existingNext, orders: existingOrders, bills: existingBills } = this.state;
        const { bills, next } = await fetchBills(businessId, { ...this.state.query, size: NO_OF_BILLS_PER_REQUEST, next: existingNext });
        const orderIds = bills.reduce((acc, { composition }) => [ ...acc, ...composition.filter(({ orderId }) => orderId).map(({ orderId }) => orderId) ], []);
        const orders = await fetchOrders(businessId, orderIds);
        const enrichedBills = getEnrichedBills(bills, products, orders);
        this.setState({
          bills: [ ...existingBills, ...enrichedBills ],
          orders: [ ...existingOrders, orders.map(item => ({ ...item, businessId })) ],
          next
        });
      } catch (errorMessage) {
        this.setState({ errorMessage });
      }
      this.setState({ loading: false });
    }
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
      title={MANAGE_BILLS_PAGE_TITLE(this.state.billsCount)}
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
    {this.state.errorMessage ? <Alert message='Oops!' description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert message='Yay!' description={this.state.successMessage} type='success' showIcon /> : null}
    {this.state.successMessage || this.state.errorMessage ? <br /> : null}
    <SearchBills
      onChange={this.onSearchChange}
      sources={this.props.currentBusiness.billSources}
    />
    <br />
    <br />
    <AllBills
      loading={this.state.loading}
      ingredients={this.state.ingredients}
      products={this.state.products}
      orders={this.state.orders}
      bills={this.state.bills}
      next={this.state.next}
      onSuccess={this.fetchAllBills}
      onLoadMore={this.fetchMoreBills}
      allBusinesses={[this.props.currentBusiness]}
    />
    <AddBill
      visible={this.state.showAddModal}
      ingredients={this.state.ingredients}
      products={this.state.products}
      hideModal={this.hideModal}
      onSuccess={this.fetchAllBills}
      businessId={this.props.currentBusiness.id}
      currency={this.props.currentBusiness.currency}
      sources={this.props.currentBusiness.billSources}
    />
    <GenerateBillQrCode
      visible={this.state.showGenerateQrCodeModal}
      hideModal={this.hideModal}
      businessId={this.props.currentBusiness.id}
      sources={this.props.currentBusiness.billSources}
    />
  </>;
}

export default class ManageBilling extends React.Component {
  componentDidMount = () => document.title = 'Billing - Obiman';
  render = () => <Consumer>
    {({ currentBusiness }) => <ManageBillingComponent currentBusiness={currentBusiness} />}
  </Consumer>
}