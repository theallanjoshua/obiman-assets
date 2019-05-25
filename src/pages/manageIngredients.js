import * as React from 'react';
import { Table } from 'antd';

export default class ManageIngredients extends React.Component {
  render = () => {
    return <React.Fragment>
      <h1>Manage ingredients</h1>
      <Table
        dataSource={[]}
        columns={[]}
      />
    </React.Fragment>;
  }
}