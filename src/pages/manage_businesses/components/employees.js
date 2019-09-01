import * as React from 'react';
import Employee from './employee';
import { Business } from 'obiman-data-models';
import { Row, Col, Button } from 'antd';

const sudoRoleText = new Business().getSudoRoleText();

export default class Employees extends React.Component {
  componentDidMount() {
    if(!this.props.employees.length) {
      this.addEmployee(this.props.currentUser, [sudoRoleText]);
    }
  }
  componentDidUpdate() {
    if(!this.props.employees.length) {
      this.addEmployee(this.props.currentUser, [sudoRoleText]);
    }
  }
  onChange = (incomingEmployee, incomingIndex) => {
    const employees = this.props.employees.map((employee, index) => index === incomingIndex ? { ...incomingEmployee } : { ...employee })
    this.props.onChange(employees);
  }
  addEmployee = (id = '', roles = []) => this.props.onChange([ ...this.props.employees, { id, roles } ]);
  removeEmployee = indexToRemove => this.props.onChange([ ...this.props.employees.filter((item, index) => index !== indexToRemove) ]);
  render = () => <React.Fragment>
    <Row gutter={8}>
      <Col span={11}>
        <label>Employee email</label>
      </Col>
      <Col span={11}>
      <label>Role</label>
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