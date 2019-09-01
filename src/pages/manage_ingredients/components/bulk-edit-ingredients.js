import * as React from 'react';
import { Modal, Alert, Collapse } from 'antd';
import IngredientInfo from './ingredient-info';
import { Ingredient } from 'obiman-data-models';
import Network from '../../../utils/network';
import { INGREDIENTS_API_URL } from '../../../constants/endpoints';
import { SAVE_BUTTON_TEXT } from '../../../constants/app';

const INITIAL_STATE = {
  loading: false,
  successMessage: '',
  errorMessage: '',
  ingredients: [],
  showValidationErrors: false
}

const { Panel } = Collapse;

export default class BulkEditIngredients extends React.Component {
  constructor(props) {
    super(props);
    const { ingredients } = { ...props };
    this.state = {
      ...INITIAL_STATE,
      ingredients
    }
  }

  componentDidUpdate = prevProps => {
    const { visible: prevVisible } = { ...prevProps };
    const { ingredients, visible } = { ...this.props };
    if (!prevVisible && visible) {
      this.setState({ ...INITIAL_STATE, ingredients });
    }
  }

  onChange = ingredient => {
    const ingredients = this.state.ingredients.reduce((acc, item) => [ ...acc, item.id === ingredient.id ? { ...ingredient } : { ...item } ], [])
    this.setState({ ingredients })
  };

  bulkEditIngredients = async () => {
    const { businessId } = this.props;
    const { ingredients } = this.state;
    const errors = ingredients.reduce((acc, item) => {
      const ingredient = new Ingredient(item);
      if(Object.keys(ingredient.validate()).length) {
        return true;
      } else {
        return acc;
      }
    }, false);
    if(!errors) {
      this.setState({ loading: true, errorMessage: '', successMessage: '' });
      try {
        await Network.put(INGREDIENTS_API_URL(businessId), ingredients);
        this.setState({ errorMessage: '', successMessage: 'Ingredients updated successfully' });
        this.props.fetchAllIngredients(businessId);
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
    title={'Bulk edit quantity'}
    okText={SAVE_BUTTON_TEXT}
    width={'60vw'}
    visible={this.props.visible}
    closable={!this.state.loading}
    onOk={this.bulkEditIngredients}
    okButtonProps={{
      disabled: !!this.state.successMessage,
      loading: this.state.loading
    }}
    onCancel={this.props.hideModal}
    cancelButtonProps={{
      loading: this.state.loading
    }}
  >
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    <br />
    <Collapse>
    {this.state.ingredients.map(ingredient => <Panel
      key={ingredient.id}
      header={ingredient.label}
    >
      <IngredientInfo
        key={ingredient.id}
        ingredient={ingredient}
        showValidationErrors={this.state.showValidationErrors}
        onChange={this.onChange}
      />
    </Panel>)}
    </Collapse>
  </Modal>;
}