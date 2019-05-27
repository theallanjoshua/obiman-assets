import * as React from 'react';
import AllIngredients from './components/all-ingredients';
import Network from '../../utils/network';
import { Ingredient } from 'obiman-data-models';
import { PageHeader, Button } from 'antd';
import AddIngredient from './components/add-ingredient';

export default class ManageIngredients extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      ingredients: []
    }
  }

  componentDidMount = () => {
    this.fetchAllIngredients();
  }

  fetchAllIngredients = async () => {
    this.setState({ loading: true, errorMessage: '' });
    try {
      const response = await Network.get('/api/ingredients');
      const ingredients = response.ingredients.map(item => new Ingredient(item).get());
      this.setState({ ingredients });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }

  showAddModal = () => this.setState({ showAddModal: true });

  showEditModal = () => this.setState({ showEditModal: true });

  hideModal = () => this.setState({ showAddModal: false, showEditModal: false });

  render = () => <React.Fragment>
    <PageHeader
      title='Manage ingredients'
      extra={ <Button
        type='primary'
        onClick={this.showAddModal}
        children='Add'
      />}
    />
    <br />
    <AllIngredients
      loading={this.state.loading}
      ingredients={this.state.ingredients}
    />
    <AddIngredient
      visible={this.state.showAddModal}
      hideModal={this.hideModal}
      fetchAllIngredients={this.fetchAllIngredients}
    />
  </React.Fragment>;
}