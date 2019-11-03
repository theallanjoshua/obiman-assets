import * as React from 'react';
import { Tax } from 'obiman-data-models';
import { Row, Col, Input, InputNumber, Form, Select } from 'antd';

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
  setType = type => this.set('type', type);
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
            <Select
              showSearch
              allowClear
              filterOption
              placeholder={'Eg: VAT'}
              optionFilterProp='children'
              value={type || undefined}
              onChange={this.setType}
            >
              {this.props.taxes.map(taxType => <Select.Option key={taxType} value={taxType} children={taxType}/>)}
            </Select>
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
              precision={2}
              value={percentage}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '').trim()}
              onChange={this.setPercentage}
            />
          }
        />
      </Col>
    </Row>;
  }
}