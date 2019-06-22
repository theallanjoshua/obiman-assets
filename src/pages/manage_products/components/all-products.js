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
      renderItem={({ label, quantity, unit, quantityGap}) => (
        <List.Item>
          {`${label} - ${quantity}${unit} `}
          {quantityGap < 0 ? <Tag color='red' children={`Need ${quantityGap * -1}${unit} more`} /> : null}
        </List.Item>
      )}
    />}
  />
}