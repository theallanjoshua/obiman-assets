import * as React from 'react';
import { Tabs, Spin, Icon } from 'antd';
import PageHeader from '../../components/page-header';
import PastBills from './components/past-bills';
import OpenBills from './components/open-bills';
import NewBill from './components/new-bill';
import { Consumer } from '../../context';

const { TabPane } = Tabs;

const CustomerComponent = ({ email }) =>  <>
  <PageHeader title={'Your orders'} />
  <br />
  {email ? <Tabs defaultActiveKey={'present'}>
    <TabPane key={'present'} tab={<span>
      <Icon type='file-sync' />
      Ongoing orders
    </span>}>
      <OpenBills email={email} />
    </TabPane>
    <TabPane key={'future'} tab={<span>
      <Icon type='scan' />
      New order
    </span>}>
      <NewBill email={email} />
    </TabPane>
    <TabPane key={'past'} tab={<span>
      <Icon type='history' />
      Past orders
    </span>}>
      <PastBills email={email} />
    </TabPane>
  </Tabs> : <Spin size='large' />}
</>;

export default class Customer extends React.Component {
  componentDidMount = () => document.title = 'Customer - Obiman';
  render = () => <Consumer>
    {({ email }) => <CustomerComponent email={email} />}
  </Consumer>
}