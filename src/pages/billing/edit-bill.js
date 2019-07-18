import * as React from 'react';
import { Button, Alert, PageHeader, Row, Col, Spin } from 'antd';
import BillInfo from './components/bill-info';
import { Bill, Utils } from 'obiman-data-models';
import Network from '../../utils/network';
import { BILLS_API_URL } from '../../constants/endpoints';
import {
  BILL_EDITED_SUCCESSFULLY_MESSAGE,
  EDIT_BILL_PAGE_TITLE
} from '../../constants/billing';
import { SAVE_BUTTON_TEXT } from '../../constants/app';
import { fetchAllIngredients } from '../../utils/fetch-all-ingredients';
import { fetchAllProducts, getEnrichedProducts } from '../../utils/products';

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
  constructor() {
    super();
    this.state = { ...INITIAL_STATE }
  }

  componentDidMount = () => this.fetchBill();

  fetchBill = async () => {
    this.setState({ loading: true, errorMessage: '' });
    try {
      const ingredients = await fetchAllIngredients();
      const products = await fetchAllProducts();
      const enrichedProducts = getEnrichedProducts(products, ingredients);
      const billToUpdate = await Network.get(`${BILLS_API_URL}/${this.props.match.params.billId}`);
      this.setState({ ingredients, products: enrichedProducts, billToUpdate, previousBill: billToUpdate });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }

  onChange = billToUpdate => {
    const { previousBill: existingBill, ingredients, products } = this.state;
    const { composition: existingBillComposition } = existingBill;
    const { composition: incomingBillComposition } = billToUpdate;
    const validIncomingBillComposition = incomingBillComposition.filter(({ id, quantity }) => id && quantity);
    const ingredientsToUpdate = new Utils().getIngredientsToUpdate(ingredients, products, validIncomingBillComposition, existingBillComposition);
    const updatedIngredients = ingredients.map(existingIngredient => {
      const updatedIngredient = ingredientsToUpdate.filter(({ id }) => existingIngredient.id === id)[0];
      return updatedIngredient || existingIngredient;
    });
    const updatedProducts = getEnrichedProducts(products, updatedIngredients);
    const previousBill = Object.keys(new Bill(billToUpdate).validate()).length ? existingBill : billToUpdate;
    this.setState({ billToUpdate, previousBill, ingredients: updatedIngredients, products: updatedProducts });
  };

  editBill = async () => {
    const bill = new Bill(this.state.billToUpdate);
    if (Object.keys(bill.validate()).length) {
      this.setState({ showValidationErrors: true });
    } else {
      const billData = bill.get();
      this.setState({ loading: true, errorMessage: '', successMessage: '' });
      try {
        await Network.put(BILLS_API_URL, billData);
        this.setState({ errorMessage: '', successMessage: BILL_EDITED_SUCCESSFULLY_MESSAGE });
        setTimeout(() => this.setState({ successMessage: '' }), 3000);
        await this.fetchBill();
      } catch (errorMessage) {
        this.setState({ errorMessage });
      }
      this.setState({ loading: false });
    }
  }

  render = () => <React.Fragment>
    <PageHeader
      title={EDIT_BILL_PAGE_TITLE}
    />
    <Row>
      <Col span={10} offset={6}>
        {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
        {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
      </Col>
    </Row>
    <br />
    <Spin spinning={this.state.loading}>
      <BillInfo
        products={this.state.products}
        bill={this.state.billToUpdate}
        showValidationErrors={this.state.showValidationErrors}
        onChange={this.onChange}
      />
      <Row>
        <Col span={10} offset={6}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type='primary'
              icon='save'
              onClick={this.editBill}
              children={SAVE_BUTTON_TEXT}
            />
          </div>
        </Col>
      </Row>
    </Spin>
  </React.Fragment>;
}