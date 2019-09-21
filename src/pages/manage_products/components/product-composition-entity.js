import * as React from 'react';
import { Utils, ProductCompositionEntity as PCE } from 'obiman-data-models';
import { Row, Col, Select, InputNumber, Form } from 'antd';

const formItemLayout = {
  wrapperCol: { span: 24 }
};

const formValidation = (showValidationErrors, validationErrors = []) => ({
  validateStatus: showValidationErrors ? validationErrors.length ? 'error' : 'success' : '',
  help: showValidationErrors ? validationErrors.length > 1 ? <ul>
    {validationErrors.map(error => <li key={error}>{error}</li>)}
  </ul> : validationErrors.join(',') : undefined
});

export default class ProductCompositionEntity extends React.Component {
  set = params => this.props.onChange({ ...new PCE({ ...this.props.entity }).get(), ...params });
  setId = e => {
    const { key, label } = e || { key: '', label: '' };
    this.set({ id: key, label });
  };
  setQuantity = quantity => this.set({ quantity });
  setUnit = unit => this.set({ unit });
  render = () => {
    const productCompositionEntity = new PCE({ ...this.props.entity });
    const productCompositionEntityData = productCompositionEntity.get();
    const { id: pceId, quantity: pceQuantity, unit: pceUnit } = productCompositionEntityData;
    const validationErrors = productCompositionEntity.validate();
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
              placeholder={'Pick the ingredient'}
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
              value={pceId ? { key: pceId, value: pceId } : undefined}
              onChange={this.setId}
            >
              {this.props.ingredients.map(({ id, label }) => <Select.Option key={id} value={id} title={label} children={label}/>)}
            </Select>
          }
        />
      </Col>
      <Col span={12}>
        <Form.Item
          { ...formItemLayout }
          required
          { ...formValidation(this.props.showValidationErrors, [ ...(validationErrors.quantity || []), ...(validationErrors.unit || []) ]) }
          children={
            <div className='input-select-group'>
              <InputNumber
                min={0}
                parser={value => isNaN(value) ? 0 : value}
                value={pceQuantity}
                onChange={this.setQuantity}
              />
              <Select
                showSearch
                allowClear
                placeholder={'unit'}
                optionFilterProp='children'
                filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
                value={pceUnit}
                onChange={this.setUnit}
              >
                {new Utils()
                  .getUnits((this.props.ingredients.filter(({ id }) => id === pceId)[0] || {}).unit)
                  .map(unit => <Select.Option key={unit} value={unit} children={unit}/>)}
              </Select>
            </div>
          }
        />
      </Col>
    </Row>;
  }
}