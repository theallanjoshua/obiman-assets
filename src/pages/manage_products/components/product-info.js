import * as React from 'react';
import { Form, Input, InputNumber, Select, Row, Col } from 'antd';
import { Product, Utils } from 'obiman-data-models';
import ProductComposition from './product-composition';

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 }
}

const formValidation = (showValidationErrors, validationErrors = []) => ({
  validateStatus: showValidationErrors ? validationErrors.length ? 'error' : 'success' : '',
  help: showValidationErrors ? validationErrors.length > 1 ? <ul>
    {validationErrors.map(error => <li key={error}>{error}</li>)}
  </ul> : validationErrors.join(',') : undefined
})

export default class ProductInfo extends React.Component {
  set = (key, value) => this.props.onChange({ ...new Product({ ...this.props.product }).get(), [key]: value });
  setLabel = e => this.set('label', e.target.value);
  setDescription = e => this.set('description', e.target.value);
  setImage = image => this.set('image', image);
  setComposition = composition => this.set('composition', composition);
  setRecipe = e => this.set('recipe', e.target.value);
  setPrice = price => this.set('price', price);
  setCurrency = currency => this.set('currency', currency);
  setTax = tax => this.set('tax', tax);

  render = () => {
    const product = new Product({ ...this.props.product });
    const productData = product.get();
    const validationErrors = product.validate();
    return <Form>
      <Form.Item
        { ...formItemLayout }
        label={'Name'}
        required
        hasFeedback
        { ...formValidation(this.props.showValidationErrors, validationErrors.label) }
        children={
          <Input
            placeholder={'Enter a name for the product'}
            value={productData.label}
            onChange={this.setLabel}
          />
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Ingredients used'}
        required
        children={
          <ProductComposition
            showValidationErrors={this.props.showValidationErrors}
            validationErrors={validationErrors.composition || []}
            ingredients={this.props.ingredients}
            composition={productData.composition}
            onChange={this.setComposition}
          />
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Description'}
        children={
          <TextArea
            autosize={{ minRows: 4 }}
            placeholder={'Enter a description for the product'}
            value={productData.description}
            onChange={this.setDescription}
          />
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Recipe'}
        children={
          <TextArea
            autosize={{ minRows: 4 }}
            placeholder={'Enter the recipe for the product'}
            value={productData.recipe}
            onChange={this.setRecipe}
          />
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Selling price'}
        { ...formValidation(this.props.showValidationErrors, [ ...(validationErrors.price || []), ...(validationErrors.currency || []) ]) }
        children={
          <div className='input-select-group'>
            <InputNumber
              min={0}
              value={productData.price}
              onChange={this.setPrice}
            />
            <Select
              showSearch
              allowClear
              placeholder={'currency'}
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              value={productData.currency || undefined}
              onChange={this.setCurrency}
            >
              {new Utils().getCurrencyCodes().map(currency => <Select.Option key={currency} value={currency} children={currency}/>)}
            </Select>
          </div>
        }
      />
    </Form>
  };
}