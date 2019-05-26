import * as React from 'react';
import { Table } from 'antd';

const columns = [
  {
    title: 'Ingredient',
    dataIndex: 'label',
    key: 'label',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
  }
];

export default class AllIngredients extends React.Component {
  render = () => <Table
  loading={this.props.loading}
  dataSource={this.props.ingredients.map(ingredient => ({ ...ingredient, key: ingredient.id}))}
  columns={columns}
/>
}