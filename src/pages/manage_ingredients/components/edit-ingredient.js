import * as React from 'react';
import { Modal, Alert, Typography } from 'antd';
import IngredientInfo from './ingredient-info';
import { Ingredient } from 'obiman-data-models';
import Network from '../../../utils/network';
import { INGREDIENTS_API_URL } from '../../../constants/endpoints';
import {
  INGREDIENT_EDITED_SUCCESSFULLY_MESSAGE,
  EDIT_MODAL_HEADER
} from '../../../constants/manage-ingredients';
import { SAVE_BUTTON_TEXT } from '../../../constants/app';
import AuditTrail from '../../../components/audit-trail';

const { Text } = Typography;

const INITIAL_STATE = {
  loading: false,
  successMessage: '',
  errorMessage: '',
  ingredientToUpdate: {},
  showValidationErrors: false
}

export default class EditIngredient extends React.Component {
  constructor(props) {
    super(props);
    const { ingredientToUpdate } = { ...props };
    this.state = {
      ...INITIAL_STATE,
      ingredientToUpdate
    }
  }

  componentDidUpdate = prevProps => {
    const { visible: prevVisible } = { ...prevProps };
    const { ingredientToUpdate, visible } = { ...this.props };
    if (!prevVisible && visible) {
      this.setState({ ...INITIAL_STATE, ingredientToUpdate });
    }
  }

  onChange = ingredientToUpdate => this.setState({ ingredientToUpdate });

  editIngredient = async () => {
    const { businessId } = this.props;
    const ingredient = new Ingredient(this.state.ingredientToUpdate);
    if (Object.keys(ingredient.validate()).length) {
      this.setState({ showValidationErrors: true });
    } else {
      const ingredientData = ingredient.get();
      this.setState({ loading: true, errorMessage: '', successMessage: '' });
      try {
        await Network.put(INGREDIENTS_API_URL(businessId), [ingredientData]);
        this.setState({ errorMessage: '', successMessage: INGREDIENT_EDITED_SUCCESSFULLY_MESSAGE(ingredientData.label) });
        setTimeout(() => {
          this.props.fetchAllIngredients(businessId);
          this.props.hideModal();
        }, 2000);
      } catch (errorMessage) {
        this.setState({ errorMessage });
      }
      this.setState({ loading: false });
    }
  }

  render = () => <Modal
    destroyOnClose
    maskClosable={false}
    title={<div>
      {EDIT_MODAL_HEADER}
      <br />
      <Text type='secondary' style={{ fontSize: 'x-small' }}>
        <AuditTrail
          prefixText={'Created'}
          date={this.state.ingredientToUpdate.createdDate}
          user={this.state.ingredientToUpdate.createdBy}
        />
      </Text>
      {this.state.ingredientToUpdate.updatedBy && this.state.ingredientToUpdate.updatedDate ?
        <Text type='secondary' style={{ fontSize: 'x-small' }}>
          <AuditTrail
            prefixText={'Last edited'}
            date={this.state.ingredientToUpdate.updatedDate}
            user={this.state.ingredientToUpdate.updatedBy}
          />
        </Text>
      : null}
    </div>}
    okText={SAVE_BUTTON_TEXT}
    style={{ maxWidth: '90vw' }}
    width={'720px'}
    visible={this.props.visible}
    closable={!this.state.loading}
    onOk={this.editIngredient}
    okButtonProps={{
      disabled: !!this.state.successMessage,
      loading: this.state.loading
    }}
    onCancel={this.props.hideModal}
    cancelButtonProps={{
      disabled: this.state.loading
    }}
  >
    {this.state.errorMessage ? <Alert message='Oops!' description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert message='Yay!' description={this.state.successMessage} type='success' showIcon /> : null}
    <br />
    <IngredientInfo
      currency={this.props.currency}
      locations={this.props.locations}
      ingredient={this.state.ingredientToUpdate}
      showValidationErrors={this.state.showValidationErrors}
      onChange={this.onChange}
    />
    {this.state.errorMessage ? <Alert message='Oops!' description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert message='Yay!' description={this.state.successMessage} type='success' showIcon /> : null}
  </Modal>;
}