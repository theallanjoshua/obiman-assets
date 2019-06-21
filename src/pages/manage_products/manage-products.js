import * as React from 'react';
import AllProducts from './components/all-products';
import Network from '../../utils/network';
import { Product } from 'obiman-data-models';
import { PageHeader, Button, Alert } from 'antd';
import AddProduct from './components/add-product';
import EditProduct from './components/edit-product';
import { PRODUCTS_API_URL } from '../../constants/endpoints';
import {
  PRODUCT_DELETED_SUCCESSFULLY_MESSAGE,
  MANAGE_PRODUCTS_PAGE_TITLE,
  ADD_PRODUCT_BUTTON_TEXT
} from '../../constants/manage-products';
import { fetchAllIngredients } from '../../utils/fetch-all-ingredients';
import convert from 'convert-units';

export default class ManageProducts extends React.Component {
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

  componentDidMount = () => this.init();

  init = async () => {
    await this.fetchAllIngredients();
    await this.fetchAllProducts();
  }

  fetchAllIngredients = async () => {
    this.setState({ loading: true, errorMessage: '' });
    try {
      const ingredients = await fetchAllIngredients();
      this.setState({ ingredients });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }

  fetchAllProducts = async () => {
    this.setState({ loading: true, errorMessage: '' });
    try {
      const response = await Network.get(PRODUCTS_API_URL);
      const products = response.products
        .map(item => {
          const product = new Product(item).get();
          const composition = product.composition.map(entity => {
            const defaultIngredientData = { label: 'Invalid ingredient', quantity: 0, unit: entity.unit };
            const ingredientData = this.state.ingredients.filter(({ id }) => id === entity.ingredient)[0] || { ...defaultIngredientData };
            const { label, quantity, unit } = ingredientData;
            const availableQuantity = convert(quantity).from(unit).to(entity.unit);
            const isAvailable = availableQuantity >= entity.quantity;
            return { ...entity, label, isAvailable  }
          })
          return { ...product, composition };
        })
        .sort((prevProduct, nextProduct) => prevProduct.label.localeCompare(nextProduct.label));
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