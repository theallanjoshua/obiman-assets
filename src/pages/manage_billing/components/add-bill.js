import * as React from 'react';
import { Alert, Spin, Modal } from 'antd';
import BillInfo from './bill-info';
import { Bill, Utils } from 'obiman-data-models';
import Network from '../../../utils/network';
import { BILLS_API_URL } from '../../../constants/endpoints';
import {
  BILL_ADDED_SUCCESSFULLY_MESSAGE,
  ADD_BILL_PAGE_TITLE,
  ADD_BILL_BUTTON_TEXT
} from '../../../constants/manage-billing';
import { getEnrichedProducts } from '../../../utils/products';

const INITIAL_STATE = {
  loading: false,
  successMessage: '',
  errorMessage: '',
  ingredients: [],
  products: [],
  billToCreate: {},
  previousBill: {},
  showValidationErrors: false
}

export default class AddBill extends React.Component {
  constructor(props) {
    super(props);
    const { ingredients, products } = props;
    this.state = {
      ...INITIAL_STATE,
      ingredients,
      products
    }
  }
  componentDidUpdate = prevProps => {
    const { visible: prevVisible } = prevProps;
    const { visible, ingredients, products } = this.props;
    if (!prevVisible && visible) {
      this.setState({ ...INITIAL_STATE, ingredients, products });
    }
  }
  getIngredients = () => {
    const { billToCreate, ingredients, products } = this.state;
    const { composition = [] } = billToCreate;
    const newComposition = composition
      .filter(({ orderId }) => !orderId)
      .reduce((acc, { id: productId }) => {
        const { composition = [] } = products.filter(({ id }) => id === productId)[0] || {};
        return [ ...acc, ...composition ];
      }, []);
    const ingredientsToUpdate = new Utils().getIngredientsToUpdate(ingredients, newComposition);
    return ingredients.map(ingredient => {
      const ingredientToUpdate = ingredientsToUpdate.filter(({ id }) => id === ingredient.id)[0];
      return { ...(ingredientToUpdate || ingredient) }
    })
  }
  getProducts = () => {
    const { products } = this.state;
    return getEnrichedProducts(products, this.getIngredients());
  }

  onChange = billToCreate => this.setState({ billToCreate });
  addBill = async () => {
    const { businessId } = this.props;
    const bill = new Bill(this.state.billToCreate);
    if (Object.keys(bill.validate()).length) {
      this.setState({ showValidationErrors: true });
    } else {
      const billData = bill
        .enrich(this.props.products, this.props.orders)
        .get();
      this.setState({ loading: true, errorMessage: '', successMessage: '' });
      try {
        await Network.post(BILLS_API_URL(businessId), billData);
        this.setState({ errorMessage: '', successMessage: BILL_ADDED_SUCCESSFULLY_MESSAGE });
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
    title={ADD_BILL_PAGE_TITLE}
    okText={ADD_BILL_BUTTON_TEXT}
    style={{ maxWidth: '90vw' }}
    width={'720px'}
    visible={this.props.visible}
    closable={!this.state.loading}
    onOk={this.addBill}
    okButtonProps={{
      disabled: !!this.state.successMessage,
      loading: this.state.loading
    }}
    onCancel={this.props.hideModal}
    cancelButtonProps={{
      disabled: this.state.loading
    }}
  >
    <Spin spinning={this.state.loading}>
      <BillInfo
        currency={this.props.currency}
        sources={this.props.sources}
        ingredients={this.getIngredients()}
        products={this.getProducts()}
        orders={this.props.orders}
        bill={this.state.billToCreate}
        showValidationErrors={this.state.showValidationErrors}
        onChange={this.onChange}
      />
    </Spin>
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
  </Modal>;
}