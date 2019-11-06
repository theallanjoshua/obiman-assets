import * as React from 'react';
import Page from '../../components/page';
import 'chart.piecelabel.js';
import { Consumer } from '../../context';
import { Row, Col, Card, Descriptions, Typography } from 'antd';
import moment from 'moment';
import Network from '../../utils/network';
import { BILLS_API_URL } from '../../constants/endpoints';
import { DASHBOARDS } from '../../constants/dashboard';
import SourcePieChart from './components/source-pie-chart';
import WeeklyTrendChart from './components/weekly-trend-chart';
import BarChart from './components/bar-chart';
import { Utils } from 'obiman-data-models';

const { Title } = Typography;
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

class DashboardComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      bills: []
    }
  }
  componentDidMount = () => {
    const { businessId } = this.props;
    if(businessId) {
      this.fetchAllBills(businessId)
    }
  };
  componentDidUpdate = prevProps => {
    const { businessId } = this.props;
    if(prevProps.businessId !== businessId && businessId) {
      this.fetchAllBills(businessId)
    }
  };
  fetchAllBills = async businessId => {
    this.setState({ loading: true, errorMessage: '' });
    try {
      const { bills } = await Network.get(BILLS_API_URL(businessId, `status=Closed&updatedDateFrom=${moment().subtract(1, 'weeks').startOf('week').valueOf()}`));
      this.setState({ bills });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  render = () => <Page>
    {DASHBOARDS.map(dashboard => {
      const bills = dashboard.getBills(this.state.bills);
      const totalCount = bills.length;
      const totalSalesData = bills.reduce((acc, { total }) => acc + total, 0);
      const totalProfitData = bills.reduce((acc, { profit }) => acc + profit, 0);
      const sourceWiseTotalCount = this.props.sources.map(source => bills
        .filter(bill => bill.source === source).length);
      const sourceWiseSalesData = this.props.sources.map(source => bills
        .filter(bill => bill.source === source)
        .reduce((acc, { total }) => acc + total, 0));
      const sourceWiseProfitData = this.props.sources.map(source => bills
        .filter(bill => bill.source === source)
        .reduce((acc, { profit }) => acc + profit, 0));
      const totalCountTrendData = daysOfWeek.map(day => bills
        .filter(({ updatedDate }) => moment(updatedDate).format('dddd') === day).length);
      const totalSalesTrendData = daysOfWeek.map(day => bills
        .filter(({ updatedDate }) => moment(updatedDate).format('dddd') === day)
        .reduce((acc, { total }) => acc + total, 0));
      const totalProfitTrendData = daysOfWeek.map(day => bills
        .filter(({ updatedDate }) => moment(updatedDate).format('dddd') === day)
        .reduce((acc, { profit }) => acc + profit, 0));
      const sourceWiseTotalCountTrendData = this.props.sources.map(source => ({
        data:daysOfWeek.map(day => bills.filter(bill => moment(bill.updatedDate).format('dddd') === day && bill.source === source).length),
        label: source
      }));
      const sourceWiseSalesTrendData = this.props.sources.map(source => ({
        data:daysOfWeek.map(day => bills
          .filter(bill => moment(bill.updatedDate).format('dddd') === day && bill.source === source)
          .reduce((acc, { total }) => acc + total, 0)),
        label: source
      }));
      const sourceWiseProfitTrendData = this.props.sources.map(source => ({
        data:daysOfWeek.map(day => bills.
          filter(bill => moment(bill.updatedDate).format('dddd') === day && bill.source === source)
          .reduce((acc, { total }) => acc + total, 0)),
        label: source
      }));
      const totalComposition = bills.reduce((acc, bill) => {
        const { composition } = bill;
        return [ ...acc, ...composition ]
      }, []);
      const uniqueProducts = Array.from(new Set(totalComposition.map(({ label }) => label)));
      const productData = uniqueProducts.map(uniqueProduct => {
        const data = totalComposition
          .filter(({ label }) => label === uniqueProduct)
          .reduce((acc, composition) => {
            const count = acc.count + composition.quantity;
            const sales = acc.sales + (composition.price * composition.quantity);
            const profit = acc.profit + (composition.profit * composition.quantity);
            return { count, sales, profit }
          }, {
            count: 0,
            sales: 0,
            profit: 0
          })
        return {
          label: uniqueProduct,
          ...data
        }
      });
      const mostOrderedProducts = productData
        .sort((prv, nxt) => nxt.count - prv.count)
        .filter((item, index) => index < 7);
      const mostSoldProducts = productData
        .sort((prv, nxt) => nxt.count - prv.count)
        .filter((item, index) => index < 7)
      const mostProfitableProducts = productData
        .sort((prv, nxt) => nxt.count - prv.count)
        .filter((item, index) => index < 7)
      return <Card
        key={dashboard.title}
        title={dashboard.title}
        loading={this.state.loading}
        style={{ marginBottom: '30px' }}
      >
        {bills.length ? <div>
          <Row gutter={8}>
            <Col span={8}>
              <Descriptions bordered column={1} size='small'>
                <Descriptions.Item label='Total bills'>{totalCount}</Descriptions.Item>
                <Descriptions.Item label='Total sales'>{`${new Utils().getCurrencySymbol(this.props.currency)}${totalSalesData}`}</Descriptions.Item>
                <Descriptions.Item label='Total profit'>{`${new Utils().getCurrencySymbol(this.props.currency)}${totalProfitData}`}</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
          <br />
          <Row gutter={8}>
            <Col span={8}>
              <SourcePieChart
                title={'Bill count'}
                sources={this.props.sources}
                data={sourceWiseTotalCount}
              />
            </Col>
            <Col span={8}>
              <SourcePieChart
                title={'Sales'}
                currency={this.props.currency}
                sources={this.props.sources}
                data={sourceWiseSalesData}
              />
            </Col>
            <Col span={8}>
              <SourcePieChart
                title={'Profit'}
                currency={this.props.currency}
                sources={this.props.sources}
                data={sourceWiseProfitData}
              />
            </Col>
          </Row>
          {dashboard.showTrend ? <div>
            <br />
            <Title level={4}>Trend</Title>
            <Row gutter={8}>
              <Col span={8}>
                <WeeklyTrendChart
                  title={'Bill count'}
                  daysOfWeek={daysOfWeek}
                  data={sourceWiseTotalCountTrendData}
                  isPastel
                />
              </Col>
              <Col span={8}>
                <WeeklyTrendChart
                  title={'Sales'}
                  currency={this.props.currency}
                  daysOfWeek={daysOfWeek}
                  data={sourceWiseSalesTrendData}
                  isPastel
                />
              </Col>
              <Col span={8}>
                <WeeklyTrendChart
                  title={'Profit'}
                  currency={this.props.currency}
                  daysOfWeek={daysOfWeek}
                  data={sourceWiseProfitTrendData}
                  isPastel
                />
              </Col>
            </Row>
            <br />
            <Row gutter={8}>
              <Col span={12}>
                <WeeklyTrendChart
                  title={'Total bill count'}
                  daysOfWeek={daysOfWeek}
                  data={[{
                    data: totalCountTrendData,
                    label: 'Count'
                  }]}
                />
              </Col>
              <Col span={12}>
                <WeeklyTrendChart
                  title={'Total sales & profit'}
                  currency={this.props.currency}
                  daysOfWeek={daysOfWeek}
                  data={[{
                    data: totalSalesTrendData,
                    label: 'Sales'
                  },{
                    data: totalProfitTrendData,
                    label: 'Profit'
                  }]}
                />
              </Col>
            </Row>
          </div> : null}
          <br />
          <Row gutter={8}>
            <Col span={8}>
              <BarChart
                title={'Top selling products'}
                labels={mostOrderedProducts.map(({ label }) => label)}
                data={mostOrderedProducts.map(({ count }) => count)}
              />
            </Col>
            <Col span={8}>
              <BarChart
                title={'Top revenue generating products'}
                currency={this.props.currency}
                labels={mostSoldProducts.map(({ label }) => label)}
                data={mostSoldProducts.map(({ sales }) => sales)}
              />
            </Col>
            <Col span={8}>
              <BarChart
                title={'Top profitable products'}
                currency={this.props.currency}
                labels={mostProfitableProducts.map(({ label }) => label)}
                data={mostProfitableProducts.map(({ profit }) => profit)}
              />
            </Col>
          </Row>
        </div> : dashboard.empty}
      </Card>
    })}
  </Page>
}

export default class Dashboard extends React.Component {
  componentDidMount = () => document.title = 'Home - Obiman';
  render = () => <Consumer>
    {({ currentBusiness }) => <DashboardComponent
      businessId={currentBusiness.id}
      currency={currentBusiness.currency}
      sources={currentBusiness.metadata.sources || []}
    />}
  </Consumer>
}