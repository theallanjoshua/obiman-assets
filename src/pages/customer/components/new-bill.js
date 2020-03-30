import * as React from 'react';
import QrReader from 'react-qr-reader'
import { Spin, Alert } from 'antd';
import { fetchBills } from '../../../utils/bills';
import { fetchAllIngredients } from '../../../utils/ingredients';
import { fetchAllProducts, getEnrichedProducts } from '../../../utils/products';
import { fetchBusinesses } from '../../../utils/businesses';
import AddBill from '../../manage_billing/components/add-bill';
import { Bill, Business } from 'obiman-data-models';

export default class NewBill extends React.Component {
  constructor() {
    super();
    this.state = {
      data: '',
      loading: false,
      errorMessage: '',
      successMessage: '',
      business: new Business().get(),
      ingredients: [],
      products: [],
      showAddModal: false,
      billToCreate: {},
      addSuccessful: false
    }
  }
  componentDidUpdate = (prevProps, prevState) => {
    if(this.state.data && this.state.data !== prevState.data) {
      this.initializeAddBill(this.state.data);
    }
  }
  initializeAddBill = async data => {
    const bill = new Bill;
    const { source, sourceId, businessId } = JSON.parse(decodeURI(data));
    this.setState({ loading: true, errorMessage: '' });
    try {
      const businesses = await fetchBusinesses(businessId ? [businessId] : []);
      if(!businesses || !businesses.length || businesses.length > 1) {
        this.setState({ loading: false, errorMessage: 'The QR code seems to be invalid.' });
        return;
      }
      const business = businesses[0];
      const query = {
        source: [source],
        sourceId: [sourceId],
        status: bill.getStates().filter(state => state !== bill.getPositiveEndState() && state !== bill.getNegativeEndState()),
        customer: [this.props.email]
      }
      const { bills } = await fetchBills(business.id, query);
      if(bills.length) {
        this.setState({ loading: false, errorMessage: 'Looks like there is already an ongoing order for this.\nYou can view that in the "Ongoing orders" tab.' });
        return;
      }
      const ingredients = await fetchAllIngredients(business.id);
      const products = await fetchAllProducts(business.id);
      const enrichedProducts = getEnrichedProducts(products, ingredients);
      this.setState({
        business,
        ingredients,
        products: enrichedProducts,
        showAddModal: true,
        billToCreate: { source, sourceId, customer: this.props.email }
      });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  hideModal = () => {
    this.setState({
      showAddModal: false,
      successMessage: this.state.addSuccessful ? 'Your order has been created successfully.\nSwitch over to the "Ongoing orders" tab to view it!' : '',
      addSuccessful: false
    });
    setTimeout(() => this.setState({ successMessage: '' }), 5000);
  }
  onSuccess = () => this.setState({ addSuccessful: true });
  onError = errorMessage => this.setState({ errorMessage });
  onScan = data => {
    if(data && data !== this.state.data) {
      this.setState({ data });
    }
  };
  render = () => <Spin spinning={this.state.loading}>
    {this.state.errorMessage ? <Alert message='Oops!' description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert message='Yay!' description={this.state.successMessage} type='success' showIcon /> : null}
    <br />
    {!this.state.data ? <div className='center-align'>
      <QrReader
        className='obiman-qr-scanner'
        onError={this.onError}
        onScan={this.onScan}
      />
    </div> : null}
    <AddBill
      isCustomerView
      visible={this.state.showAddModal}
      currency={this.state.business.currency}
      sources={this.state.business.billSources}
      businessId={this.state.business.id}
      ingredients={this.state.ingredients}
      products={this.state.products}
      bill={this.state.billToCreate}
      hideModal={this.hideModal}
      onSuccess={this.onSuccess}
    />
  </Spin>
}