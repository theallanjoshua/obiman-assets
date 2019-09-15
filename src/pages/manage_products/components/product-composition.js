import * as React from 'react';
import ProductCompositionEntity from './product-composition-entity';
import { Row, Col, Button } from 'antd';
import { Product } from 'obiman-data-models';

export default class ProductComposition extends React.Component {
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
  addEntity = () => this.props.onChange([ ...this.props.composition, new Product().get() ]);
  removeEntity = indexToRemove => this.props.onChange([ ...this.props.composition.filter((item, index) => index !== indexToRemove) ]);
  render = () => <React.Fragment>
    <Row gutter={8}>
      <Col span={11}>
        <label>Ingredient</label>
      </Col>
      <Col span={11}>
      <label>Quantity</label>
      </Col>
    </Row>
    {this.props.composition.map((entity, index) => {
      const usedIngredients = this.props.composition.filter(({ id }) => entity.id !== id).map(({ id }) => id);
      const availableIngredients = this.props.ingredients.filter(({ id }) => !usedIngredients.includes(id));
      return <Row key={index} gutter={8}>
        <Col span={22}>
          <ProductCompositionEntity
            showValidationErrors={this.props.showValidationErrors}
            ingredients={availableIngredients}
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