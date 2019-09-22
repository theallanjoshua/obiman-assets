import * as React from 'react';
import { Utils } from 'obiman-data-models';
import moment from 'moment';
import { Popconfirm, Button, Tooltip, Tag } from 'antd';
import { DATE_TIME_FORMAT, DEFAULT_TABLE_FEATURES } from './app';

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
    fixed: 'left',
    width: 100,
    ...DEFAULT_TABLE_FEATURES(({ label }) => label, ({ label }) => label, 'Search products')
  },
  {
    title: 'Issues',
    dataIndex: 'issues',
    render: (text, { issues }) => issues.map(issue => <Tag key={issue} color='red' children={issue} />),
    ...DEFAULT_TABLE_FEATURES(({ issues }) => issues.join(', '), ({ issues }) => issues.join(', '), 'Search issues')
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
    title: 'Created by',
    dataIndex: 'createdBy',
    render: (text, { createdBy }) => createdBy,
    ...DEFAULT_TABLE_FEATURES(({ createdBy }) => createdBy, ({ createdBy }) => createdBy, 'Search created by')
  },
  {
    title: 'Created on',
    dataIndex: 'createdDate',
    render: (text, { createdDate }) => <Tooltip title={`${moment(createdDate).format(DATE_TIME_FORMAT)}`} children={`${moment(createdDate).fromNow()}`} />,
    ...DEFAULT_TABLE_FEATURES(({ createdDate }) => createdDate, ({ createdDate }) => moment(createdDate).fromNow(), 'Search created on')
  },
  {
    title: 'Last edited by',
    dataIndex: 'updatedBy',
    render: (text, { updatedBy }) => updatedBy,
    ...DEFAULT_TABLE_FEATURES(({ updatedBy }) => updatedBy, ({ updatedBy }) => updatedBy, 'Search last edited by')
  },
  {
    title: 'Last edited on',
    dataIndex: 'updatedDate',
    render: (text, { updatedDate }) => updatedDate ? <Tooltip title={`${moment(updatedDate).format(DATE_TIME_FORMAT)}`} children={`${moment(updatedDate).fromNow()}`} /> : '-',
    ...DEFAULT_TABLE_FEATURES(({ updatedDate }) => updatedDate, ({ updatedDate }) => moment(updatedDate).fromNow(), 'Search last edited on')
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    render: (text, product) => <React.Fragment>
      <Button
        type='link'
        icon='edit'
        children='Edit'
        onClick={() => product.onEdit(product)}
      />
      <br />
      <Popconfirm
        title={`Are you sure you want to delete ${product.label} from products?`}
        okText={'Delete'}
        onConfirm={() => product.onDelete(product)}
      >
        <Button
          type='link'
          icon='delete'
          children='Delete'
        />
      </Popconfirm>
    </React.Fragment>
  }
];