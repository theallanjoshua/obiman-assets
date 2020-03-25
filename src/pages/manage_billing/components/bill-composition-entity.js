import * as React from 'react';
import { BillCompositionEntity as BCE, Utils } from 'obiman-data-models';
import { Row, Col, Select, InputNumber, Form, Statistic } from 'antd';

const formItemLayout = {
  wrapperCol: { span: 24 }
};

const formValidation = (showValidationErrors, validationErrors = []) => ({
  validateStatus: showValidationErrors ? validationErrors.length ? 'error' : 'success' : '',
  help: showValidationErrors ? validationErrors.length > 1 ? <ul>
    {validationErrors.map(error => <li key={error}>{error}</li>)}
  </ul> : validationErrors.join(',') : undefined
});

export default class BillCompositionEntity extends React.Component {
  set = params => this.props.onChange({ ...this.props.entity, ...params });
  setId = e => {
    const { key, label } = e || { key: '', label: '' };
    this.set({ id: key, label });
  };
  setQuantity = quantity => this.set({ quantity: quantity || 1 });
  render = () => {
    const { id: bceId, quantity: bceQuantity = 1 } = this.props.entity;
    const validationErrors = new BCE({ ...this.props.entity }).validate();
    const selectedProduct = this.props.products.filter(({ id }) => id === bceId)[0] || { maxRepetition: 0, price: 0 };
    return <Row gutter={8}>
      <Col span={4}>
        <Form.Item
          { ...formItemLayout }
          required
          { ...formValidation(this.props.showValidationErrors, validationErrors.quantity) }
          children={
            <div className='input-select-group'>
              <InputNumber
                min={0}
                max={bceId ? selectedProduct.maxRepetition + bceQuantity : undefined}
                value={bceQuantity}
                onChange={this.setQuantity}
              />
            </div>
          }
        />
      </Col>
      <Col span={10}>
        <Form.Item
          { ...formItemLayout }
          required
          hasFeedback
          { ...formValidation(this.props.showValidationErrors, validationErrors.id) }
          children={
            <Select
              showSearch
              allowClear
              labelInValue
              filterOption
              placeholder={'Eg: Caesar salad'}
              optionFilterProp='children'
              value={bceId ? { key: bceId, value: bceId } : undefined}
              onChange={this.setId}
            >
              {Array.from(new Set(this.props.products.map(({ classification }) => classification))).map(classification => <Select.OptGroup
                key={classification}
                label={classification || 'Others'}
              >
                {this.props.products.filter(product => product.classification === classification).map(({ id, label, issues }) => <Select.Option
                  key={id}
                  value={id}
                  title={label}
                  children={label}
                  disabled={!!issues.length}
                />)}
              </Select.OptGroup>)}
            </Select>
          }
        />
      </Col>
      <Col span={5}>
        <Form.Item
          { ...formItemLayout }
          children={<Statistic
            precision={2}
            prefix={new Utils().getCurrencySymbol(this.props.currency)}
            value={selectedProduct.price}
            valueStyle={{ fontSize: 'initial' }}
          />}
        />
      </Col>
      <Col span={5}>
        <Form.Item
          { ...formItemLayout }
          children={<Statistic
            precision={2}
            prefix={new Utils().getCurrencySymbol(this.props.currency)}
            value={selectedProduct.price * bceQuantity}
            valueStyle={{ fontSize: 'initial' }}
          />}
        />
      </Col>
    </Row>;
  }
}