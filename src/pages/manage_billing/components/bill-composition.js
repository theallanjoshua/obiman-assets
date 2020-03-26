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
  updateComposition = composition => {
    const updatedComposition = composition.reduce((acc, compositionEntity) => [
      ...acc,
      ...compositionEntity.quantity > 1 ? [
        ...new Array(compositionEntity.quantity)
      ].map(() => ({ ...compositionEntity, quantity: 1 })) : [{
        ...compositionEntity
      }]
    ], []);
    this.props.onChange(updatedComposition);
  }
  onChange = (incomingEntity, incomingIndex) => {
    const composition = this.props.composition.map((entity, index) => index === incomingIndex ? { ...incomingEntity } : { ...entity })
    this.updateComposition(composition);
  }
  addEntity = () => this.updateComposition([ ...this.props.composition, { id: '', quantity: 1 } ]);
  removeEntity = indexToRemove => this.updateComposition([ ...this.props.composition.filter((item, index) => index !== indexToRemove) ]);
  render = () => <React.Fragment>
    <Row gutter={8}>
      <Col span={22}>
        <Row gutter={8}>
          <Col span={4}>
            <label>Qty</label>
          </Col>
          <Col span={10}>
            <label>Product</label>
          </Col>
          <Col span={5}>
            <label>Price</label>
          </Col>
          <Col span={5}>
            <label>Amt</label>
          </Col>
        </Row>
      </Col>
    </Row>
    {this.props.composition.map((entity, index, array) => {
      const usedProducts = array.filter(({ id }) => entity.id !== id).map(({ id }) => id);
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
          {array.length > 1 ? <Button
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