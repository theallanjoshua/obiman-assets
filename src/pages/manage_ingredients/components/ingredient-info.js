import * as React from 'react';
import { Form, Input, InputNumber, Select, Row, Col, DatePicker } from 'antd';
import { Ingredient } from 'obiman-data-models';
import moment from 'moment';

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 12 }
}

export default class IngredientInfo extends React.Component {
  constructor(props) {
    super(props);
    const { ingredient } = { ...props };
    const { id, label, quantity, unit, cost, currency, thresholdQuantity, thresholdUnit, expiryDate, createdDate, version } = { ...ingredient };
    this.state = {
      id: id || '',
      label: label || '',
      quantity: quantity || 0,
      unit: unit || '',
      cost: cost || 0,
      currency: currency || '',
      thresholdQuantity: thresholdQuantity || 0,
      thresholdUnit: thresholdUnit || '',
      expiryDate: expiryDate || 0,
      createdDate: createdDate || 0,
      version: version || 0,
    };
  }

  set = (key, value) => this.setState({ [key]: value }, () => this.props.onChange({ ...this.state }));
  setLabel = e => this.set('label', e.target.value);
  setQuantity = quantity => this.set('quantity', quantity);
  setUnit = unit => this.set('unit', unit);
  setCost = cost => this.set('cost', cost);
  setCurrency = currency => this.set('currency', currency);
  setThresholdQuantity = thresholdQuantity => this.set('thresholdQuantity', thresholdQuantity);
  setThresholdUnit = thresholdUnit => this.set('thresholdUnit', thresholdUnit);
  setExpiryDate = (expiryDate, expiryDateString) => this.set('expiryDate', expiryDateString ? new Date(expiryDateString).getTime() : 0);
  setCreatedDate = createdDate => this.set('createdDate', createdDate);
  setVersion = version => this.set('version', version);

  render = () => {
    const ingredient = new Ingredient({ ...this.state });
    const validationErrors = ingredient.validate();
    return <Form>
      <Form.Item
        { ...formItemLayout }
        label={'Name of the ingredient'}
        required={true}
        validateStatus={this.props.showValidationErrors && validationErrors.label ? 'error' : 'success'}
        help={this.props.showValidationErrors && validationErrors.label ? <ul>
          {validationErrors.label.map((error, index) => <li key={error}>{error}</li>)}
        </ul> : undefined}
        children={
          <Input
            placeholder={'Enter a name for the ingredient'}
            allowClear
            value={this.state.label}
            onChange={this.setLabel}
          />
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Quantity available'}
        children={
          <Row>
            <Col span={12}>
              <InputNumber
                min={0}
                value={this.state.quantity}
                onChange={this.setQuantity}
              />
            </Col>
            <Col span={12}>
            <Select
              showSearch
              allowClear
              placeholder={'unit'}
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              value={this.state.unit || undefined}
              onSelect={this.setUnit}
            >
              {ingredient.getUnits().map(unit => <Select.Option key={unit} value={unit} children={unit}/>)}
            </Select>
            </Col>
          </Row>
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Cost per unit of quantity'}
        children={
          <Row>
            <Col span={12}>
              <InputNumber
                min={0}
                value={this.state.cost}
                onChange={this.setCost}
              />
            </Col>
            <Col span={12}>
            <Select
              showSearch
              allowClear
              placeholder={'currency'}
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              value={this.state.currency || undefined}
              onSelect={this.setCurrency}
            >
              {ingredient.getCurrencyCodes().map(currency => <Select.Option key={currency} value={currency} children={currency}/>)}
            </Select>
            </Col>
          </Row>
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Threshold'}
        children={
          <Row>
            <Col span={12}>
              <InputNumber
                min={0}
                value={this.state.thresholdQuantity}
                onChange={this.setThresholdQuantity}
              />
            </Col>
            <Col span={12}>
            <Select
              showSearch
              allowClear
              placeholder={'unit'}
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              value={this.state.thresholdUnit || undefined}
              onSelect={this.setThresholdUnit}
            >
              {ingredient.getUnits().map(unit => <Select.Option key={unit} value={unit} children={unit}/>)}
            </Select>
            </Col>
          </Row>
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Expiry date'}
        children={
          <DatePicker
            showTime
            value={this.state.expiryDate ? moment(this.state.expiryDate) : undefined}
            onChange={this.setExpiryDate}
          />
        }
      />
    </Form>
  };
}