import * as React from 'react';
import { Form, Input, InputNumber, Select, DatePicker } from 'antd';
import { Ingredient, Utils } from 'obiman-data-models';
import moment from 'moment';
import { DATE_TIME_FORMAT } from '../../../constants/app';
import ImageUploader from '../../../components/image-uploader';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 15 }
  }
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
  setImage = image => this.set('image', image);
  setQuantity = quantity => this.set('quantity', quantity);
  setUnit = unit => this.set('unit', unit);
  setExpiryDate = expiryDate => this.set('expiryDate', expiryDate.valueOf());
  setLocation = e => this.set('location', e.target.value);
  setThresholdQuantity = thresholdQuantity => this.set('thresholdQuantity', thresholdQuantity);
  setThresholdUnit = thresholdUnit => this.set('thresholdUnit', thresholdUnit);
  setCost = cost => this.set('cost', cost);
  render = () => {
    const utils = new Utils();
    const ingredient = new Ingredient({ ...this.props.ingredient });
    const ingredientData = ingredient.get();
    const validationErrors = ingredient.validate();
    return <Form>
      <Form.Item
        { ...formItemLayout }
        label={'Name'}
        required
        hasFeedback
        { ...formValidation(this.props.showValidationErrors, validationErrors.label) }
        children={
          <Input
            placeholder={'Eg: Onion'}
            value={ingredientData.label}
            onChange={this.setLabel}
          />
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Image'}
        children={
          <ImageUploader
            s3Key={ingredientData.image}
            onChange={this.setImage}
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
              filterOption
              placeholder={'Eg: kg'}
              optionFilterProp='children'
              value={ingredientData.unit || undefined}
              onChange={this.setUnit}
            >
              {utils.getUnits().map(unit => <Select.Option key={unit} value={unit} children={unit}/>)}
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
            style={{ width: '100%' }}
            value={ingredientData.expiryDate ? moment(ingredientData.expiryDate) : undefined}
            format={DATE_TIME_FORMAT}
            onChange={this.setExpiryDate}
          />
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Location'}
        children={
          <Input
            placeholder={'Eg: Freezer'}
            value={ingredientData.location}
            onChange={this.setLocation}
          />
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Threshold quantity'}
        { ...formValidation(this.props.showValidationErrors, [ ...(validationErrors.thresholdQuantity || []), ...(validationErrors.thresholdUnit || []) ]) }
        children={
          <div className='input-select-group'>
            <InputNumber
              min={0}
              value={ingredientData.thresholdQuantity}
              onChange={this.setThresholdQuantity}
            />
            <Select
              disabled={!ingredientData.unit}
              showSearch
              allowClear
              filterOption
              placeholder={'Eg: g'}
              optionFilterProp='children'
              value={ingredientData.thresholdUnit || undefined}
              onChange={this.setThresholdUnit}
            >
              {utils.getUnits(ingredientData.unit).map(unit => <Select.Option key={unit} value={unit} children={unit}/>)}
            </Select>
          </div>
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={`Cost price ${ingredientData.unit ? `per ${ingredientData.unit}` : ``}`}
        { ...formValidation(this.props.showValidationErrors, validationErrors.cost) }
        children={
          <InputNumber
            min={0}
            precision={2}
            value={ingredientData.cost}
            formatter={value => `${new Utils().getCurrencySymbol(this.props.currency)} ${value}`}
            parser={value => value.replace(`${new Utils().getCurrencySymbol(this.props.currency)}`, '').trim()}
            onChange={this.setCost}
          />
        }
      />
    </Form>
  };
}