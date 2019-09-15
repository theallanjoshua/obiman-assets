import * as React from 'react';
import { Form, Input, InputNumber } from 'antd';
import { Product, Utils } from 'obiman-data-models';
import ProductComposition from './product-composition';
import TaxComposition from './tax-composition';

const { TextArea } = Input;

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
})

export default class ProductInfo extends React.Component {
  set = (key, value) => this.props.onChange({ ...new Product({ ...this.props.product }).get(), [key]: value });
  setLabel = e => this.set('label', e.target.value);
  setDescription = e => this.set('description', e.target.value);
  setImage = image => this.set('image', image);
  setComposition = composition => this.set('composition', composition);
  setRecipe = e => this.set('recipe', e.target.value);
  setPrice = price => this.set('price', price);
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
            ingredients={this.props.ingredients}
            composition={productData.composition}
            onChange={this.setComposition}
          />
        }
      />
      <Form.Item
        { ...formItemLayout }
        required
        label={'Selling price'}
        { ...formValidation(this.props.showValidationErrors, validationErrors.price) }
        children={
          <InputNumber
            min={0}
            value={productData.price}
            formatter={value => `${new Utils().getCurrencySymbol(this.props.currency)} ${value}`}
            parser={value => {
              const parsedValue = Number(value.replace(`${new Utils().getCurrencySymbol(this.props.currency)}`, '').trim());
              return isNaN(parsedValue) ? 0 : parsedValue;
            }}
            onChange={this.setPrice}
          />
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Applicable tax'}
        required
        children={
          <TaxComposition
            showValidationErrors={this.props.showValidationErrors}
            tax={productData.tax}
            onChange={this.setTax}
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
    </Form>
  };
}