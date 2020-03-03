import * as React from 'react';
import AllProducts from './components/all-products';
import { Button, Alert } from 'antd';
import AddProduct from './components/add-product';
import {
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
  hideModal = () => this.setState({ showAddModal: false });
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
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    <AllProducts
      loading={this.state.loading}
      currency={this.props.currency}
      classifications={this.props.classifications}
      taxes={this.props.taxes}
      businessId={this.props.businessId}
      ingredients={this.state.ingredients}
      products={this.state.products}
      fetchAllProducts={this.fetchAllProducts}
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