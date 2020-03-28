import * as React from 'react';
import { Consumer } from '../../context';
import { DASHBOARDS } from '../../constants/console-home';
import Dashboard from './components/dashboard';
import moment from 'moment';
import DateRange from '../../components/date-range';
import { fetchAllIngredients } from '../../utils/ingredients';
import { fetchAllProducts, getEnrichedProducts } from '../../utils/products';
import { Bill } from 'obiman-data-models';

class ConsoleHomeComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      ingredients: [],
      products: [],
      activeKey: 'bills',
      query: {
        status: [ new Bill().getPositiveEndState() ],
        updatedDateFrom: moment().subtract(1, 'weeks').startOf('week'),
        updatedDateTo: moment().subtract(1, 'weeks').endOf('week')
      }
    };
  }
  componentDidMount = () => {
    if (this.props.businessId) {
      this.fetchAllIngredientsAndProducts();
    }
  };
  componentDidUpdate = prevProps => {
    const { businessId } = this.props;
    if(businessId && prevProps.businessId !== businessId) {
      this.fetchAllIngredientsAndProducts();
    }
  };
  fetchAllIngredientsAndProducts = async () => {
    const { businessId } = this.props;
    this.setState({ loading: true, errorMessage: '' });
    try {
      const ingredients = await fetchAllIngredients(businessId);
      const products = await fetchAllProducts(businessId);
      const enrichedProducts = getEnrichedProducts(products, ingredients);
      this.setState({ ingredients, products: enrichedProducts });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  onUpdateDateChange = ({ from, to }) => {
    const { query } = this.state;
    this.setState({ query: { ...query, updatedDateFrom: from, updatedDateTo: to || moment() } });
  }
  render = () => <>
    {DASHBOARDS.map(dashboard => <Dashboard
      key={dashboard.title}
      title={dashboard.title}
      query={dashboard.query}
      businessId={this.props.businessId}
      currency={this.props.currency}
      sources={this.props.sources}
      classifications={this.props.classifications}
      taxes={this.props.taxes}
      loading={this.state.loading}
      ingredients={this.state.ingredients}
      products={this.state.products}
      fetchAllIngredientsAndProducts={this.fetchAllIngredientsAndProducts}
    />)}
    <Dashboard
      title={<DateRange
        from={this.state.query.updatedDateFrom}
        to={this.state.query.updatedDateTo}
        onChange={this.onUpdateDateChange}
      />}
      query={this.state.query}
      businessId={this.props.businessId}
      currency={this.props.currency}
      sources={this.props.sources}
      classifications={this.props.classifications}
      taxes={this.props.taxes}
      loading={this.state.loading}
      ingredients={this.state.ingredients}
      products={this.state.products}
      fetchAllIngredientsAndProducts={this.fetchAllIngredientsAndProducts}
    />
  </>
}

export default class ConsoleHome extends React.Component {
  componentDidMount = () => document.title = 'Home - Obiman';
  render = () => <Consumer>
    {({ currentBusiness }) => <ConsoleHomeComponent
      businessId={currentBusiness.id}
      currency={currentBusiness.currency}
      sources={currentBusiness.billSources}
      classifications={currentBusiness.productClassifications}
      taxes={currentBusiness.productTaxesTypes}
    />}
  </Consumer>
}