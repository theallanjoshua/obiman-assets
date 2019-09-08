import * as React from 'react';
import { Alert, Spin, Modal } from 'antd';
import BillInfo from './bill-info';
import { Bill, Utils } from 'obiman-data-models';
import Network from '../../../utils/network';
import { BILLS_API_URL } from '../../../constants/endpoints';
import {
  BILL_EDITED_SUCCESSFULLY_MESSAGE,
  EDIT_BILL_PAGE_TITLE
} from '../../../constants/manage-billing';
import { SAVE_BUTTON_TEXT } from '../../../constants/app';
import { getEnrichedProducts } from '../../../utils/products';

const INITIAL_STATE = {
  loading: false,
  successMessage: '',
  errorMessage: '',
  ingredients: [],
  products: [],
  billToUpdate: {},
  previousBill: {},
  showValidationErrors: false
}

export default class EditBill extends React.Component {
  constructor(props) {
    super(props);
    const { ingredients, products } = props;
    this.state = {
      ...INITIAL_STATE,
      ingredients,
      products
    };
  }

  componentDidUpdate = prevProps => {
    const { visible: prevVisible } = prevProps;
    const { visible, ingredients, products, billToUpdate } = this.props;
    if (!prevVisible && visible) {
      this.setState({ ...INITIAL_STATE, ingredients, products, billToUpdate });
    }
  }

  onChange = billToUpdate => {
    const { previousBill: existingBill, ingredients, products } = this.state;
    const { composition: existingBillComposition } = new Bill(existingBill).get();
    const { composition: incomingBillComposition } = new Bill(billToUpdate).get();
    const validIncomingBillComposition = incomingBillComposition.filter(({ id, quantity }) => id && quantity);
    const validExistingBillComposition = existingBillComposition.filter(({ id, quantity }) => id && quantity);
    const ingredientsToUpdate = new Utils().getIngredientsToUpdate(ingredients, products, validIncomingBillComposition, validExistingBillComposition);
    const updatedIngredients = ingredients.map(existingIngredient => {
      const updatedIngredient = ingredientsToUpdate.filter(({ id }) => existingIngredient.id === id)[0];
      return updatedIngredient || existingIngredient;
    });
    const updatedProducts = getEnrichedProducts(products, updatedIngredients);
    this.setState({ billToUpdate, previousBill: billToUpdate, ingredients: updatedIngredients, products: updatedProducts });
  };

  editBill = async () => {
    const { businessId } = this.props;
    const bill = new Bill(this.state.billToUpdate);
    if (Object.keys(bill.validate()).length) {
      this.setState({ showValidationErrors: true });
    } else {
      const billData = bill.get();
      const total = bill.calculateTotal(this.props.products);
      this.setState({ loading: true, errorMessage: '', successMessage: '' });
      try {
        await Network.put(BILLS_API_URL(businessId), { ...billData, total });
        this.setState({ errorMessage: '', successMessage: BILL_EDITED_SUCCESSFULLY_MESSAGE });
        this.props.fetchAllBills(businessId);
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
    title={EDIT_BILL_PAGE_TITLE}
    okText={SAVE_BUTTON_TEXT}
    width={'60vw'}
    visible={this.props.visible}
    closable={!this.state.loading}
    onOk={this.editBill}
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
    <Spin spinning={this.state.loading}>
      <BillInfo
        currency={this.props.currency}
        products={this.state.products}
        bill={this.state.billToUpdate}
        showValidationErrors={this.state.showValidationErrors}
        onChange={this.onChange}
      />
    </Spin>
  </Modal>;
}