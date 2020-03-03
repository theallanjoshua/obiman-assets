import * as React from 'react';
import { Table, Empty, Alert } from 'antd';
import {
  ALL_INGREDIENTS_TABLE_COLUMN_DEFINITION,
  INGREDIENT_DELETED_SUCCESSFULLY_MESSAGE
} from '../../../constants/manage-ingredients';
import EditIngredient from './edit-ingredient';
import Network from '../../../utils/network';
import { INGREDIENTS_API_URL } from '../../../constants/endpoints';

export default class AllIngredients extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      successMessage: '',
      ingredientToUpdate: {},
      showEditModal: false
    }
  }
  showEditModal = ingredientToUpdate => this.setState({ ingredientToUpdate, showEditModal: true });
  hideModal = () => this.setState({ showEditModal: false });
  deleteIngredient = async ({ id, label }) => {
    const { businessId } = this.props;
    this.setState({ loading: true, errorMessage: '', successMessage: '' });
    try {
      await Network.delete(`${INGREDIENTS_API_URL(businessId)}/${id}`);
      this.setState({ errorMessage: '', successMessage: INGREDIENT_DELETED_SUCCESSFULLY_MESSAGE(label) });
      setTimeout(() => this.setState({ successMessage: '' }), 2000);
      this.props.fetchAllIngredients(businessId);
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  render = () => <div>
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    {this.state.errorMessage || this.state.successMessage ? <br /> : null}
    <Table
      loading={this.props.loading}
      columns={ALL_INGREDIENTS_TABLE_COLUMN_DEFINITION}
      dataSource={this.props.ingredients.map(ingredient => ({
        ...ingredient,
        key: ingredient.id,
        currency: this.props.currency,
        onEdit: this.showEditModal,
        onDelete: this.deleteIngredient
      }))}
      rowSelection={{
        onChange: this.props.onSelectionChange
      }}
      scroll={{ x: true }}
      locale={{
        emptyText: <Empty description='No ingredients' />
      }}
    />
    <EditIngredient
      currency={this.props.currency}
      locations={this.props.locations}
      businessId={this.props.businessId}
      visible={this.state.showEditModal}
      ingredientToUpdate={this.state.ingredientToUpdate}
      hideModal={this.hideModal}
      fetchAllIngredients={this.props.fetchAllIngredients}
    />
  </div>
}