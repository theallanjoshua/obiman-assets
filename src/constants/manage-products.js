import * as React from 'react';
import { Utils } from 'obiman-data-models';
import moment from 'moment';
import { Popconfirm, Button, Tooltip, Tag } from 'antd';
import { DATE_TIME_FORMAT } from './app';

export const PRODUCT_DELETED_SUCCESSFULLY_MESSAGE = label => `${label} deleted successfully`;
export const MANAGE_PRODUCTS_PAGE_TITLE = count => `All products (${count})`;
export const ADD_PRODUCT_BUTTON_TEXT = 'Add new product';
export const PRODUCT_ADDED_SUCCESSFULLY_MESSAGE = label => `${label} added to products successfully`;
export const ADD_MODAL_HEADER = 'Add new product';
export const ALL_PRODUCTS_TABLE_COLUMN_DEFINITION = [
  {
    title: 'Product',
    dataIndex: 'label',
    fixed: 'left',
    width: 100
  },
  {
    title: 'Low inventory ingredients',
    render: (text, { composition }) => composition
      .filter(({ quantityGap }) => quantityGap < 0)
      .map(({ label, quantityGap, unit }, index) => <div style={index > 0 ? { marginTop: '10px' } : {}}>
        {label}
        <Tag color='red' children={`Need ${quantityGap * -1}${unit} more`} />
      </div>)
  },
  {
    title: 'Description',
    dataIndex: 'description'
  },
  {
    title: 'Selling price',
    render: (text, { price, currency }) => `${price ? `${new Utils().getCurrencySymbol(currency)}${price}` : `-`}`
  },
  {
    title: 'Created by',
    render: (text, { createdBy }) => createdBy
  },
  {
    title: 'Created on',
    render: (text, { createdDate }) => <Tooltip title={`${moment(createdDate).format(DATE_TIME_FORMAT)}`} children={`${moment(createdDate).fromNow()}`} />
  },
  {
    title: 'Last edited by',
    render: (text, { updatedBy }) => updatedBy
  },
  {
    title: 'Last edited on',
    render: (text, { updatedDate }) => updatedDate ? <Tooltip title={`${moment(updatedDate).format(DATE_TIME_FORMAT)}`} children={`${moment(updatedDate).fromNow()}`} /> : '-'
  },
  {
    title: 'Actions',
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
export const PRODUCT_EDITED_SUCCESSFULLY_MESSAGE = label => `${label} edited successfully`;
export const EDIT_MODAL_HEADER = 'Edit product';