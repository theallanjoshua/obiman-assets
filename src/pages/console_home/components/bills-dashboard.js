import * as React from 'react';
import { Row, Col, Card, Descriptions, Button } from 'antd';
import moment from 'moment';
import Network from '../../../utils/network';
import { BILLS_API_URL } from '../../../constants/endpoints';
import SourcePieChart from './source-pie-chart';
import WeeklyTrendChart from './weekly-trend-chart';
import { Utils } from 'obiman-data-models';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const tripletsLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 8 }
};

export default class BillsDashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      bills: []
    }
  }
  componentDidMount = () => {
    const { businessId, query } = this.props;
    if(businessId && query) {
      this.fetchBills()
    }
  };
  componentDidUpdate = prevProps => {
    const { businessId, query } = this.props;
    if(businessId && query && (prevProps.businessId !== businessId || prevProps.query !== query)) {
      this.fetchBills()
    }
  };
  fetchBills = async () => {
    const { businessId, query } = this.props;
    this.setState({ loading: true, errorMessage: '' });
    try {
      const { bills } = await Network.get(BILLS_API_URL(businessId, `status=Closed&${query}`));
      this.setState({ bills });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  render = () => {
    const { bills } = this.state;
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
    return <Card
      key={this.props.title}
      title={this.props.title}
      loading={this.state.loading}
      style={{ marginBottom: '30px' }}
      extra={<Button
        icon='reload'
        onClick={this.fetchBills}
      />}
    >
    {bills.length ? <div>
      <Row gutter={8}>
        <Col { ...tripletsLayout }>
          <Descriptions bordered column={1} size='small'>
            <Descriptions.Item label='Total bills'>{totalCount}</Descriptions.Item>
            <Descriptions.Item label='Total sales'>{`${new Utils().getCurrencySymbol(this.props.currency)}${totalSalesData}`}</Descriptions.Item>
            <Descriptions.Item label='Total profit'>{`${new Utils().getCurrencySymbol(this.props.currency)}${totalProfitData}`}</Descriptions.Item>
          </Descriptions>
        </Col>
        {this.props.showTrend ? <Col { ...tripletsLayout }>
          <WeeklyTrendChart
            title={'By count'}
            daysOfWeek={daysOfWeek}
            data={[{
              data: totalCountTrendData,
              label: 'Count'
            }]}
          />
        </Col> : null}
        {this.props.showTrend ? <Col { ...tripletsLayout }>
          <WeeklyTrendChart
            title={'By sales & profit'}
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
        </Col> : null}
      </Row>
      <br />
      <Row gutter={8}>
        <Col { ...tripletsLayout }>
          <SourcePieChart
            title={'By count'}
            sources={this.props.sources}
            data={sourceWiseTotalCount}
          />
        </Col>
        <Col { ...tripletsLayout }>
          <SourcePieChart
            title={'By sales'}
            currency={this.props.currency}
            sources={this.props.sources}
            data={sourceWiseSalesData}
          />
        </Col>
        <Col { ...tripletsLayout }>
          <SourcePieChart
            title={'By profit'}
            currency={this.props.currency}
            sources={this.props.sources}
            data={sourceWiseProfitData}
          />
        </Col>
      </Row>
      {this.props.showTrend ? <Row gutter={8}>
        <Col { ...tripletsLayout }>
          <WeeklyTrendChart
            title={'By count'}
            daysOfWeek={daysOfWeek}
            data={sourceWiseTotalCountTrendData}
            isPastel
          />
        </Col>
        <Col { ...tripletsLayout }>
          <WeeklyTrendChart
            title={'By sales'}
            currency={this.props.currency}
            daysOfWeek={daysOfWeek}
            data={sourceWiseSalesTrendData}
            isPastel
          />
        </Col>
        <Col { ...tripletsLayout }>
          <WeeklyTrendChart
            title={'By profit'}
            currency={this.props.currency}
            daysOfWeek={daysOfWeek}
            data={sourceWiseProfitTrendData}
            isPastel
          />
        </Col>
      </Row> : null}
    </div> : this.props.empty}
  </Card>}
}