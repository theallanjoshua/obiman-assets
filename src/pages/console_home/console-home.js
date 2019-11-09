import * as React from 'react';
import { Tabs, DatePicker, Empty } from 'antd';
import Page from '../../components/page';
import { Consumer } from '../../context';
import { DASHBOARDS } from '../../constants/console-home';
import BillsDashboard from './components/bills-dashboard';
import ProductsDashboard from './components/products-dashboard';
import { DATE_FORMAT } from '../../constants/app';
import moment from 'moment';

const { TabPane } = Tabs;

class ConsoleHomeComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      activeKey: 'bills',
      customStartRange: moment().subtract(1, 'weeks').startOf('week'),
      customEndRange: moment().subtract(1, 'weeks').endOf('week')
    };
  }
  onTabChange = activeKey => this.setState({ activeKey });
  onCustomStartRangeChange = customStartRange => this.setState({ customStartRange: customStartRange.startOf('day') });
  onCustomEndRangeChange = customEndRange => this.setState({ customEndRange: customEndRange.endOf('day')  });
  render = () => <Page>
    <Tabs
      activeKey={this.state.activeKey}
      onChange={this.onTabChange}
    >
      <TabPane tab='Bills' key='bills'>
        {DASHBOARDS.map(dashboard => <BillsDashboard
          key={dashboard.title}
          title={dashboard.title}
          query={dashboard.query}
          empty={dashboard.emptyBills}
          showTrend={dashboard.showTrend}
          businessId={this.props.businessId}
          currency={this.props.currency}
          sources={this.props.sources}
        />)}
        <BillsDashboard
          title={<div className='flex-wrap'>
            <DatePicker
              showTime
              value={this.state.customStartRange}
              format={DATE_FORMAT}
              onChange={this.onCustomStartRangeChange}
            />
            <span style={{ padding: '0px 10px' }}>to: </span>
            <DatePicker
              showTime
              value={this.state.customEndRange}
              format={DATE_FORMAT}
              onChange={this.onCustomEndRangeChange}
            />
          </div>}
          query={this.state.customStartRange && this.state.customEndRange ? `updatedDateFrom=${this.state.customStartRange.valueOf()}&updatedDateTo=${this.state.customStartRange.valueOf()}` : ''}
          empty={!this.state.customStartRange || !this.state.customEndRange ? 'Select a time period to see your data' : <Empty description={'No bills closed in this time period!'} /> }
          businessId={this.props.businessId}
          currency={this.props.currency}
          sources={this.props.sources}
        />
      </TabPane>
      <TabPane tab='Products' key='products'>
        {DASHBOARDS.map(dashboard => <ProductsDashboard
          key={dashboard.title}
          title={dashboard.title}
          query={dashboard.query}
          empty={dashboard.emptyProducts}
          businessId={this.props.businessId}
          currency={this.props.currency}
          sources={this.props.sources}
        />)}
        <ProductsDashboard
          title={<div className='flex-wrap'>
            <DatePicker
              showTime
              value={this.state.customStartRange}
              format={DATE_FORMAT}
              onChange={this.onCustomStartRangeChange}
            />
            <span style={{ padding: '0px 10px' }}>to: </span>
            <DatePicker
              showTime
              value={this.state.customEndRange}
              format={DATE_FORMAT}
              onChange={this.onCustomEndRangeChange}
            />
          </div>}
          query={this.state.customStartRange && this.state.customEndRange ? `updatedDateFrom=${this.state.customStartRange.valueOf()}&updatedDateTo=${this.state.customStartRange.valueOf()}` : ''}
          empty={!this.state.customStartRange || !this.state.customEndRange ? 'Select a time period to see your data' : <Empty description={'No products sold in this time period!'} /> }
          businessId={this.props.businessId}
          currency={this.props.currency}
          sources={this.props.sources}
        />
      </TabPane>
    </Tabs>
  </Page>
}

export default class ConsoleHome extends React.Component {
  componentDidMount = () => document.title = 'Home - Obiman';
  render = () => <Consumer>
    {({ currentBusiness }) => <ConsoleHomeComponent
      businessId={currentBusiness.id}
      currency={currentBusiness.currency}
      sources={currentBusiness.metadata.sources || []}
    />}
  </Consumer>
}