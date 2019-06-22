import * as React from 'react';
import AllBills from './components/all-bills';
import Network from '../../utils/network';
import { Bill } from 'obiman-data-models';
import { PageHeader, Button, Alert } from 'antd';
import AddBill from './components/add-bill';
import EditBill from './components/edit-bill';
import { BILLS_API_URL } from '../../constants/endpoints';
import {
  MANAGE_BILLS_PAGE_TITLE,
  ADD_BILL_BUTTON_TEXT
} from '../../constants/manage-products';
import { fetchAllProducts } from '../../utils/fetch-all-products';

export default class ManageBilling extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      products: [],
      ingredients: [],
      productToUpdate: {},
      showAddModal: false,
      showEditModal: false
    }
  }

  componentDidMount = () => {
    this.fetchAllProducts();
    this.fetchAllBills();
  }

  fetchAllProducts = async () => {
    this.setState({ loading: true, errorMessage: '' });
    try {
      const products = await fetchAllProducts();
      this.setState({ products });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }

  fetchAllBills = async () => {
    this.setState({ loading: true, errorMessage: '' });
    try {
      const products = await fetchAllProducts();
      this.setState({ products });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }

  showAddModal = () => this.setState({ showAddModal: true });

  showEditModal = productToUpdate => this.setState({ productToUpdate, showEditModal: true });

  hideModal = () => this.setState({ showAddModal: false, showEditModal: false });

  deleteProduct = async ({ id, label }) => {
    this.setState({ loading: true, errorMessage: '', successMessage: '' });
    try {
      await Network.delete(`${PRODUCTS_API_URL}/${id}`);
      this.setState({ errorMessage: '', successMessage: PRODUCT_DELETED_SUCCESSFULLY_MESSAGE(label) });
      setTimeout(() => this.setState({ successMessage: '' }), 2000);
      this.fetchAllProducts();
    } catch (errorMessage) {
      this.setState({ errorMessage, loading: false });
    }
  }

  render = () => <React.Fragment>
    <PageHeader
      title={MANAGE_PRODUCTS_PAGE_TITLE(this.state.products.length)}
      extra={<Button
        type='primary'
        icon='plus'
        onClick={this.showAddModal}
        children={ADD_PRODUCT_BUTTON_TEXT}
      />}
    />
    <br />
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    <br />
    <AllProducts
      loading={this.state.loading}
      products={this.state.products}
      showEditModal={this.showEditModal}
      deleteProduct={this.deleteProduct}
    />
    <AddProduct
      ingredients={this.state.ingredients}
      visible={this.state.showAddModal}
      hideModal={this.hideModal}
      fetchAllProducts={this.fetchAllProducts}
    />
    <EditProduct
      ingredients={this.state.ingredients}
      visible={this.state.showEditModal}
      productToUpdate={this.state.productToUpdate}
      hideModal={this.hideModal}
      fetchAllProducts={this.fetchAllProducts}
    />
  </React.Fragment>;
}