import * as React from 'react';
import { Tax } from 'obiman-data-models';
import { Row, Col, Input, InputNumber, Form } from 'antd';

const formItemLayout = {
  wrapperCol: { span: 24 }
};

const formValidation = (showValidationErrors, validationErrors = []) => ({
  validateStatus: showValidationErrors ? validationErrors.length ? 'error' : 'success' : '',
  help: showValidationErrors ? validationErrors.length > 1 ? <ul>
    {validationErrors.map(error => <li key={error}>{error}</li>)}
  </ul> : validationErrors.join(',') : undefined
});

export default class TaxCompositionEntity extends React.Component {
  set = (key, value) => this.props.onChange({ ...new Tax({ ...this.props.entity }).get(), [key]: value });
  setType = e => this.set('type', e.target.value);
  setPercentage = percentage => this.set('percentage', percentage);
  render = () => {
    const tax = new Tax({ ...this.props.entity });
    const taxData = tax.get();
    const { type, percentage } = taxData;
    const validationErrors = tax.validate();
    return <Row gutter={8}>
      <Col span={12}>
        <Form.Item
          { ...formItemLayout }
          required
          hasFeedback
          { ...formValidation(this.props.showValidationErrors, validationErrors.type) }
          children={
            <Input
              placeholder={'Eg: VAT'}
              value={type}
              onChange={this.setType}
            />
          }
        />
      </Col>
      <Col span={12}>
        <Form.Item
          { ...formItemLayout }
          required
          { ...formValidation(this.props.showValidationErrors, validationErrors.percentage) }
          children={
            <InputNumber
              min={0}
              max={100}
              value={percentage}
              formatter={value => `${value}%`}
              parser={value => {
                const parsedValue = Number(value.replace('%', '').trim());
                return isNaN(parsedValue) ? 0 : parsedValue;
              }}
              onChange={this.setPercentage}
            />
          }
        />
      </Col>
    </Row>;
  }
}