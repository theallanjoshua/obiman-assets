import * as React from 'react';
import { Row, Col, Card, Button, Empty, Statistic, Collapse } from 'antd';
import { fetchBills } from '../../../utils/bills';
import PieChart from './pie-chart';
import TrendChart from './trend-chart';
import BarChart from './bar-chart';
import { Utils } from 'obiman-data-models';
import AllProducts from '../../manage_products/components/all-products';
import moment from 'moment';

const { Panel } = Collapse;
const layout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 8, offset: 2 }
};

export default class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      bills: [],
      activeKey: 'bills'
    }
  }
  componentDidMount = () => {
    const { businessId, query } = this.props;
    if(businessId && query) {
      this.fetchBills();
    }
  };
  componentDidUpdate = prevProps => {
    const { businessId, query } = this.props;
    if(businessId && query && (prevProps.businessId !== businessId || prevProps.query !== query)) {
      this.fetchBills();
    }
  };
  fetchBills = async () => {
    const { businessId, query } = this.props;
    const { updatedDateFrom } = query;
    if (updatedDateFrom) {
      this.setState({ loading: true, errorMessage: '' });
      try {
        const { bills } = await fetchBills(businessId, query);
        this.setState({ bills });
      } catch (errorMessage) {
        this.setState({ errorMessage });
      }
      this.setState({ loading: false });
    } else {
      this.setState({ bills: [] });
    }
  }
  groupBySource = bills => this.props.sources.map(source => ({ label: source, data: bills.filter(bill => bill.source === source) }));
  aggregateTotal = bills => bills.reduce((acc, { total }) => acc + total, 0);
  onTabChange = activeKey => this.setState({ activeKey });
  render = () => {
    const { bills } = this.state;
    const totalCount = bills.length;
    const totalSalesData = this.aggregateTotal(bills);
    const totalBillComposition = bills.reduce((acc, bill) => [ ...acc, ...(bill.composition || []) ], []);
    const productData = this.props.products.map(product => ({
      ...product,
      aggregatedData: {
        ...totalBillComposition
        .filter(({ id }) => id === product.id)
        .reduce((acc, composition) => ({
          count: acc.count + 1,
          sales: acc.sales + composition.price
        }), { count: 0, sales: 0 })
      }
    }));
    const mostOrderedProducts = productData
      .sort((prv, nxt) => nxt.aggregatedData.count - prv.aggregatedData.count)
      .filter((item, index) => index < 5)
      .map(({ label, aggregatedData: { count } }) => ({ label, data: count }));
    const mostSoldProducts = productData
      .sort((prv, nxt) => nxt.aggregatedData.sales - prv.aggregatedData.sales)
      .filter((item, index) => index < 5)
      .map(({ label, aggregatedData: { sales } }) => ({ label, data: sales }));
    const leastOrderedProducts = productData
      .sort((prv, nxt) => prv.aggregatedData.count - nxt.aggregatedData.count)
      .filter(({ label, aggregatedData: { count } }) => count > 0 && !mostOrderedProducts.map(({ label }) => label).includes(label))
      .filter((item, index) => index < 5)
      .map(({ label, aggregatedData: { count } }) => ({ label, data: count }));
    const leastSoldProducts = productData
      .sort((prv, nxt) => prv.aggregatedData.sales - nxt.aggregatedData.sales)
      .filter(({ label, aggregatedData: { sales } }) => sales > 0 && !mostSoldProducts.map(({ label }) => label).includes(label))
      .filter((item, index) => index < 5)
      .map(({ label, aggregatedData: { sales } }) => ({ label, data: sales }));
    const productsWithoutASale = productData.filter(({ aggregatedData: { count } }) => count === 0);
    return <Card
      key={this.props.title}
      title={this.props.title}
      loading={this.state.loading || this.props.loading}
      style={{ marginBottom: '30px' }}
      extra={<Button
        icon='reload'
        onClick={this.fetchBills}
      />}
      tabList={[{
        key: 'bills',
        tab: 'Bills'
      }, {
        key: 'products',
        tab: 'Products'
      }]}
      activeTabKey={this.state.activeKey}
      onTabChange={this.onTabChange}
    >
      {this.state.activeKey === 'bills' ?
        bills.length ? <Collapse defaultActiveKey={'first'}>
          <Panel
            header='Overall'
            key='first'
          >
            <Row gutter={32}>
              <Col { ...layout }>
                <Card>
                  <Statistic
                    title='No. of bills'
                    value={totalCount}
                    precision={0}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col { ...layout }>
                <Card>
                  <Statistic
                    title='Total sales'
                    value={totalSalesData}
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={new Utils().getCurrencySymbol(this.props.currency)}
                  />
                </Card>
              </Col>
            </Row>
            <br />
            <Row gutter={8}>
              <Col { ...layout }>
                <TrendChart
                  title={'By count'}
                  label={'Count'}
                  rangeStart={this.props.query.updatedDateFrom}
                  rangeEnd={this.props.query.updatedDateTo}
                  data={bills}
                  reduce={bills => bills.length}
                />
              </Col>
              <Col { ...layout }>
                <TrendChart
                  title={'By sales'}
                  label={'Sales'}
                  currency={this.props.currency}
                  rangeStart={this.props.query.updatedDateFrom}
                  rangeEnd={this.props.query.updatedDateTo}
                  data={bills}
                  reduce={this.aggregateTotal}
                />
              </Col>
            </Row>
          </Panel>
          <Panel
            header='By source'
            key='second'
          >
            <Row gutter={8}>
              <Col { ...layout }>
                <PieChart
                  title={'By count'}
                  data={bills}
                  group={this.groupBySource}
                  reduce={bills => bills.length}
                />
              </Col>
              <Col { ...layout }>
                <PieChart
                  title={'By sales'}
                  currency={this.props.currency}
                  data={bills}
                  group={this.groupBySource}
                  reduce={this.aggregateTotal}
                />
              </Col>
            </Row>
            <br />
            <Row gutter={8}>
              <Col { ...layout }>
                <TrendChart
                  title={'By count'}
                  rangeStart={this.props.query.updatedDateFrom}
                  rangeEnd={this.props.query.updatedDateTo}
                  data={bills}
                  group={this.groupBySource}
                  reduce={bills => bills.length}
                />
              </Col>
              <Col { ...layout }>
                <TrendChart
                  title={'By sales'}
                  currency={this.props.currency}
                  rangeStart={this.props.query.updatedDateFrom}
                  rangeEnd={this.props.query.updatedDateTo}
                  data={bills}
                  group={this.groupBySource}
                  reduce={this.aggregateTotal}
                />
              </Col>
            </Row>
          </Panel>
        </Collapse> :
        <Empty /> :
      this.state.activeKey === 'products' ?
        productData.length ? <Collapse defaultActiveKey={'first'}>
          <Panel
            header='Top 5 products'
            key='first'
          >
            <Row gutter={8}>
              <Col { ...layout }>
                <BarChart
                  title={'By count'}
                  data={mostOrderedProducts}
                />
              </Col>
              <Col { ...layout }>
                <BarChart
                  title={'By sales'}
                  currency={this.props.currency}
                  data={mostSoldProducts}
                />
              </Col>
            </Row>
          </Panel>
          <Panel
            header='Bottom 5 products'
            key='second'
          >
            <Row gutter={8}>
              <Col { ...layout }>
                <BarChart
                  title={'By count'}
                  data={leastOrderedProducts}
                />
              </Col>
              <Col { ...layout }>
                <BarChart
                  title={'By sales'}
                  currency={this.props.currency}
                  data={leastSoldProducts}
                />
              </Col>
            </Row>
          </Panel>
          <Panel
            header='Products without a sale'
            key='third'
          >
            <AllProducts
              currency={this.props.currency}
              loading={this.state.loading || this.props.loading}
              ingredients={this.props.ingredients}
              products={productsWithoutASale}
              classifications={this.props.classifications}
              taxes={this.props.taxes}
              businessId={this.props.businessId}
              fetchAllProducts={this.props.fetchAllIngredientsAndProducts}
            />
          </Panel>
        </Collapse> :
        <Empty /> :
      null}
  </Card>}
}