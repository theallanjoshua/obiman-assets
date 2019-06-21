import * as React from 'react';
import { Table, List, Tag } from 'antd';
import { ALL_PRODUCTS_TABLE_COLUMN_DEFINITION } from '../../../constants/manage-products';

export default class AllIngredients extends React.Component {
  render = () => <Table
    loading={this.props.loading}
    columns={ALL_PRODUCTS_TABLE_COLUMN_DEFINITION}
    dataSource={this.props.products.map(product => ({
      ...product,
      key: product.id,
      onEdit: this.props.showEditModal,
      onDelete: this.props.onDeleteProduct
    }))}
    expandedRowRender={record => <List
      header={<strong>Ingredients</strong>}
      dataSource={record.composition}
      renderItem={item => (
        <List.Item>
          {`${item.label} - ${item.quantity} ${item.unit} `}
          {!item.isAvailable ? <Tag color='red' children='Low inventory' /> : null}
        </List.Item>
      )}
    />}
  />
}