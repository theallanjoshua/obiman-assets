import * as React from 'react';
import { Contact as CONTACT } from 'obiman-data-models';
import { Form, Input, Select } from 'antd';

const formItemLayout = {
  wrapperCol: { span: 24 }
};

const formValidation = (showValidationErrors, validationErrors = []) => ({
  validateStatus: showValidationErrors ? validationErrors.length ? 'error' : 'success' : '',
  help: showValidationErrors ? validationErrors.length > 1 ? <ul>
    {validationErrors.map(error => <li key={error}>{error}</li>)}
  </ul> : validationErrors.join(',') : undefined
});

export default class Contact extends React.Component {
  set = (key, value) => this.props.onChange({ ...new CONTACT({ ...this.props.contact }).get(), [key]: value });
  setType = type => this.set('type', type);
  setInfo = e => this.set('info', e.target.value);
  render = () => {
    const contact = new CONTACT({ ...this.props.contact });
    const contactData = contact.get();
    const contactTypes = contact.getTypes();
    const { type, info } = contactData;
    const contactType = contactTypes.filter(({ id }) => id === type)[0] || {};
    const validationErrors = contact.validate();
    return <Form.Item
      { ...formItemLayout }
      required
      hasFeedback
      { ...formValidation(this.props.showValidationErrors, [ ...(validationErrors.type || []), ...(validationErrors.info || []) ]) }
      children={
        <Input
          placeholder={contactType.placeholder}
          value={info}
          onChange={this.setInfo}
          addonBefore={<Select
            style={{ width: '120px' }}
            showSearch
            allowClear
            placeholder={'Eg: Phone'}
            optionFilterProp='children'
            filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
            value={type || undefined}
            onChange={this.setType}
          >
            {contactTypes.map(({ id, label }) => <Select.Option key={id} value={id} children={label}/>)}
          </Select>}
        />
      }
    />;
  }
}