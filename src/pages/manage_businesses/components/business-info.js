import * as React from 'react';
import { Form, Input, Select, Collapse } from 'antd';
import { Business, Utils } from 'obiman-data-models';
import Employees from './employees';
import ImageUploader from '../../../components/image-uploader';
import Contacts from './contacts';
import StringArrayEditor from '../../../components/string-array-editor';

const { TextArea } = Input;
const { Panel } = Collapse;

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

export default class BusinessInfo extends React.Component {
  set = (key, value) => this.props.onChange({ ...new Business({ ...this.props.business }).get(), [key]: value });
  setLabel = e => this.set('label', e.target.value);
  setLogo = logo => this.set('logo', logo);
  setAddress = e => this.set('address', e.target.value);
  setContacts = contacts => this.set('contacts', contacts);
  setCoordinates = coordinates => this.set('coordinates', coordinates);
  setCurrency = currency => this.set('currency', currency);
  setEmployees = employees => this.set('employees', employees);
  setIngredientLocations = ingredientLocations => this.set('ingredientLocations', ingredientLocations);
  setProductClassifications = productClassifications => this.set('productClassifications', productClassifications);
  setProductTaxTypes = productTaxesTypes => this.set('productTaxesTypes', productTaxesTypes);
  setBillSources = billSources => this.set('billSources', billSources);
  setTables = tables => this.set('tables', tables);
  render = () => {
    const business = new Business({ ...this.props.business });
    const businessData = business.get();
    const validationErrors = business.validate();
    return <Form>
      <Collapse defaultActiveKey='Basic information'>
        <Panel header='Basic information' key='Basic information'>
          <Form.Item
            { ...formItemLayout }
            label={'Logo'}
            children={
              <ImageUploader
                s3Key={businessData.logo}
                onChange={this.setLogo}
              />
            }
          />
          <Form.Item
            { ...formItemLayout }
            label={'Name'}
            required
            hasFeedback
            { ...formValidation(this.props.showValidationErrors, validationErrors.label) }
            children={
              <Input
                placeholder={'Eg: Joe\'s Pizza'}
                value={businessData.label}
                onChange={this.setLabel}
              />
            }
          />
          <Form.Item
            { ...formItemLayout }
            label={'Currency'}
            required
            { ...formValidation(this.props.showValidationErrors, [ ...(validationErrors.price || []), ...(validationErrors.currency || []) ]) }
            children={
              <Select
                showSearch
                allowClear
                filterOption
                placeholder={'Eg: INR'}
                optionFilterProp='children'
                value={businessData.currency || undefined}
                onChange={this.setCurrency}
              >
                {new Utils().getCurrencyCodes().map(currency => <Select.Option key={currency} value={currency} children={currency}/>)}
              </Select>
            }
          />
          <Form.Item
            { ...formItemLayout }
            label={'Address'}
            children={
              <TextArea
                autoSize={{ minRows: 4 }}
                placeholder={'Eg: 15, Yemen road, Yemen'}
                value={businessData.address}
                onChange={this.setAddress}
              />
            }
          />
        </Panel>
        <Panel header='Contacts' key='Contacts'>
          <Form.Item
            { ...formItemLayout }
            label={'Contact'}
            { ...formValidation(this.props.showValidationErrors, validationErrors.contacts) }
            children={
              <Contacts
                showValidationErrors={this.props.showValidationErrors}
                contacts={businessData.contacts}
                onChange={this.setContacts}
              />
            }
          />
        </Panel>
        <Panel header='Employees' key='Employees'>
          <Form.Item
            { ...formItemLayout }
            label={'Employees'}
            required
            { ...formValidation(this.props.showValidationErrors, validationErrors.employees) }
            children={
              <Employees
                showValidationErrors={this.props.showValidationErrors}
                employees={businessData.employees}
                onChange={this.setEmployees}
              />
            }
          />
        </Panel>
        <Panel header='Ingredient locations' key='Ingredient locations'>
          <Form.Item
            { ...formItemLayout }
            label={'Ingredient locations'}
            { ...formValidation(this.props.showValidationErrors, validationErrors.ingredientLocations) }
            children={
              <StringArrayEditor
                items={businessData.ingredientLocations || []}
                placeholder={'Eg: Freezer'}
                onChange={this.setIngredientLocations}
              />
            }
          />
        </Panel>
        <Panel header='Product classifications' key='Product classifications'>
          <Form.Item
            { ...formItemLayout }
            label={'Product classifications'}
            { ...formValidation(this.props.showValidationErrors, validationErrors.productClassifications) }
            children={
              <StringArrayEditor
                items={businessData.productClassifications || []}
                placeholder={'Eg: Salad'}
                onChange={this.setProductClassifications}
              />
            }
          />
        </Panel>
        <Panel header='Tax types' key='Tax types'>
          <Form.Item
            { ...formItemLayout }
            label={'Tax types'}
            { ...formValidation(this.props.showValidationErrors, validationErrors.productTaxesTypes) }
            children={
              <StringArrayEditor
                items={businessData.productTaxesTypes || []}
                placeholder={'Eg: VAT'}
                onChange={this.setProductTaxTypes}
              />
            }
          />
        </Panel>
        <Panel header='Billing sources' key='Billing sources'>
          <Form.Item
            { ...formItemLayout }
            label={'Billing sources'}
            { ...formValidation(this.props.showValidationErrors, validationErrors.billSources) }
            children={
              <StringArrayEditor
                items={businessData.billSources || []}
                placeholder={'Eg: Uber eats'}
                onChange={this.setbillSources}
              />
            }
          />
        </Panel>
      </Collapse>
    </Form>
  };
}