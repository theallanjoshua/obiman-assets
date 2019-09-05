import * as React from 'react';
import { Modal, Alert } from 'antd';
import ProductInfo from './product-info';
import { Product } from 'obiman-data-models';
import Network from '../../../utils/network';
import { PRODUCTS_API_URL } from '../../../constants/endpoints';
import {
  PRODUCT_EDITED_SUCCESSFULLY_MESSAGE,
  EDIT_MODAL_HEADER
} from '../../../constants/manage-products';
import { SAVE_BUTTON_TEXT } from '../../../constants/app';

const INITIAL_STATE = {
  loading: false,
  successMessage: '',
  errorMessage: '',
  productToUpdate: {},
  showValidationErrors: false
}

export default class EditProduct extends React.Component {
  constructor(props) {
    super(props);
    const { productToUpdate } = { ...props };
    this.state = {
      ...INITIAL_STATE,
      productToUpdate
    }
  }

  componentDidUpdate = prevProps => {
    const { visible: prevVisible } = { ...prevProps };
    const { productToUpdate, visible } = { ...this.props };
    if (!prevVisible && visible) {
      this.setState({ ...INITIAL_STATE, productToUpdate });
    }
  }

  onChange = productToUpdate => this.setState({ productToUpdate });

  editProduct = async () => {
    const { businessId } = this.props;
    const product = new Product(this.state.productToUpdate);
    if (Object.keys(product.validate()).length) {
      this.setState({ showValidationErrors: true });
    } else {
      const productData = product.get();
      this.setState({ loading: true, errorMessage: '', successMessage: '' });
      try {
        await Network.put(PRODUCTS_API_URL(businessId), productData);
        this.setState({ errorMessage: '', successMessage: PRODUCT_EDITED_SUCCESSFULLY_MESSAGE(productData.label) });
        this.props.fetchAllProducts(businessId);
        setTimeout(this.props.hideModal, 2000);
      } catch (errorMessage) {
        this.setState({ errorMessage });
      }
      this.setState({ loading: false });
    }
  }

  render = () => <Modal
    destroyOnClose
    maskClosable={false}
    title={EDIT_MODAL_HEADER}
    okText={SAVE_BUTTON_TEXT}
    width={'60vw'}
    visible={this.props.visible}
    closable={!this.state.loading}
    onOk={this.editProduct}
    okButtonProps={{
      disabled: !!this.state.successMessage,
      loading: this.state.loading
    }}
    onCancel={this.props.hideModal}
    cancelButtonProps={{
      disabled: this.state.loading
    }}
  >
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    <br />
    <ProductInfo
      currency={this.props.currency}
      ingredients={this.props.ingredients}
      product={this.state.productToUpdate}
      showValidationErrors={this.state.showValidationErrors}
      onChange={this.onChange}
    />
  </Modal>;
}