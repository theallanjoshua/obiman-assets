import * as React from 'react';
import AllIngredients from './components/all-ingredients';
import { Button, Alert } from 'antd';
import AddIngredient from './components/add-ingredient';
import {
  MANAGE_INGREDIENTS_PAGE_TITLE,
  ADD_INGREDIENT_BUTTON_TEXT
} from '../../constants/manage-ingredients';
import { fetchAllIngredients } from '../../utils/ingredients';
import PageHeader from '../../components/page-header';
import { Consumer } from '../../context';

class ManageIngredientsComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      successMessage: '',
      ingredients: [],
      showAddModal: false,
      showBulkEditModal: false
    }
  }
  componentDidMount = () => {
    const { businessId } = this.props;
    if(businessId) {
      this.fetchAllIngredients()
    }
  };
  componentDidUpdate = prevProps => {
    const { businessId } = this.props;
    if(prevProps.businessId !== businessId && businessId) this.fetchAllIngredients();
  };
  fetchAllIngredients = async () => {
    const { businessId } = this.props;
    this.setState({ loading: true, errorMessage: '' });
    try {
      const ingredients = await fetchAllIngredients(businessId);
      this.setState({ ingredients });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  showAddModal = () => this.setState({ showAddModal: true });
  hideModal = () => this.setState({ showAddModal: false });
  render = () => <>
    <PageHeader
      title={MANAGE_INGREDIENTS_PAGE_TITLE(this.state.ingredients.length)}
      extra={<>
        <Button
          style={{ marginRight: '4px' }}
          type='primary'
          icon='plus'
          onClick={this.showAddModal}
          disabled={this.state.loading}
          children={ADD_INGREDIENT_BUTTON_TEXT}
        />
        <Button
          icon='reload'
          onClick={this.fetchAllIngredients}
        />
      </>}
    />
    <br />
    {this.state.errorMessage ? <Alert message='Oops!' description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert message='Yay!' description={this.state.successMessage} type='success' showIcon /> : null}
    <AllIngredients
      currency={this.props.currency}
      locations={this.props.locations}
      businessId={this.props.businessId}
      loading={this.state.loading}
      ingredients={this.state.ingredients}
      fetchAllIngredients={this.fetchAllIngredients}
    />
    <AddIngredient
      currency={this.props.currency}
      locations={this.props.locations}
      businessId={this.props.businessId}
      visible={this.state.showAddModal}
      hideModal={this.hideModal}
      fetchAllIngredients={this.fetchAllIngredients}
    />
  </>;
}

export default class ManageIngredients extends React.Component {
  componentDidMount = () => document.title = 'Ingredients - Obiman';
  render = () => <Consumer>
    {({ currentBusiness }) => <ManageIngredientsComponent
      businessId={currentBusiness.id}
      currency={currentBusiness.currency}
      locations={currentBusiness.ingredientLocations || []}
    />}
  </Consumer>
}