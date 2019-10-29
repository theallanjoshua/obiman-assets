import * as React from 'react';
import { Form, Input, Select, Row, Col } from 'antd';
import { Bill, BillCompositionEntity } from 'obiman-data-models';
import BillComposition from './bill-composition';
import BillTotal from './bill-total';

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

const billTotalLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 19, offset: 4 }
}
const formValidation = (showValidationErrors, validationErrors = []) => ({
  validateStatus: showValidationErrors ? validationErrors.length ? 'error' : 'success' : '',
  help: showValidationErrors ? validationErrors.length > 1 ? <ul>
    {validationErrors.map(error => <li key={error}>{error}</li>)}
  </ul> : validationErrors.join(',') : undefined
})

export default class BillInfo extends React.Component {
  set = (key, value) => this.props.onChange({ ...new Bill({ ...this.props.bill }).get(), [key]: value });
  setLabel = e => this.set('label', e.target.value);
  setComposition = composition => this.set('composition', composition.map(item => new BillCompositionEntity(item).get()));
  setCustomer = e => this.set('customer', e.target.value);
  setStatus = status => this.set('status', status);
  render = () => {
    const bill = new Bill({ ...this.props.bill });
    const billData = bill
      .enrich(this.props.products)
      .get();
    const validationErrors = bill.validate();
    return <Form>
      <Form.Item
        { ...formItemLayout }
        label={'Name'}
        required
        hasFeedback
        { ...formValidation(this.props.showValidationErrors, validationErrors.label) }
        children={
          <Input
            placeholder={'Eg: Table 1'}
            value={billData.label}
            onChange={this.setLabel}
          />
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Customer info'}
        children={
          <Input
            placeholder={'Eg: +91-9876543210 or someone@email.com'}
            value={billData.customer}
            onChange={this.setCustomer}
          />
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Items'}
        required
        children={
          <BillComposition
            currency={this.props.currency}
            showValidationErrors={this.props.showValidationErrors}
            products={this.props.products}
            composition={billData.composition}
            onChange={this.setComposition}
          />
        }
      />
      <Row>
        <Col { ...billTotalLayout }>
        <BillTotal
          bill={billData}
          currency={this.props.currency}
        />
        </Col>
      </Row>
      <Form.Item
        { ...formItemLayout }
        label={'Status'}
        required
        hasFeedback
        { ...formValidation(this.props.showValidationErrors, validationErrors.status) }
        children={
          <Select
            showSearch
            allowClear
            filterOption
            placeholder={'Eg: Open'}
            optionFilterProp='children'
            value={billData.status || undefined}
            onChange={this.setStatus}
          >
            {[ bill.getStartState(), ...bill.getOtherStates(), bill.getEndState() ].map(state => <Select.Option key={state} value={state} children={state}/>)}
          </Select>
        }
      />
    </Form>
  };
}