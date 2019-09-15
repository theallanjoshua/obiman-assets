import * as React from 'react';
import TaxCompositionEntity from './tax-composition-entity';
import { Row, Col, Button } from 'antd';
import { Tax } from 'obiman-data-models';

export default class TaxComposition extends React.Component {
  componentDidMount() {
    if(!this.props.tax.length) {
      this.addEntity();
    }
  }
  componentDidUpdate() {
    if(!this.props.tax.length) {
      this.addEntity();
    }
  }
  onChange = (incomingEntity, incomingIndex) => {
    const tax = this.props.tax.map((entity, index) => index === incomingIndex ? { ...incomingEntity } : { ...entity })
    this.props.onChange(tax);
  }
  addEntity = () => this.props.onChange([ ...this.props.tax, new Tax().get() ]);
  removeEntity = indexToRemove => this.props.onChange([ ...this.props.tax.filter((item, index) => index !== indexToRemove) ]);
  render = () => <React.Fragment>
    <Row gutter={8}>
      <Col span={11}>
        <label>Type</label>
      </Col>
      <Col span={11}>
      <label>Percentage</label>
      </Col>
    </Row>
    {this.props.tax.map((entity, index) => <Row key={index} gutter={8}>
      <Col span={22}>
        <TaxCompositionEntity
          showValidationErrors={this.props.showValidationErrors}
          entity={entity}
          onChange={entity => this.onChange(entity, index)}
        />
      </Col>
      <Col span={2}>
        {this.props.tax.length > 1 ? <Button
          icon='delete'
          type='danger'
          onClick={() => this.removeEntity(index)}
        /> : null }
      </Col>
    </Row>)}
    <Button
      icon='plus'
      children='Add'
      onClick={this.addEntity}
    />
  </React.Fragment>
};