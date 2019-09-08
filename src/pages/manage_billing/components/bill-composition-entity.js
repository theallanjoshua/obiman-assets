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
  set = params => this.props.onChange({ ...new BCE({ ...this.props.entity }).get(), ...params });
  setId = e => {
    const { key, label } = e || { key: '', label: '' };
    this.set({ id: key, label });
  };
  setQuantity = quantity => this.set({ quantity });
  render = () => {
    const billCompositionEntity = new BCE({ ...this.props.entity });
    const billCompositionEntityData = billCompositionEntity.get();
    const { id: bceId, quantity: bceQuantity } = billCompositionEntityData;
    const validationErrors = billCompositionEntity.validate();
    const selectedProduct = this.props.products.filter(({ id }) => id === bceId)[0] || { maxRepetition: 0, price: 0 };
    return <Row gutter={8}>
      <Col span={12}>
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
              placeholder={'Pick the product'}
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
              value={bceId ? { key: bceId, value: bceId } : undefined}
              onChange={this.setId}
            >
              {this.props.products.map(({ id, label }) => <Select.Option key={id} value={id} title={label} children={label}/>)}
            </Select>
          }
        />
      </Col>
      <Col span={7}>
        <Form.Item
          { ...formItemLayout }
          required
          { ...formValidation(this.props.showValidationErrors, validationErrors.quantity) }
          children={
            <div className='input-select-group'>
              <InputNumber
                min={0}
                max={bceId ? selectedProduct.maxRepetition + bceQuantity : undefined}
                parser={value => isNaN(value) ? 0 : value}
                value={bceQuantity}
                onChange={this.setQuantity}
              />
            </div>
          }
        />
      </Col>
      <Col span={5}>
        <Form.Item
          { ...formItemLayout }
          children={<Statistic
            prefix={new Utils().getCurrencySymbol(this.props.currency)}
            value={selectedProduct.price * (bceQuantity || 0)}
          />}
        />
      </Col>
    </Row>;
  }
}