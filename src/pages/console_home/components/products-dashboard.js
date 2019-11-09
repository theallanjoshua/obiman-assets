import * as React from 'react';
import { Row, Col, Card, Button } from 'antd';
import Network from '../../../utils/network';
import { BILLS_API_URL } from '../../../constants/endpoints';
import BarChart from './bar-chart';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const tripletsLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 8 }
};

export default class ProductsDashboard extends React.Component {
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
      .map(({ label, count }) => ({ label, data: count }));
    const mostSoldProducts = productData
      .sort((prv, nxt) => nxt.sales - prv.sales)
      .map(({ label, sales }) => ({ label, data: sales }));
    const mostProfitableProducts = productData
      .sort((prv, nxt) => nxt.profit - prv.profit)
      .map(({ label, profit }) => ({ label, data: profit }));
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
      {productData.length ? <Row gutter={8}>
        <Col { ...tripletsLayout }>
          <BarChart
            title={'By count'}
            data={mostOrderedProducts}
          />
        </Col>
        <Col { ...tripletsLayout }>
          <BarChart
            title={'By sales'}
            currency={this.props.currency}
            data={mostSoldProducts}
          />
        </Col>
        <Col { ...tripletsLayout }>
          <BarChart
            title={'By profit'}
            currency={this.props.currency}
            data={mostProfitableProducts}
          />
        </Col>
      </Row> : this.props.empty}
    </Card>
  }
}