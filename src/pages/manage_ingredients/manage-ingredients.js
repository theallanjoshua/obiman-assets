import * as React from 'react';
import AllIngredients from './components/all-ingredients';
import Network from '../../utils/network';
import { PageHeader, Button, Alert } from 'antd';
import AddIngredient from './components/add-ingredient';
import EditIngredient from './components/edit-ingredient';
import BulkEditIngredients from './components/bulk-edit-ingredients';
import { INGREDIENTS_API_URL } from '../../constants/endpoints';
import {
  INGREDIENT_DELETED_SUCCESSFULLY_MESSAGE,
  MANAGE_INGREDIENTS_PAGE_TITLE,
  ADD_INGREDIENT_BUTTON_TEXT
} from '../../constants/manage-ingredients';
import { fetchAllIngredients } from '../../utils/fetch-all-ingredients';

export default class ManageIngredients extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      ingredients: [],
      ingredientToUpdate: {},
      showAddModal: false,
      showEditModal: false,
      selectedIngredientsKeys: [],
      showBulkEditModal: false
    }
  }

  componentDidMount = () => this.fetchAllIngredients();

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

  showAddModal = () => this.setState({ showAddModal: true });

  showEditModal = ingredientToUpdate => this.setState({ ingredientToUpdate, showEditModal: true });

  showBulkEditModal = () => this.setState({ showBulkEditModal: true });

  hideModal = () => this.setState({ showAddModal: false, showEditModal: false, showBulkEditModal: false });

  deleteIngredient = async ({ id, label }) => {
    this.setState({ loading: true, errorMessage: '', successMessage: '' });
    try {
      await Network.delete(`${INGREDIENTS_API_URL}/${id}`);
      this.setState({ errorMessage: '', successMessage: INGREDIENT_DELETED_SUCCESSFULLY_MESSAGE(label) });
      setTimeout(() => this.setState({ successMessage: '' }), 2000);
      this.fetchAllIngredients();
    } catch (errorMessage) {
      this.setState({ errorMessage, loading: false });
    }
  }

  onSelectionChange = selectedIngredientsKeys => this.setState({ selectedIngredientsKeys });

  render = () => <React.Fragment>
    <PageHeader
      title={MANAGE_INGREDIENTS_PAGE_TITLE(this.state.ingredients.length)}
      extra={<React.Fragment>
        <Button
          type='primary'
          icon='plus'
          onClick={this.showAddModal}
          children={ADD_INGREDIENT_BUTTON_TEXT}
        />
        <Button
          icon='edit'
          disabled={this.state.selectedIngredientsKeys.length < 2}
          onClick={this.showBulkEditModal}
          children={'Bulk edit'}
        />
      </React.Fragment>}
    />
    <br />
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    <br />
    <AllIngredients
      loading={this.state.loading}
      ingredients={this.state.ingredients}
      showEditModal={this.showEditModal}
      onDeleteIngredient={this.deleteIngredient}
      selectedIngredientsKeys={this.selectedIngredientsKeys}
      onSelectionChange={this.onSelectionChange}
    />
    <AddIngredient
      visible={this.state.showAddModal}
      hideModal={this.hideModal}
      fetchAllIngredients={this.fetchAllIngredients}
    />
    <EditIngredient
      visible={this.state.showEditModal}
      ingredientToUpdate={this.state.ingredientToUpdate}
      hideModal={this.hideModal}
      fetchAllIngredients={this.fetchAllIngredients}
    />
    <BulkEditIngredients
      visible={this.state.showBulkEditModal}
      ingredients={this.state.ingredients.filter(ingredient => this.state.selectedIngredientsKeys.indexOf(ingredient.id) > -1)}
      hideModal={this.hideModal}
      fetchAllIngredients={this.fetchAllIngredients}
    />
  </React.Fragment>;
}