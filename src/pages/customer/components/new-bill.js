import * as React from 'react';
import QrReader from 'react-qr-reader'
import { Spin, Alert } from 'antd';
import { fetchBillsByCustomer } from '../../../utils/bills';
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
    const query = {
      source: [source],
      sourceId: [sourceId],
      status: bill.getStates().filter(state => state !== bill.getPositiveEndState() && state !== bill.getNegativeEndState())
    }
    this.setState({ loading: true, errorMessage: '' });
    try {
      const bills = await fetchBillsByCustomer(this.props.email, query);
      if(bills.length) {
        this.setState({ errorMessage: 'Oops! Looks like there is already an ongoing order for this. You can view that in the "Ongoing orders" tab.' })
      } else {
        const businesses = await fetchBusinesses([businessId]);
        if(businesses && businesses.length === 1) {
          const business = businesses[0]
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
        } else {
          this.setState({ errorMessage: 'Oops! The QR code seems to be invalid.' })
        }
      }
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  hideModal = () => {
    this.setState({
      showAddModal: false,
      successMessage: this.state.addSuccessful ? 'Your order has been created successfully. You can now view, edit & manage them in the "Ongoing orders" tab.' : '',
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
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    <br />
    <QrReader
      className='obiman-qr-scanner'
      onError={this.onError}
      onScan={this.onScan}
    />
    <AddBill
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