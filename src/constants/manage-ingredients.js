import * as React from 'react';
import { Utils } from 'obiman-data-models';
import { Popconfirm, Button } from 'antd';
import { DEFAULT_TABLE_FEATURES } from './app';
import Timestamp from '../components/timestamp';
import moment from 'moment';
import S3ToImage from '../components/s3-to-image';

export const MANAGE_INGREDIENTS_PAGE_TITLE = count => `All ingredients (${count})`;
export const INGREDIENT_DELETED_SUCCESSFULLY_MESSAGE = label => `${label} deleted successfully`;
export const ADD_INGREDIENT_BUTTON_TEXT = 'Add new ingredient';
export const ADD_MODAL_HEADER = 'Add new ingredient';
export const INGREDIENT_ADDED_SUCCESSFULLY_MESSAGE = label => `${label} added to ingredients successfully`;
export const EDIT_MODAL_HEADER = 'Edit ingredient';
export const INGREDIENT_EDITED_SUCCESSFULLY_MESSAGE = label => `${label} edited successfully`;

export const IngredientImage = ({ ingredient, width, height }) => <S3ToImage
  s3Key={ingredient.image}
  width={width}
  height={height}
/>;
export const IngredientLabel = ({ ingredient }) => ingredient.label;
export const IngredientEdit = ({ ingredient }) => <Button
  type='link'
  icon='edit'
  onClick={() => ingredient.onEdit(ingredient)}
/>
export const IngredientDelete = ({ ingredient }) => <Popconfirm
  title={`Are you sure you want to delete ${ingredient.label} from ingredients?`}
  okText={'Delete'}
  onConfirm={() => ingredient.onDelete(ingredient)}
  >
  <Button
    type='link'
    icon='delete'
  />
</Popconfirm>;
export const IngredientLocation = ({ ingredient }) => ingredient.location ? `in ${ingredient.location}` : null;
export const IngredientQuantity = ({ ingredient }) => {
  const { quantity, unit, thresholdQuantity, thresholdUnit } = ingredient;
  const convertedQuantity = thresholdUnit ? new Utils().convert(quantity, unit, thresholdUnit) : quantity;
  return <div className='baseline-align'>
    {!convertedQuantity ? <h1 style={{ marginBottom: 0, color: '#cf1322' }}>Out of stock</h1> :
    convertedQuantity <= thresholdQuantity ? <h2 style={{ color: '#ffbf00' }}>{`${quantity.toLocaleString()}${unit}`}</h2> :
    <span>{`${quantity.toLocaleString()}${unit}`}</span>}
    {convertedQuantity ? <span style={{ paddingLeft: '5px' }}>left</span> : null}
  </div>
}
export const IngredientExpiry = ({ ingredient }) => {
  const { expiryDate } = ingredient;
  return expiryDate ? expiryDate < Date.now() ?
    <div className='baseline-align'>
      <h1 style={{ color: '#cf1322', marginBottom: 0 }}>Expired</h1>
      <span style={{ paddingLeft: '5px' }}>(<Timestamp value={expiryDate} />)</span>
    </div> : !moment().diff(expiryDate, 'days') ? <div className='baseline-align'>
      <h1 style={{ color: '#ffbf00', marginBottom: 0 }}>Expiring</h1>
      <span style={{ paddingLeft: '5px' }}>(<Timestamp value={expiryDate} />)</span>
    </div> :
    <span>Expires <Timestamp value={expiryDate} /></span> : '-'
}
export const IngredientCost = ({ ingredient }) => {
  const { cost, currency, unit } = ingredient;
  return cost ? `${new Utils().getCurrencySymbol(currency)}${cost.toLocaleString()}/${unit}` : '-';
}

export const ALL_INGREDIENTS_TABLE_COLUMN_DEFINITION = [
  {
    title: 'Ingredient',
    dataIndex: 'label',
    render: (text, ingredient) => <div>
      <IngredientImage ingredient={ingredient} />
      <div className='vertical-center-align space-between'>
        <IngredientLabel ingredient={ingredient} />
        <div className='right-align'>
          <IngredientEdit ingredient={ingredient} />
          <IngredientDelete ingredient={ingredient} />
        </div>
      </div>
    </div>,
    fixed: 'left',
    width: 272,
    ...DEFAULT_TABLE_FEATURES(({ label }) => label, ({ label }) => label, 'Search ingredients')
  },
  {
    title: 'Available quantity',
    dataIndex: 'quantity',
    render: (text, ingredient) => <IngredientQuantity ingredient={ingredient} />,
    ...DEFAULT_TABLE_FEATURES(({ quantity, unit }) => `${quantity ? `${quantity.toLocaleString()}${unit}` : `Out of stock`}`, ({ quantity, unit }) => `${quantity ? `${quantity.toLocaleString()}${unit}` : `Out of stock`}`, 'Search quantity')
  },
  {
    title: 'Expiries by',
    dataIndex: 'expiryDate',
    render: (text, ingredient) => <IngredientExpiry ingredient={ingredient} />,
    ...DEFAULT_TABLE_FEATURES(({ expiryDate }) => expiryDate, ({ expiryDate }) => moment(expiryDate).fromNow(), 'Search expires by')
  },
  {
    title: 'Location',
    dataIndex: 'location',
    render: (text, ingredient) => <IngredientLocation ingredient={ingredient} />,
    ...DEFAULT_TABLE_FEATURES(({ location }) => location, ({ location }) => location, 'Search locations')
  },
  {
    title: 'Cost price',
    dataIndex: 'cost',
    render: (text, ingredient) => <IngredientCost ingredient={ingredient} />,
    ...DEFAULT_TABLE_FEATURES(({ cost }) => cost, ({ cost, currency, unit }) => cost ? `${new Utils().getCurrencySymbol(currency)}${cost.toLocaleString()}/${unit}` : '-', 'Search cost price')
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
    ...DEFAULT_TABLE_FEATURES(({ updatedBy }) => updatedBy, ({ updatedBy }) => updatedBy, 'Search created by')
  },
  {
    title: 'Last edited on',
    dataIndex: 'updatedDate',
    render: (text, { updatedDate }) => updatedDate ? <Timestamp value={updatedDate} /> : '-',
    ...DEFAULT_TABLE_FEATURES(({ updatedDate }) => updatedDate, ({ updatedDate }) => moment(updatedDate).fromNow(), 'Search last edited on')
  }
];