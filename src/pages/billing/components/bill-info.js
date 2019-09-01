import * as React from 'react';
import { Form, Input, Statistic } from 'antd';
import { Bill, BillCompositionEntity } from 'obiman-data-models';
import BillComposition from './bill-composition';

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
  render = () => {
    const bill = new Bill({ ...this.props.bill });
    const billData = bill.get();
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
            placeholder={'Enter a name for the bill'}
            value={billData.label}
            onChange={this.setLabel}
          />
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Items'}
        required
        children={
          <BillComposition
            showValidationErrors={this.props.showValidationErrors}
            products={this.props.products}
            composition={billData.composition}
            onChange={this.setComposition}
          />
        }
      />
      <Form.Item
        { ...formItemLayout }
        label={'Total'}
        children={<Statistic
          value={billData.composition.reduce((acc, { id, quantity }) => {
            const { price } = this.props.products.filter(({ id: productId }) => id === productId)[0] || { price: 0 };
            return acc + (price * quantity);
          }, 0)}
        />}
      />
    </Form>
  };
}