import * as React from 'react';
import { Tabs, Spin } from 'antd';
import PageHeader from '../../components/page-header';
import PastBills from './components/past-bills';
import OpenBills from './components/open-bills';
import NewBill from './components/new-bill';

const { TabPane } = Tabs;

export default class Customer extends React.Component {
  componentDidMount = () => document.title = 'Customer - Obiman';
  render = () =>  <>
    <PageHeader title={'Your orders'} />
    <br />
    {this.props.email ? <Tabs defaultActiveKey={'present'}>
      <TabPane key={'past'} tab={'Past orders'}>
        <PastBills email={this.props.email} />
      </TabPane>
      <TabPane key={'present'} tab={'Ongoing orders'}>
        <OpenBills email={this.props.email} />
      </TabPane>
      <TabPane key={'future'} tab={'New order'}>
        <NewBill email={this.props.email} />
      </TabPane>
    </Tabs> : <Spin size='large' />}
  </>
};