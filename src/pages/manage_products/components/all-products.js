import * as React from 'react';
import { Table, Empty, Alert } from 'antd';
import {
  ALL_PRODUCTS_TABLE_COLUMN_DEFINITION,
  PRODUCT_DELETED_SUCCESSFULLY_MESSAGE
} from '../../../constants/manage-products';
import Network from '../../../utils/network';
import EditProduct from './edit-product';
import { PRODUCTS_API_URL } from '../../../constants/endpoints';

export default class AllProducts extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      successMessage: '',
      productToUpdate: {},
      showEditModal: false
    }
  }
  showEditModal = productToUpdate => this.setState({ productToUpdate, showEditModal: true });
  hideModal = () => this.setState({ showEditModal: false });
  deleteProduct = async ({ id, label }) => {
    const { businessId } = this.props;
    this.setState({ loading: true, errorMessage: '', successMessage: '' });
    try {
      await Network.delete(`${PRODUCTS_API_URL(businessId)}/${id}`);
      this.setState({ errorMessage: '', successMessage: PRODUCT_DELETED_SUCCESSFULLY_MESSAGE(label) });
      setTimeout(() => this.setState({ successMessage: '' }), 2000);
      this.props.fetchAllProducts(businessId);
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  render = () => <div>
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    {this.state.errorMessage || this.state.successMessage ? <br /> : null}
    <Table
      loading={this.props.loading}
      columns={ALL_PRODUCTS_TABLE_COLUMN_DEFINITION}
      dataSource={this.props.products.map(product => ({
        ...product,
        key: product.id,
        currency: this.props.currency,
        onEdit: this.showEditModal,
        onDelete: this.deleteProduct
      }))}
      scroll={{ x: true }}
      locale={{
        emptyText: <Empty description='No products' />
      }}
    />
     <EditProduct
      currency={this.props.currency}
      classifications={this.props.classifications}
      taxes={this.props.taxes}
      businessId={this.props.businessId}
      ingredients={this.props.ingredients}
      visible={this.state.showEditModal}
      productToUpdate={this.state.productToUpdate}
      hideModal={this.hideModal}
      fetchAllProducts={this.props.fetchAllProducts}
    />
  </div>
}