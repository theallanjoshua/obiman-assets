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
      billToUpdate: {}
    }
  }
  componentDidMount = () => {
    const { businessId } = this.props;
    if(businessId) {
      this.fetchAllBills(businessId)
    }
  };
  componentDidUpdate = (preProps) => {
    const { businessId } = this.props;
    if(preProps.businessId !== businessId && preProps) {
      this.fetchAllBills(businessId)
    }
  };
  fetchAllBills = async businessId => {
    this.setState({ loading: true, errorMessage: '' });
    try {
      const ingredients = await fetchAllIngredients(businessId);
      const products = await fetchAllProducts(businessId);
      const enrichedProducts = getEnrichedProducts(products, ingredients);
      const response = await Network.get(BILLS_API_URL(businessId, 'status=Open'));
      const bills = response.bills
        .sort((prevBill, nextBill) => prevBill.label.localeCompare(nextBill.label));
      this.setState({ bills, ingredients, products: enrichedProducts });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  showAddModal = () => this.setState({ showAddModal: true });
  showEditModal = billToUpdate => this.setState({ billToUpdate, showEditModal: true });
  hideModal = () => this.setState({ showAddModal: false, showEditModal: false });
  render = () => <Page>
    <PageHeader
      title={MANAGE_BILLS_PAGE_TITLE(this.state.bills.length)}
      extra={<Button
        style={{ marginRight: '4px' }}
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
    <AllBills
      currency={this.props.currency}
      loading={this.state.loading}
      bills={this.state.bills}
      showEditModal={this.showEditModal}
    />
    <AddBill
      currency={this.props.currency}
      visible={this.state.showAddModal}
      hideModal={this.hideModal}
      businessId={this.props.businessId}
      ingredients={this.state.ingredients}
      products={this.state.products}
      fetchAllBills={this.fetchAllBills}
    />
    <EditBill
      currency={this.props.currency}
      visible={this.state.showEditModal}
      hideModal={this.hideModal}
      businessId={this.props.businessId}
      ingredients={this.state.ingredients}
      products={this.state.products}
      billToUpdate={this.state.billToUpdate}
      fetchAllBills={this.fetchAllBills}
    />
  </Page>;
}

export default class ManageBilling extends React.Component {
  render = () => <Consumer>
    {({ businessId, currency }) => <ManageBillingComponent
      businessId={businessId}
      currency={currency}
    />}
  </Consumer>
}