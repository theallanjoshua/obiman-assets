import * as React from 'react';
import { Utils } from 'obiman-data-models';
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
  onChange = (key, value) => {
    const { entity } = this.props;
    this.props.onChange({ ...entity, [key]: value });
  }
  onIngredientChange = ingredient => this.onChange('ingredient', ingredient)
  onQuantityChange = quantity => this.onChange('quantity', quantity)
  onUnitChange = unit => this.onChange('unit', unit)
  render = () => <Row gutter={8}>
    <Col span={12}>
      <Form.Item
        { ...formItemLayout }
        required
        hasFeedback
        { ...formValidation(this.props.showValidationErrors, this.props.validationErrors.ingredient) }
        children={
          <Select
            showSearch
            allowClear
            placeholder={'Pick the ingredient'}
            optionFilterProp='children'
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            defaultValue={this.props.entity.label}
            value={this.props.entity.label}
            onChange={this.onIngredientChange}
          >
            {this.props.ingredients.map(({ id, label }) => <Select.Option key={id} value={id} children={label}/>)}
          </Select>
        }
      />
    </Col>
    <Col span={12}>
      <Form.Item
        { ...formItemLayout }
        required
        { ...formValidation(this.props.showValidationErrors, [ ...(this.props.validationErrors.quantity || []), ...(this.props.validationErrors.unit || []) ]) }
        children={
          <div className='input-select-group'>
            <InputNumber
              min={0}
              value={this.props.entity.quantity}
              onChange={this.onQuantityChange}
            />
            <Select
              showSearch
              allowClear
              placeholder={'unit'}
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              defaultValue={this.props.entity.unit || undefined}
              onChange={this.onUnitChange}
            >
              {new Utils().getUnits().map(unit => <Select.Option key={unit} value={unit} children={unit}/>)}
            </Select>
          </div>
        }
      />
    </Col>
  </Row>
}