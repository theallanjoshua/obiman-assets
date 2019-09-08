import * as React from 'react';
import BillCompositionEntity from './bill-composition-entity';
import { Row, Col, Button } from 'antd';

export default class BillComposition extends React.Component {
  componentDidMount() {
    if(!this.props.composition.length) {
      this.addEntity();
    }
  }
  componentDidUpdate() {
    if(!this.props.composition.length) {
      this.addEntity();
    }
  }
  onChange = (incomingEntity, incomingIndex) => {
    const composition = this.props.composition.map((entity, index) => index === incomingIndex ? { ...incomingEntity } : { ...entity })
    this.props.onChange(composition);
  }
  addEntity = () => this.props.onChange([ ...this.props.composition, { id: '', quantity: '' } ]);
  removeEntity = indexToRemove => this.props.onChange([ ...this.props.composition.filter((item, index) => index !== indexToRemove) ]);
  render = () => <React.Fragment>
    <Row gutter={8}>
      <Col span={11}>
        <label>Product</label>
      </Col>
      <Col span={6}>
        <label>Quantity</label>
      </Col>
      <Col span={5}>
        <label>Price</label>
      </Col>
    </Row>
    {this.props.composition.map((entity, index) => {
      const usedProducts = this.props.composition.filter(({ id }) => entity.id !== id).map(({ id }) => id);
      const availableProducts = this.props.products.filter(({ id }) => !usedProducts.includes(id));
      return <Row key={index} gutter={8}>
        <Col span={22}>
          <BillCompositionEntity
            currency={this.props.currency}
            showValidationErrors={this.props.showValidationErrors}
            products={availableProducts}
            entity={entity}
            onChange={entity => this.onChange(entity, index)}
          />
        </Col>
        <Col span={2}>
          {this.props.composition.length > 1 ? <Button
            icon='delete'
            type='danger'
            onClick={() => this.removeEntity(index)}
          /> : null }
        </Col>
      </Row>
    })}
    <Button
      icon='plus'
      children='Add'
      onClick={this.addEntity}
    />
  </React.Fragment>
};