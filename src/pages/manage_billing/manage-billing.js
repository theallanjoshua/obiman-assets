import * as React from 'react';
import Network from '../../utils/network';
import { Alert, Button } from 'antd';
import { BILLS_API_URL } from '../../constants/endpoints';
import {
  MANAGE_BILLS_PAGE_TITLE,
  ADD_BILL_TEXT
} from '../../constants/manage-billing';
import PageHeader from '../../components/page-header';
import Page from '../../components/page';
import { Consumer } from '../../context';
import AllBills from './components/all-bills';
import AddBill from './components/add-bill';
import EditBill from './components/edit-bill';
import { fetchAllIngredients } from '../../utils/ingredients';
import { fetchAllProducts, getEnrichedProducts } from '../../utils/products';
import PrintBill from './components/print-bill';

class ManageBillingComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      ingredients: [],
      products: [],
      bills: [],
      showAddModal: false,
      showEditModal: false,
      showPrintModal: false,
      billToUpdate: {},
      billToPrint: {}
    }
  }
  componentDidMount = () => {
    const { businessId } = this.props;
    if(businessId) {
      this.fetchAllBills()
    }
  };
  componentDidUpdate = prevProps => {
    const { businessId } = this.props;
    if(prevProps.businessId !== businessId && businessId) {
      this.fetchAllBills()
    }
  };
  fetchAllBills = async () => {
    const { businessId } = this.props;
    this.setState({ loading: true, errorMessage: '' });
    try {
      const ingredients = await fetchAllIngredients(businessId);
      const products = await fetchAllProducts(businessId);
      const enrichedProducts = getEnrichedProducts(products, ingredients);
      const response = await Network.get(BILLS_API_URL(businessId, 'status=Open'));
      const bills = response.bills
        .sort((prevBill, nextBill) => prevBill.source.localeCompare(nextBill.source));
      this.setState({ bills, ingredients, products: enrichedProducts });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  showAddModal = () => this.setState({ showAddModal: true });
  showEditModal = billToUpdate => this.setState({ billToUpdate, showEditModal: true });
  showPrintModal = billToPrint => this.setState({ billToPrint, showPrintModal: true });
  hideModal = () => this.setState({ showAddModal: false, showEditModal: false, showPrintModal: false });
  render = () => <Page>
    <PageHeader
      title={MANAGE_BILLS_PAGE_TITLE(this.state.bills.length)}
      extra={<React.Fragment>
        <Button
          style={{ marginRight: '4px' }}
          type='primary'
          icon='plus'
          onClick={this.showAddModal}
          children={ADD_BILL_TEXT}
        />
        <Button
          icon='reload'
          onClick={this.fetchAllBills}
        />
      </React.Fragment>}
    />
    <br />
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    <br />
    <AllBills
      currency={this.props.currency}
      loading={this.state.loading}
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
      billToUpdate={this.state.billToUpdate}
      fetchAllBills={this.fetchAllBills}
    />
    <PrintBill
      visible={this.state.showPrintModal}
      hideModal={this.hideModal}
      billToPrint={this.state.billToPrint}
    />
  </Page>;
}

export default class ManageBilling extends React.Component {
  componentDidMount = () => document.title = 'Billing - Obiman';
  render = () => <Consumer>
    {({ currentBusiness }) => <ManageBillingComponent
      businessId={currentBusiness.id}
      currency={currentBusiness.currency}
      sources={currentBusiness.metadata.sources || []}
    />}
  </Consumer>
}