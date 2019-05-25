import * as React from 'react';
import { Table } from 'antd';

export default class ManageProducts extends React.Component {
  render = () => {
    return <React.Fragment>
      <h1>Manage products</h1>
      <Table
        dataSource={[]}
        columns={[]}
      />
    </React.Fragment>;
  }
}