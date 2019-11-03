import * as React from 'react';
import AllIngredients from './components/all-ingredients';
import Network from '../../utils/network';
import { Button, Alert } from 'antd';
import AddIngredient from './components/add-ingredient';
import EditIngredient from './components/edit-ingredient';
import BulkEditIngredients from './components/bulk-edit-ingredients';
import { INGREDIENTS_API_URL } from '../../constants/endpoints';
import {
  INGREDIENT_DELETED_SUCCESSFULLY_MESSAGE,
  MANAGE_INGREDIENTS_PAGE_TITLE,
  ADD_INGREDIENT_BUTTON_TEXT
} from '../../constants/manage-ingredients';
import { fetchAllIngredients } from '../../utils/ingredients';
import PageHeader from '../../components/page-header';
import Page from '../../components/page';
import { Consumer } from '../../context';

class ManageIngredientsComponent extends React.Component {
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
  componentDidMount = () => {
    const { businessId } = this.props;
    if(businessId) {
      this.fetchAllIngredients(businessId)
    }
  };
  componentDidUpdate = prevProps => {
    const { businessId } = this.props;
    if(prevProps.businessId !== businessId && businessId) {
      this.fetchAllIngredients(businessId)
    }
  };
  fetchAllIngredients = async businessId => {
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
  showEditModal = ingredientToUpdate => this.setState({ ingredientToUpdate, showEditModal: true });
  showBulkEditModal = () => this.setState({ showBulkEditModal: true });
  hideModal = () => this.setState({ showAddModal: false, showEditModal: false, showBulkEditModal: false });
  deleteIngredient = async ({ id, label }) => {
    const { businessId } = this.props;
    this.setState({ loading: true, errorMessage: '', successMessage: '' });
    try {
      await Network.delete(`${INGREDIENTS_API_URL(businessId)}/${id}`);
      this.setState({ errorMessage: '', successMessage: INGREDIENT_DELETED_SUCCESSFULLY_MESSAGE(label) });
      setTimeout(() => this.setState({ successMessage: '' }), 2000);
      this.fetchAllIngredients(businessId);
    } catch (errorMessage) {
      this.setState({ errorMessage, loading: false });
    }
  }
  onSelectionChange = selectedIngredientsKeys => this.setState({ selectedIngredientsKeys });
  render = () => <Page>
    <PageHeader
      title={MANAGE_INGREDIENTS_PAGE_TITLE(this.state.ingredients.length)}
      extra={<React.Fragment>
        <Button
          style={{ marginRight: '4px' }}
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
      currency={this.props.currency}
      loading={this.state.loading}
      ingredients={this.state.ingredients}
      showEditModal={this.showEditModal}
      onDeleteIngredient={this.deleteIngredient}
      selectedIngredientsKeys={this.selectedIngredientsKeys}
      onSelectionChange={this.onSelectionChange}
    />
    <AddIngredient
      currency={this.props.currency}
      locations={this.props.locations}
      businessId={this.props.businessId}
      visible={this.state.showAddModal}
      hideModal={this.hideModal}
      fetchAllIngredients={this.fetchAllIngredients}
    />
    <EditIngredient
      currency={this.props.currency}
      locations={this.props.locations}
      businessId={this.props.businessId}
      visible={this.state.showEditModal}
      ingredientToUpdate={this.state.ingredientToUpdate}
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
  </Page>;
}

export default class ManageIngredients extends React.Component {
  componentDidMount = () => document.title = 'Ingredients - Obiman';
  render = () => <Consumer>
    {({ currentBusiness }) => <ManageIngredientsComponent
      businessId={currentBusiness.id}
      currency={currentBusiness.currency}
      locations={currentBusiness.metadata.ingredientLocations || []}
    />}
  </Consumer>
}