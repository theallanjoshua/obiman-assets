import * as React from 'react';
import { Button, Alert, PageHeader, Row, Col, Spin } from 'antd';
import BillInfo from './components/bill-info';
import { Bill, Utils } from 'obiman-data-models';
import Network from '../../utils/network';
import { BILLS_API_URL } from '../../constants/endpoints';
import {
  BILL_ADDED_SUCCESSFULLY_MESSAGE,
  ADD_BILL_PAGE_TITLE,
  ADD_BILL_BUTTON_TEXT
} from '../../constants/billing';
import { fetchAllIngredients } from '../../utils/fetch-all-ingredients';
import { fetchAllProducts, getEnrichedProducts } from '../../utils/products';

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
  constructor() {
    super();
    this.state = {
      ...INITIAL_STATE
    }
  }

  componentDidMount = () => this.fetchAllProducts();

  fetchAllProducts = async () => {
    this.setState({ loading: true, errorMessage: '' });
    try {
      const ingredients = await fetchAllIngredients();
      const products = await fetchAllProducts();
      const enrichedProducts = getEnrichedProducts(products, ingredients);
      this.setState({ ingredients, products: enrichedProducts });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }

  onChange = billToCreate => {
    const { previousBill, ingredients, products } = this.state;
    const { composition: existingBillComposition } = new Bill(previousBill).get();
    const { composition: incomingBillComposition } = new Bill(billToCreate).get();
    const validIncomingBillComposition = incomingBillComposition.filter(({ id, quantity }) => id && quantity);
    const validExistingBillComposition = existingBillComposition.filter(({ id, quantity }) => id && quantity);
    const ingredientsToUpdate = new Utils().getIngredientsToUpdate(ingredients, products, validIncomingBillComposition, validExistingBillComposition);
    const updatedIngredients = ingredients.map(existingIngredient => {
      const updatedIngredient = ingredientsToUpdate.filter(({ id }) => existingIngredient.id === id)[0];
      return updatedIngredient || existingIngredient;
    });
    const updatedProducts = getEnrichedProducts(products, updatedIngredients);
    this.setState({ billToCreate, previousBill: billToCreate, ingredients: updatedIngredients, products: updatedProducts });
  };

  addBill = async () => {
    const bill = new Bill(this.state.billToCreate);
    if (Object.keys(bill.validate()).length) {
      this.setState({ showValidationErrors: true });
    } else {
      const billData = bill.get();
      this.setState({ loading: true, errorMessage: '', successMessage: '' });
      try {
        await Network.post(BILLS_API_URL, billData);
        this.setState({ errorMessage: '', successMessage: BILL_ADDED_SUCCESSFULLY_MESSAGE });
        setTimeout(() => this.setState({ successMessage: '' }), 3000)
      } catch (errorMessage) {
        this.setState({ errorMessage });
      }
      this.setState({ loading: false });
    }
  }

  render = () => <React.Fragment>
    <PageHeader
      title={ADD_BILL_PAGE_TITLE}
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
        ingredients={this.state.ingredients}
        products={this.state.products}
        bill={this.state.billToCreate}
        showValidationErrors={this.state.showValidationErrors}
        onChange={this.onChange}
      />
      <Row>
        <Col span={10} offset={6}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type='primary'
              icon='plus'
              onClick={this.addBill}
              children={ADD_BILL_BUTTON_TEXT}
            />
          </div>
        </Col>
      </Row>
    </Spin>
  </React.Fragment>;
}