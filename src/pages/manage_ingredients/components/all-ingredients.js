import * as React from 'react';
import { Table } from 'antd';
import { ALL_INGREDIENTS_TABLE_COLUMN_DEFINITION } from '../../../constants/manage-ingredients';

export default class AllIngredients extends React.Component {
  render = () => <Table
    loading={this.props.loading}
    columns={ALL_INGREDIENTS_TABLE_COLUMN_DEFINITION}
    dataSource={this.props.ingredients.map(ingredient => ({
      ...ingredient,
      key: ingredient.id,
      onEdit: this.props.showEditModal,
      onDelete: this.props.onDeleteIngredient
    }))}
    rowSelection={{
      onChange: this.props.onSelectionChange
    }}
  />
}