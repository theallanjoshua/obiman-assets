import * as React from 'react';
import { Table, Empty } from 'antd';
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
    scroll={{ x: true }}
    locale={{
      emptyText: <Empty description='No products' />
    }}
  />
}