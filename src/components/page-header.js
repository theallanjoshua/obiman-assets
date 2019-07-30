import * as React from 'react';
import { Row, Col } from 'antd';

const PageHeader = ({ title, extra }) => <Row>
  <Col
    xs={{ span: 24 }}
    sm={{ span: 24 }}
    md={{ span: 24 }}
    lg={{ span: 12 }}
    xl={{ span: 12 }}
  >
    <h1>{title}</h1>
    </Col>
  <Col
    xs={{ span: 24 }}
    sm={{ span: 24 }}
    md={{ span: 24 }}
    lg={{ span: 12 }}
    xl={{ span: 12 }}
  >
    <div className='right-align'>
      {extra}
    </div>
  </Col>
</Row>;

export default PageHeader;