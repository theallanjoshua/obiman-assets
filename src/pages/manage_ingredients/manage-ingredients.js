import * as React from 'react';
import AllIngredients from './components/all-ingredients';
import { Button, Alert } from 'antd';
import AddIngredient from './components/add-ingredient';
import BulkEditIngredients from './components/bulk-edit-ingredients';
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
      selectedIngredientsKeys: [],
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
    if(prevProps.businessId !== businessId && businessId) {
      this.fetchAllIngredients()
    }
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
  showBulkEditModal = () => this.setState({ showBulkEditModal: true });
  hideModal = () => this.setState({ showAddModal: false, showBulkEditModal: false });
  onSelectionChange = selectedIngredientsKeys => this.setState({ selectedIngredientsKeys });
  render = () => <>
    <PageHeader
      title={MANAGE_INGREDIENTS_PAGE_TITLE(this.state.ingredients.length)}
      extra={<>
        <Button
          style={{ marginRight: '4px' }}
          type='primary'
          icon='plus'
          onClick={this.showAddModal}
          children={ADD_INGREDIENT_BUTTON_TEXT}
        />
        <Button
          style={{ marginRight: '4px' }}
          icon='edit'
          disabled={this.state.selectedIngredientsKeys.length < 2}
          onClick={this.showBulkEditModal}
          children={'Bulk edit'}
        />
        <Button
          icon='reload'
          onClick={this.fetchAllIngredients}
        />
      </>}
    />
    <br />
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    <AllIngredients
      currency={this.props.currency}
      locations={this.props.locations}
      businessId={this.props.businessId}
      loading={this.state.loading}
      ingredients={this.state.ingredients}
      selectedIngredientsKeys={this.selectedIngredientsKeys}
      onSelectionChange={this.onSelectionChange}
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
    <BulkEditIngredients
      currency={this.props.currency}
      locations={this.props.locations}
      businessId={this.props.businessId}
      visible={this.state.showBulkEditModal}
      ingredients={this.state.ingredients.filter(ingredient => this.state.selectedIngredientsKeys.includes(ingredient.id))}
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