import * as React from 'react';
import { Modal, Alert } from 'antd';
import IngredientInfo from './ingredient-info';
import { Ingredient } from 'obiman-data-models';
import Network from '../../../utils/network';

const INITIAL_STATE = {
  loading: false,
  successMessage: '',
  errorMessage: '',
  ingredientToCreate: {},
  showValidationErrors: false
}
export default class AddIngredient extends React.Component {
  constructor() {
    super();
    this.state = {
      ...INITIAL_STATE
    }
  }

  onChange = ingredientToCreate => this.setState({ ingredientToCreate });

  addIngredient = async () => {
    const ingredient = new Ingredient(this.state.ingredientToCreate);
    if (Object.keys(ingredient.validate()).length) {
      this.setState({ showValidationErrors: true });
    } else {
      const ingredientData = ingredient.get();
      this.setState({ loading: true, errorMessage: '', successMessage: '' });
      try {
        await Network.post('/api/ingredients', ingredientData);
        this.setState({ errorMessage: '', successMessage: `${ingredientData.label} added to ingredients successfully` });
        setTimeout(() => {
          this.props.fetchAllIngredients();
          this.hideModal();
        }, 2000);
      } catch (errorMessage) {
        this.setState({ errorMessage });
      }
      this.setState({ loading: false });
    }
  }

  hideModal = () => this.setState({ ...INITIAL_STATE }, this.props.hideModal);

  render = () => <Modal
    destroyOnClose={true}
    title={'Add ingredient'}
    okText={'Add'}
    width={'40vw'}
    visible={this.props.visible}
    closable={!this.state.loading}
    onOk={this.addIngredient}
    okButtonProps={{
      disabled: !!this.state.successMessage,
      loading: this.state.loading
    }}
    onCancel={this.hideModal}
    cancelButtonProps={{
      loading: this.state.loading
    }}
  >
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    <br />
    <IngredientInfo
      showValidationErrors={this.state.showValidationErrors}
      onChange={this.onChange}
    />
  </Modal>;
}