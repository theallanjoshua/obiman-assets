import * as React from 'react';
import Employee from './employee';
import { Row, Col, Button } from 'antd';

export default class Employees extends React.Component {
  onChange = (incomingEmployee, incomingIndex) => {
    const employees = this.props.employees.map((employee, index) => index === incomingIndex ? { ...incomingEmployee } : { ...employee })
    this.props.onChange(employees);
  }
  addEmployee = (id = '', permissions = []) => this.props.onChange([ ...this.props.employees, { id, permissions } ]);
  removeEmployee = indexToRemove => this.props.onChange([ ...this.props.employees.filter((item, index) => index !== indexToRemove) ]);
  render = () => <React.Fragment>
    <Row gutter={8}>
      <Col span={11}>
        <label>Email</label>
      </Col>
      <Col span={11}>
      <label>Permissions</label>
      </Col>
    </Row>
    {this.props.employees.map((employee, index) => <Row key={index} gutter={8}>
        <Col span={22}>
          <Employee
            showValidationErrors={this.props.showValidationErrors}
            employee={employee}
            onChange={employee => this.onChange(employee, index)}
          />
        </Col>
        <Col span={2}>
          {this.props.employees.length > 1 ? <Button
            icon='delete'
            type='danger'
            onClick={() => this.removeEmployee(index)}
          /> : null }
        </Col>
      </Row>)}
    <Button
      icon='plus'
      children='Add'
      onClick={() => this.addEmployee()}
    />
  </React.Fragment>
};