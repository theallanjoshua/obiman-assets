import * as React from 'react';
import { Table } from 'antd';

const columns = [
  {
    title: 'Ingredient',
    dataIndex: 'label',
    key: 'label',
  },
  {
    title: 'Available quantity',
    render: (text, { quantity, unit }) => `${quantity} ${unit}`
  },
  {
    title: 'Cost price',
    render: (text, { cost, currency }) => `${cost} ${currency}`
  }
];

export default class AllIngredients extends React.Component {
  render = () => <Table
  loading={this.props.loading}
  dataSource={this.props.ingredients.map(ingredient => ({ ...ingredient, key: ingredient.id}))}
  columns={columns}
/>
}