import * as React from 'react';
import { Form, Input, Select } from 'antd';
import { Business, Utils } from 'obiman-data-models';
import { Consumer } from '../../../context';
import Employees from './employees';
import ImageUploader from '../../../components/image-uploader';

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

export default class BusinessInfo extends React.Component {
  set = (key, value) => this.props.onChange({ ...new Business({ ...this.props.business }).get(), [key]: value });
  setLabel = e => this.set('label', e.target.value);
  setLogo = logo => this.set('logo', logo);
  setAddress = e => this.set('address', e.target.value);
  setContact = e => this.set('contact', e.target.value);
  setCoordinates = coordinates => this.set('coordinates', coordinates);
  setCurrency = currency => this.set('currency', currency);
  setEmployees = employees => this.set('employees', employees);
  render = () => <Consumer>
  {({ email }) => {
    const business = new Business({ ...this.props.business });
    const businessData = business.get();
    const validationErrors = business.validate();
    return <Form>
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
        label={'Address'}
        children={
          <TextArea
            autosize={{ minRows: 4 }}
            placeholder={'Eg: 15, Yemen road, Yemen'}
            value={businessData.address}
            onChange={this.setAddress}
          />
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Contact'}
        children={
          <Input
            placeholder={'Eg: +91-9876543210 or someone@email.com'}
            value={businessData.contact}
            onChange={this.setContact}
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
            placeholder={'Eg: INR'}
            optionFilterProp='children'
            filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
            value={businessData.currency || undefined}
            onChange={this.setCurrency}
          >
            {new Utils().getCurrencyCodes().map(currency => <Select.Option key={currency} value={currency} children={currency}/>)}
          </Select>
        }
      />
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
        label={'Employees'}
        required
        children={
          <Employees
            showValidationErrors={this.props.showValidationErrors}
            currentUser={email}
            employees={businessData.employees}
            onChange={this.setEmployees}
          />
        }
      />
    </Form>
  }}
  </Consumer>;
}