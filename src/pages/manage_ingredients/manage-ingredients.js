import * as React from 'react';
import AllIngredients from './components/all-ingredients';
import Network from '../../utils/network';
import { Ingredient } from 'obiman-data-models';
import { PageHeader, Button } from 'antd';

export default class ManageIngredients extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      successMessage: '',
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

  createIngredient = async () => {
    const ingredient = new Ingredient();
    ingredient.setLabel('Tomato');
    this.setState({ loading: true, errorMessage: '', successMessage: '' });
    try {
      await Network.post('/api/ingredients', ingredient.get());
      await this.fetchAllIngredients();
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }

  editIngredient = async () => {}

  deleteIngredient = async () => {}

  render = () => <React.Fragment>
    <PageHeader
      title='Manage ingredients'
      extra={ <Button
        type='primary'
        onClick={this.createIngredient}
        children='Add'
      />}
    />
    <br />
    <AllIngredients
      loading={this.state.loading}
      ingredients={this.state.ingredients}
    />
  </React.Fragment>;
}