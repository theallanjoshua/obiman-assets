import * as React from 'react';
import { Employee as EMPLOYEE, Business } from 'obiman-data-models';
import { Row, Col, Select, Form, Input } from 'antd';

const formItemLayout = {
  wrapperCol: { span: 24 }
};

const formValidation = (showValidationErrors, validationErrors = []) => ({
  validateStatus: showValidationErrors ? validationErrors.length ? 'error' : 'success' : '',
  help: showValidationErrors ? validationErrors.length > 1 ? <ul>
    {validationErrors.map(error => <li key={error}>{error}</li>)}
  </ul> : validationErrors.join(',') : undefined
});

export default class Employee extends React.Component {
  set = (key, value) => this.props.onChange({ ...new EMPLOYEE({ ...this.props.employee }).get(), [key]: value });
  setId = e => this.set('id', e.target.value);
  setPermissions = permissions => this.set('permissions', permissions);
  render = () => {
    const employee = new EMPLOYEE({ ...this.props.employee });
    const employeeData = employee.get();
    const { id, permissions } = employeeData;
    const validationErrors = employee.validate();
    return <Row gutter={8}>
      <Col span={12}>
        <Form.Item
          { ...formItemLayout }
          required
          hasFeedback
          { ...formValidation(this.props.showValidationErrors, validationErrors.id) }
          children={
            <Input
              placeholder={'Enter the email address of the employee'}
              value={id}
              onChange={this.setId}
            />
          }
        />
      </Col>
      <Col span={12}>
        <Form.Item
          { ...formItemLayout }
          required
          { ...formValidation(this.props.showValidationErrors, validationErrors.permissions) }
          children={
            <Select
              mode='multiple'
              placeholder={'Provide permission to the employee'}
              value={permissions}
              onChange={this.setPermissions}
            >
              {new Business()
                .getAllPermissions()
                .map(permission => <Select.Option key={permission} value={permission} children={permission}/>)}
            </Select>
          }
        />
      </Col>
    </Row>;
  }
}