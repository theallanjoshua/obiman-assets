import * as React from 'react';
import { Row, Col, Button, Input } from 'antd';

export default class StringArrayEditor extends React.Component {
  onChange = (incomingItem, incomingIndex) => {
    const items = this.props.items.map((item, index) => index === incomingIndex ? incomingItem : item)
    this.props.onChange(items);
  }
  addItem = (item = '') => this.props.onChange([ ...this.props.items, item ]);
  removeItem = indexToRemove => this.props.onChange([ ...this.props.items.filter((item, index) => index !== indexToRemove) ]);
  render = () => <>
    {this.props.items.map((item, index) => <Row key={index} gutter={8}>
        <Col span={22}>
          <Input
            placeholder={this.props.placeholder}
            value={item}
            onChange={e => this.onChange(e.target.value, index)}
          />
        </Col>
        <Col span={2}>
          <Button
            icon='delete'
            type='danger'
            onClick={() => this.removeItem(index)}
          />
        </Col>
      </Row>)}
    <Button
      icon='plus'
      children='Add'
      onClick={() => this.addItem()}
    />
  </>
};