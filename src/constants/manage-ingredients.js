import * as React from 'react';
import { Utils } from 'obiman-data-models';
import moment from 'moment';
import { Popconfirm, Button, Tooltip } from 'antd';
import { DATE_TIME_FORMAT, DEFAULT_TABLE_FEATURES } from './app';

export const MANAGE_INGREDIENTS_PAGE_TITLE = count => `All ingredients (${count})`;
export const INGREDIENT_DELETED_SUCCESSFULLY_MESSAGE = label => `${label} deleted successfully`;
export const ADD_INGREDIENT_BUTTON_TEXT = 'Add new ingredient';
export const ADD_MODAL_HEADER = 'Add new ingredient';
export const INGREDIENT_ADDED_SUCCESSFULLY_MESSAGE = label => `${label} added to ingredients successfully`;
export const EDIT_MODAL_HEADER = 'Edit ingredient';
export const INGREDIENT_EDITED_SUCCESSFULLY_MESSAGE = label => `${label} edited successfully`;
export const ALL_INGREDIENTS_TABLE_COLUMN_DEFINITION = [
  {
    title: 'Ingredient',
    dataIndex: 'label',
    fixed: 'left',
    width: 100,
    ...DEFAULT_TABLE_FEATURES(({ label }) => label, ({ label }) => label, 'Search ingredients')
  },
  {
    title: 'Available quantity',
    dataIndex: 'quantity',
    render: (text, { quantity, unit, thresholdQuantity, thresholdUnit }) => {
      const convertedQuantity = thresholdUnit ? new Utils().convert(quantity, unit, thresholdUnit) : quantity;
      const style = !convertedQuantity ? { color: '#cf1322' } : convertedQuantity < thresholdQuantity ? { color: '#ffbf00' } : { color: '#3f8600' } ;
      return <h1 style={style}>{`${quantity ? `${quantity.toLocaleString()}${unit}` : `Out of stock`}`}</h1>
    },
    ...DEFAULT_TABLE_FEATURES(({ quantity, unit }) => `${quantity ? `${quantity.toLocaleString()}${unit}` : `Out of stock`}`, ({ quantity, unit }) => `${quantity ? `${quantity.toLocaleString()}${unit}` : `Out of stock`}`, 'Search quantity')
  },
  {
    title: 'Expiries by',
    dataIndex: 'expiryDate',
    render: (text, { expiryDate }) => expiryDate ? <Tooltip title={`${moment(expiryDate).format(DATE_TIME_FORMAT)}`} children={`${moment(expiryDate).fromNow()}`} /> : '-',
    ...DEFAULT_TABLE_FEATURES(({ expiryDate }) => expiryDate, ({ expiryDate }) => moment(expiryDate).fromNow(), 'Search expires by')
  },
  {
    title: 'Location',
    dataIndex: 'location',
    ...DEFAULT_TABLE_FEATURES(({ location }) => location, ({ location }) => location, 'Search locations')
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
    ...DEFAULT_TABLE_FEATURES(({ updatedBy }) => updatedBy, ({ updatedBy }) => updatedBy, 'Search created by')
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