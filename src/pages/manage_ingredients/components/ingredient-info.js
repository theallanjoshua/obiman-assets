import * as React from 'react';
import { Form, Input, InputNumber, Select, DatePicker } from 'antd';
import { Ingredient, Utils } from 'obiman-data-models';
import moment from 'moment';

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 }
};

const formValidation = (showValidationErrors, validationErrors = []) => ({
  validateStatus: showValidationErrors ? validationErrors.length ? 'error' : 'success' : '',
  help: showValidationErrors ? validationErrors.length > 1 ? <ul>
    {validationErrors.map(error => <li key={error}>{error}</li>)}
  </ul> : validationErrors.join(',') : undefined
});

export default class IngredientInfo extends React.Component {
  set = (key, value) => this.props.onChange({ ...new Ingredient({ ...this.props.ingredient }).get(), [key]: value });
  setLabel = e => this.set('label', e.target.value);
  setQuantity = quantity => this.set('quantity', quantity);
  setUnit = unit => this.set('unit', unit);
  setCost = cost => this.set('cost', cost);
  setCurrency = currency => this.set('currency', currency);
  setExpiryDate = (expiryDate, expiryDateString) => this.set('expiryDate', expiryDateString ? new Date(expiryDateString).getTime() : 0);

  render = () => {
    const utils = new Utils();
    const ingredient = new Ingredient({ ...this.props.ingredient });
    const ingredientData = ingredient.get();
    const validationErrors = ingredient.validate();
    return <Form>
      <Form.Item
        { ...formItemLayout }
        label={'Name of the ingredient'}
        required
        hasFeedback
        { ...formValidation(this.props.showValidationErrors, validationErrors.label) }
        children={
          <Input
            placeholder={'Enter a name for the ingredient'}
            value={ingredientData.label}
            onChange={this.setLabel}
          />
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Quantity available'}
        { ...formValidation(this.props.showValidationErrors, [ ...(validationErrors.quantity || []), ...(validationErrors.unit || []) ]) }
        children={
          <div className='input-select-group'>
            <InputNumber
              min={0}
              value={ingredientData.quantity}
              onChange={this.setQuantity}
            />
            <Select
              showSearch
              allowClear
              placeholder={'unit'}
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
              defaultValue={ingredientData.unit || undefined}
              onChange={this.setUnit}
            >
              {utils.getUnits().map(unit => <Select.Option key={unit} value={unit} children={unit}/>)}
            </Select>
          </div>
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Cost per unit of quantity'}
        { ...formValidation(this.props.showValidationErrors, [ ...(validationErrors.cost || []), ...(validationErrors.currency || []) ]) }
        children={
          <div className='input-select-group'>
            <InputNumber
              min={0}
              value={ingredientData.cost}
              onChange={this.setCost}
            />
            <Select
              showSearch
              allowClear
              placeholder={'currency'}
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
              defaultValue={ingredientData.currency || undefined}
              onChange={this.setCurrency}
            >
              {utils.getCurrencyCodes().map(currency => <Select.Option key={currency} value={currency} children={currency}/>)}
            </Select>
          </div>
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Expiry date'}
        children={
          <DatePicker
            showTime
            style={{ minWidth: '240px' }}
            value={ingredientData.expiryDate ? moment(ingredientData.expiryDate) : undefined}
            onChange={this.setExpiryDate}
          />
        }
      />
    </Form>
  };
}