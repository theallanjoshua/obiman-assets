import * as React from 'react';
import { Utils } from 'obiman-data-models';
import moment from 'moment';
import { Popconfirm, Button, Tag, Typography, Tooltip } from 'antd';
import { DEFAULT_TABLE_FEATURES } from './app';
import Timestamp from '../components/timestamp';
import S3ToImage from '../components/s3-to-image';

export const MANAGE_PRODUCTS_PAGE_TITLE = count => `All products (${count})`;
export const PRODUCT_DELETED_SUCCESSFULLY_MESSAGE = label => `${label} deleted successfully`;
export const ADD_PRODUCT_BUTTON_TEXT = 'Add new product';
export const ADD_MODAL_HEADER = 'Add new product';
export const PRODUCT_ADDED_SUCCESSFULLY_MESSAGE = label => `${label} added to products successfully`;
export const EDIT_MODAL_HEADER = 'Edit product';
export const PRODUCT_EDITED_SUCCESSFULLY_MESSAGE = label => `${label} edited successfully`;

export const ProductImage = ({ product, size }) => <S3ToImage s3Key={product.image} />;
export const ProductLabel = ({ product }) => product.label;
export const ProductEdit = ({ product }) => <Button
  type='link'
  icon='edit'
  onClick={() => product.onEdit(product)}
/>
export const ProductDelete = ({ product }) => <Popconfirm
  title={`Are you sure you want to delete ${product.label} from products?`}
  okText={'Delete'}
  onConfirm={() => product.onDelete(product)}
  >
  <Button
    type='link'
    icon='delete'
  />
</Popconfirm>;
export const ProductIssues = ({ product }) => {
  const { issues } = product;
  return issues.map(issue => <Tag key={issue} style={{ margin: '1px' }} color='#f50' children={issue} />);
}
export const ProductClassification = ({ product }) => product.classification;
export const ProductDescription = ({ product }) => <Tooltip
  title={product.description}
  placement={'rightBottom'}
>
  <Typography.Paragraph ellipsis={{ rows: 3 }}>
    {product.description}
  </Typography.Paragraph>
</Tooltip>
export const ProductPrice = ({ product }) => {
  const { price, currency } = product;
  return `${new Utils().getCurrencySymbol(currency)}${price.toLocaleString()}`
};

export const ALL_PRODUCTS_TABLE_COLUMN_DEFINITION = [
  {
    title: 'Product',
    dataIndex: 'label',
    render: (text, product) => <div className='space-between'>
      <ProductLabel product={product} />
      <div className='right-align'>
        <ProductEdit product={product} />
        <ProductDelete product={product} />
      </div>
    </div>,
    fixed: 'left',
    width: 200,
    ...DEFAULT_TABLE_FEATURES(({ label }) => label, ({ label }) => label, 'Search products')
  },
  {
    title: 'Issues',
    dataIndex: 'issues',
    render: (text, product) => <ProductIssues product={product} />,
    ...DEFAULT_TABLE_FEATURES(({ issues }) => issues.join(', '), ({ issues }) => issues.join(', '), 'Search issues')
  },
  {
    title: 'Classification',
    dataIndex: 'classification',
    render: (text, product) => <ProductClassification product={product} />,
    ...DEFAULT_TABLE_FEATURES(({ classification }) => classification, ({ classification }) => classification, 'Search classification')
  },
  {
    title: 'Selling price',
    dataIndex: 'price',
    render: (text, product) => <ProductPrice product={product} />,
    ...DEFAULT_TABLE_FEATURES(({ price }) => price, ({ price, currency }) => `${new Utils().getCurrencySymbol(currency)}${price.toLocaleString()}`, 'Search selling price')
  },
  {
    title: 'Created by',
    dataIndex: 'createdBy',
    ...DEFAULT_TABLE_FEATURES(({ createdBy }) => createdBy, ({ createdBy }) => createdBy, 'Search created by')
  },
  {
    title: 'Created on',
    dataIndex: 'createdDate',
    render: (text, { createdDate }) => <Timestamp value={createdDate} />,
    ...DEFAULT_TABLE_FEATURES(({ createdDate }) => createdDate, ({ createdDate }) => moment(createdDate).fromNow(), 'Search created on')
  },
  {
    title: 'Last edited by',
    dataIndex: 'updatedBy',
    ...DEFAULT_TABLE_FEATURES(({ updatedBy }) => updatedBy, ({ updatedBy }) => updatedBy, 'Search last edited by')
  },
  {
    title: 'Last edited on',
    dataIndex: 'updatedDate',
    render: (text, { updatedDate }) => updatedDate ? <Timestamp value={updatedDate} /> : '-',
    ...DEFAULT_TABLE_FEATURES(({ updatedDate }) => updatedDate, ({ updatedDate }) => moment(updatedDate).fromNow(), 'Search last edited on')
  }
];