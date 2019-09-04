import * as React from 'react';
import { Utils } from 'obiman-data-models';
import moment from 'moment';
import { Popconfirm, Button, Tooltip } from 'antd';
import { DATE_TIME_FORMAT } from './app';

export const INGREDIENT_DELETED_SUCCESSFULLY_MESSAGE = label => `${label} deleted successfully`;
export const MANAGE_INGREDIENTS_PAGE_TITLE = count => `All ingredients (${count})`;
export const ADD_INGREDIENT_BUTTON_TEXT = 'Add new ingredient';
export const INGREDIENT_ADDED_SUCCESSFULLY_MESSAGE = label => `${label} added to ingredients successfully`;
export const ADD_MODAL_HEADER = 'Add new ingredient';
export const ALL_INGREDIENTS_TABLE_COLUMN_DEFINITION = [
  {
    title: 'Ingredient',
    dataIndex: 'label',
    fixed: 'left',
    width: 100
  },
  {
    title: 'Available quantity',
    render: (text, { quantity, unit }) => `${quantity ? `${quantity}${unit}` : `Out of stock`}`
  },
  {
    title: 'Cost price',
    render: (text, { cost, currency }) => `${cost ? `${new Utils().getCurrencySymbol(currency)}${cost}` : `-`}`
  },
  {
    title: 'Expiries by',
    render: (text, { expiryDate }) => expiryDate ? <Tooltip title={`${moment(expiryDate).format(DATE_TIME_FORMAT)}`} children={`${moment(expiryDate).fromNow()}`} /> : '-'
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
    render: (text, ingredient) => <React.Fragment>
      <Button
        type='link'
        icon='edit'
        children='Edit'
        onClick={() => ingredient.onEdit(ingredient)}
      />
      <br />
      <Popconfirm
        title={`Are you sure you want to delete ${ingredient.label} from ingredients?`}
        okText={'Delete'}
        onConfirm={() => ingredient.onDelete(ingredient)}
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
export const INGREDIENT_EDITED_SUCCESSFULLY_MESSAGE = label => `${label} edited successfully`;
export const EDIT_MODAL_HEADER = 'Edit ingredient';