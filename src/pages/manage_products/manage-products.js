import * as React from 'react';
import AllProducts from './components/all-products';
import Network from '../../utils/network';
import { Button, Alert } from 'antd';
import AddProduct from './components/add-product';
import EditProduct from './components/edit-product';
import { PRODUCTS_API_URL } from '../../constants/endpoints';
import {
  PRODUCT_DELETED_SUCCESSFULLY_MESSAGE,
  MANAGE_PRODUCTS_PAGE_TITLE,
  ADD_PRODUCT_BUTTON_TEXT
} from '../../constants/manage-products';
import { fetchAllIngredients } from '../../utils/ingredients';
import { fetchAllProducts, getEnrichedProducts } from '../../utils/products';
import PageHeader from '../../components/page-header';
import Page from '../../components/page';
import { Consumer } from '../../context';

class ManageProductsComponent extends React.Component {
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
    const { businessId } = this.props;
    if(businessId) {
      this.fetchAllProducts()
    }
  };
  componentDidUpdate = prevProps => {
    const { businessId } = this.props;
    if(prevProps.businessId !== businessId && businessId) {
      this.fetchAllProducts()
    }
  };
  fetchAllProducts = async () => {
    const { businessId } = this.props;
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
  showAddModal = () => this.setState({ showAddModal: true });
  showEditModal = productToUpdate => this.setState({ productToUpdate, showEditModal: true });
  hideModal = () => this.setState({ showAddModal: false, showEditModal: false });
  deleteProduct = async ({ id, label }) => {
    const { businessId } = this.props;
    this.setState({ loading: true, errorMessage: '', successMessage: '' });
    try {
      await Network.delete(`${PRODUCTS_API_URL(businessId)}/${id}`);
      this.setState({ errorMessage: '', successMessage: PRODUCT_DELETED_SUCCESSFULLY_MESSAGE(label) });
      setTimeout(() => this.setState({ successMessage: '' }), 2000);
      this.fetchAllProducts(businessId);
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  render = () => <Page>
    <PageHeader
      title={MANAGE_PRODUCTS_PAGE_TITLE(this.state.products.length)}
      extra={<React.Fragment>
        <Button
          style={{ marginRight: '4px' }}
          type='primary'
          icon='plus'
          onClick={this.showAddModal}
          children={ADD_PRODUCT_BUTTON_TEXT}
        />
        <Button
          icon='reload'
          onClick={this.fetchAllProducts}
        />
      </React.Fragment>}
    />
    <br />
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    <br />
    <AllProducts
      currency={this.props.currency}
      loading={this.state.loading}
      products={this.state.products}
      showEditModal={this.showEditModal}
      deleteProduct={this.deleteProduct}
    />
    <AddProduct
      currency={this.props.currency}
      classifications={this.props.classifications}
      taxes={this.props.taxes}
      businessId={this.props.businessId}
      ingredients={this.state.ingredients}
      visible={this.state.showAddModal}
      hideModal={this.hideModal}
      fetchAllProducts={this.fetchAllProducts}
    />
    <EditProduct
      currency={this.props.currency}
      classifications={this.props.classifications}
      taxes={this.props.taxes}
      businessId={this.props.businessId}
      ingredients={this.state.ingredients}
      visible={this.state.showEditModal}
      productToUpdate={this.state.productToUpdate}
      hideModal={this.hideModal}
      fetchAllProducts={this.fetchAllProducts}
    />
  </Page>;
}

export default class ManageProducts extends React.Component {
  componentDidMount = () => document.title = 'Products - Obiman';
  render = () => <Consumer>
    {({ currentBusiness }) => <ManageProductsComponent
      businessId={currentBusiness.id}
      currency={currentBusiness.currency}
      classifications={currentBusiness.metadata.productClassifications || []}
      taxes={currentBusiness.metadata.taxes || []}
    />}
  </Consumer>
}