import * as React from 'react';
import AllProducts from './components/all-products';
import { PageHeader, Button } from 'antd';
export default class ManageProducts extends React.Component {
  render = () => <React.Fragment>
    <PageHeader
      title='Manage products'
      extra={ <Button
        type='primary'
        onClick={() => {}}
        children='Add'
      />}
    />
    <AllProducts />
  </React.Fragment>;
}