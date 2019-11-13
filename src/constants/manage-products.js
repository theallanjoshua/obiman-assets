import * as React from 'react';
import { Utils } from 'obiman-data-models';
import moment from 'moment';
import { Popconfirm, Button, Tag } from 'antd';
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
export const ALL_PRODUCTS_TABLE_COLUMN_DEFINITION = [
  {
    title: 'Product',
    dataIndex: 'label',
    render: (text, product) => <div>
      <S3ToImage s3Key={product.image} />
      <div className='vertical-center-align space-between'>
        {product.label}
        <div className='right-align'>
          {product.onEdit ? <Button
            type='link'
            icon='edit'
            onClick={() => product.onEdit(product)}
          /> : null}
          {product.onDelete ? <Popconfirm
            title={`Are you sure you want to delete ${product.label} from products?`}
            okText={'Delete'}
            onConfirm={() => product.onDelete(product)}
          >
            <Button
              type='link'
              icon='delete'
            />
          </Popconfirm> : null}
        </div>
      </div>
    </div>,
    fixed: 'left',
    width: 200,
    ...DEFAULT_TABLE_FEATURES(({ label }) => label, ({ label }) => label, 'Search products')
  },
  {
    title: 'Issues',
    dataIndex: 'issues',
    render: (text, { issues }) => issues.map(issue => <Tag key={issue} color='red' children={issue} />),
    ...DEFAULT_TABLE_FEATURES(({ issues }) => issues.join(', '), ({ issues }) => issues.join(', '), 'Search issues')
  },
  {
    title: 'Classification',
    dataIndex: 'classification',
    ...DEFAULT_TABLE_FEATURES(({ classification }) => classification, ({ classification }) => classification, 'Search classification')
  },
  {
    title: 'Description',
    dataIndex: 'description',
    ...DEFAULT_TABLE_FEATURES(({ description }) => description, ({ description }) => description, 'Search description')
  },
  {
    title: 'Selling price',
    dataIndex: 'price',
    render: (text, { price, currency }) => `${new Utils().getCurrencySymbol(currency)}${price.toLocaleString()}`,
    ...DEFAULT_TABLE_FEATURES(({ price }) => price, ({ price, currency }) => `${new Utils().getCurrencySymbol(currency)}${price.toLocaleString()}`, 'Search selling price')
  },
  {
    title: 'Profit',
    dataIndex: 'profit',
    render: (text, { profit, currency }) => `${new Utils().getCurrencySymbol(currency)}${profit.toLocaleString()}`,
    ...DEFAULT_TABLE_FEATURES(({ profit }) => profit, ({ profit, currency }) => `${new Utils().getCurrencySymbol(currency)}${profit.toLocaleString()}`, 'Search profit')
  },
  // {
  //   title: 'Created by',
  //   dataIndex: 'createdBy',
  //   ...DEFAULT_TABLE_FEATURES(({ createdBy }) => createdBy, ({ createdBy }) => createdBy, 'Search created by')
  // },
  // {
  //   title: 'Created on',
  //   dataIndex: 'createdDate',
  //   render: (text, { createdDate }) => <Timestamp value={createdDate} />,
  //   ...DEFAULT_TABLE_FEATURES(({ createdDate }) => createdDate, ({ createdDate }) => moment(createdDate).fromNow(), 'Search created on')
  // },
  // {
  //   title: 'Last edited by',
  //   dataIndex: 'updatedBy',
  //   ...DEFAULT_TABLE_FEATURES(({ updatedBy }) => updatedBy, ({ updatedBy }) => updatedBy, 'Search last edited by')
  // },
  // {
  //   title: 'Last edited on',
  //   dataIndex: 'updatedDate',
  //   render: (text, { updatedDate }) => updatedDate ? <Timestamp value={updatedDate} /> : '-',
  //   ...DEFAULT_TABLE_FEATURES(({ updatedDate }) => updatedDate, ({ updatedDate }) => moment(updatedDate).fromNow(), 'Search last edited on')
  // }
];