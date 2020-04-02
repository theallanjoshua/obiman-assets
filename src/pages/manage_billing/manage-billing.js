import * as React from 'react';
import { Alert, Button, Tabs, Typography } from 'antd';
import {
  ADD_BILL_TEXT,
  NO_OF_BILLS_PER_REQUEST
} from '../../constants/manage-billing';
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
import BillsCount from './components/bills-count';

const bill = new Bill();
const { TabPane } = Tabs;
const { Text } = Typography;

class BillsByQuery extends React.Component {
  constructor(props) {
    super(props);
    const { query = {} } = props;
    this.state = {
      loading: false,
      errorMessage: '',
      bills: [],
      orders: [],
      query,
      next: null
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
    const { query } = this.state;
    if(businessId) {
      this.setState({ loading: true, errorMessage: '' });
      try {
        const { products } = this.props;
        const { bills, next } = await fetchBills(businessId, { ...query, size: NO_OF_BILLS_PER_REQUEST });
        const orderIds = bills.reduce((acc, { composition }) => [ ...acc, ...composition.filter(({ orderId }) => orderId).map(({ orderId }) => orderId) ], []);
        const orders = await fetchOrders(businessId, orderIds);
        const enrichedBills = getEnrichedBills(bills, products, orders);
        this.setState({
          bills: enrichedBills,
          orders: orders,
          next
        });
      } catch (errorMessage) {
        this.setState({ errorMessage });
      }
      this.setState({ loading: false });
    }
  }
  fetchMoreBills = async () => {
    const { id: businessId } = this.props.currentBusiness;
    const { query } = this.state;
    if(businessId) {
      this.setState({ loading: true, errorMessage: '' });
      try {
        const { products } = this.props;
        const { next: existingNext, orders: existingOrders, bills: existingBills } = this.state;
        const { bills, next } = await fetchBills(businessId, { ...query, size: NO_OF_BILLS_PER_REQUEST, next: existingNext });
        const orderIds = bills.reduce((acc, { composition }) => [ ...acc, ...composition.filter(({ orderId }) => orderId).map(({ orderId }) => orderId) ], []);
        const orders = await fetchOrders(businessId, orderIds);
        const enrichedBills = getEnrichedBills(bills, products, orders);
        this.setState({
          bills: [ ...existingBills, ...enrichedBills ],
          orders: [ ...existingOrders, orders ],
          next
        });
      } catch (errorMessage) {
        this.setState({ errorMessage });
      }
      this.setState({ loading: false });
    }
  }
  render = () => <>
    {this.state.errorMessage ? <br /> : null}
    {this.state.errorMessage ? <Alert message='Oops!' description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.errorMessage ? <br /> : null}
    <AllBills
      loading={this.state.loading}
      ingredients={this.props.ingredients.map(item => ({ ...item, businessId: this.props.currentBusiness.id }))}
      products={this.props.products.map(item => ({ ...item, businessId: this.props.currentBusiness.id }))}
      orders={this.state.orders.map(item => ({ ...item, businessId: this.props.currentBusiness.id }))}
      bills={this.state.bills}
      next={this.state.next}
      onSuccess={this.fetchAllBills}
      onLoadMore={this.fetchMoreBills}
      allBusinesses={[this.props.currentBusiness]}
    />
  </>;
}

class ManageBillingComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      errorMessage: '',
      ingredients: [],
      products: [],
      showAddModal: false,
      showGenerateQrCodeModal: false,
      query: { status: bill.getEndStates() }
    }
  }
  componentDidMount = () => this.fetchAllIngredientsAndProducts();
  componentDidUpdate = prevProps => {
    const { id } = this.props.currentBusiness;
    const { id: existingId } = prevProps.currentBusiness;
    if(id !== existingId) this.fetchAllIngredientsAndProducts();
  }
  fetchAllIngredientsAndProducts = async () => {
    const { id: businessId } = this.props.currentBusiness;
    if(businessId) {
      this.setState({ loading: true, errorMessage: '' });
      try {
        const ingredients = await fetchAllIngredients(businessId);
        const products = await fetchAllProducts(businessId);
        const enrichedProducts = getEnrichedProducts(products, ingredients);
        this.setState({ ingredients, products: enrichedProducts });
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
    <div className='right-align flex-wrap'>
      <Button
        style={{ marginRight: '4px' }}
        type='primary'
        icon='plus'
        disabled={this.state.loading}
        onClick={this.showAddModal}
        children={ADD_BILL_TEXT}
      />
      <Button
        style={{ marginRight: '4px' }}
        icon='qrcode'
        children='Generate QR Code'
        onClick={this.showGenerateQrCodeModal}
      />
      <Button
        icon='reload'
        onClick={this.fetchAllIngredientsAndProducts}
      />
    </div>
    <br />
    {this.state.errorMessage ? <Alert message='Oops!' description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.errorMessage ? <br /> : null}
    {!this.state.loading ? <Tabs defaultActiveKey={bill.getStartState()}>
      {bill.getStates()
      .filter(({ id }) => !bill.getEndStates().includes(id))
      .map(({ id, business: { label } }) => <TabPane
        key={id}
        tab={<span>
          {`${label} (`}
          <BillsCount businessId={this.props.currentBusiness.id} query={{ status: [ id ] }} />
          {`)`}
        </span>}
      >
        <BillsByQuery
          query={{ status: [ id ] }}
          currentBusiness={this.props.currentBusiness}
          ingredients={this.state.ingredients}
          products={this.state.products}
        />
      </TabPane>)}
      <TabPane key={'search'} tab={'Search'}>
        <SearchBills
          query={this.state.query}
          onChange={this.onSearchChange}
          sources={this.props.currentBusiness.billSources}
        />
        <br />
        <span>
          <Text style={{ paddingLeft: '10px' }} strong>{` Results`}</Text>
          {` (`}
          <BillsCount businessId={this.props.currentBusiness.id} query={this.state.query} />
          {`)`}
        </span>
        <BillsByQuery
          enableSearch
          query={this.state.query}
          ingredients={this.state.ingredients}
          products={this.state.products}
          currentBusiness={this.props.currentBusiness}
        />
      </TabPane>
    </Tabs> : null}
    <AddBill
      visible={this.state.showAddModal}
      ingredients={this.state.ingredients}
      products={this.state.products}
      hideModal={this.hideModal}
      onSuccess={this.fetchAllIngredientsAndProducts}
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