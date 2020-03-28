import * as React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Provider } from './context';
import { Layout, Spin, Alert } from 'antd';
import {
  HOME,
  BUSINESS,
  BUSINESS_EDIT,
  BUSINESS_RESOURCE,
  INGREDIENTS,
  PRODUCTS,
  BILLS,
  ORDERS,
} from './constants/pages';
import { PAGE_ERROR } from './constants/app';
import Credentials from './utils/credentials';
import { CurrentBusiness } from './components/current-business';
import { TopNavigation, BottomNavigation } from './components/navigation';
import BreadcrumbBar from './components/breadcrumb-bar';
import Customer from './pages/customer/customer';
import ManageBusinesses from './pages/manage_businesses/manage-businesses';
import ConsoleHome from './pages/console_home/console-home';
import ManageOrders from './pages/manage_orders/manage-orders';
import ManageBilling from './pages/manage_billing/manage-billing';
import ManageIngredients from './pages/manage_ingredients/manage-ingredients';
import ManageProducts from './pages/manage_products/manage-products';
import NotFound from './pages/not_found/not-found';
import { Business } from 'obiman-data-models';
import 'antd/dist/antd.less';
import './index.less';

const { Content } = Layout;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      errorMessage: '',
      name: '',
      email: '',
      avatar: '',
      showBusinessManagement: false,
      currentBusiness: new Business().get()
    };
  }
  componentDidMount = () => this.authenticate();
  authenticate = async () => {
    this.setState({ loading: true });
    try {
      const session = await Credentials.authenticate();
      if (session) {
        const idToken = session.getIdToken();
        const { payload } = idToken;
        const { email, name, picture } = payload || {};
        const avatar = picture ? picture.includes('"url":') ? JSON.parse(picture).data.url : picture : '';
        this.setState({ email, name, avatar, loading: false });
      }
    } catch (error) {
      if(error) {
        this.setState({ errorMessage: PAGE_ERROR, loading: false });
      }
    }
  }
  setPageLoading = loading => this.setState({ loading });
  setPageErrorMessage = errorMessage => this.setState({ errorMessage });
  setCurrentBusiness = currentBusiness => this.setState({ currentBusiness: new Business(currentBusiness).get() });
  render = () => <Provider value={{
    ...this.state,
    setPageLoading: this.setPageLoading,
    setPageErrorMessage: this.setPageErrorMessage,
    setCurrentBusiness: this.setCurrentBusiness
  }}>
    {this.state.errorMessage ? <Alert
      type='error'
      showIcon
      message={this.state.errorMessage}
      style={{
        width: 'max-content',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '20px'
      }}
    /> :
    <Spin spinning={this.state.loading}>
      <Router>
        <CurrentBusiness />
        <TopNavigation />
        <Layout style={{ minHeight: '100vh', padding: '30px' }}>
          <Content>
          <BreadcrumbBar />
          <br />
          <Switch>
            <Route exact path={HOME} component={Customer} />
            <Route exact path={BUSINESS} component={ManageBusinesses} />
            <Route exact path={BUSINESS_EDIT} render={() => <ManageBusinesses enableEdit />} />
            <Route path={BUSINESS_RESOURCE} render={({ match: { path } }) => <>
              <Route exact path={`${path}${HOME}`} component={ConsoleHome} />
              <Route exact path={`${path}${ORDERS}`} component={ManageOrders} />
              <Route exact path={`${path}${BILLS}`} component={ManageBilling} />
              <Route exact path={`${path}${INGREDIENTS}`} component={ManageIngredients} />
              <Route exact path={`${path}${PRODUCTS}`} component={ManageProducts} />
            </>} />
            <Route component={NotFound} />
          </Switch>
          </Content>
        </Layout>
        <BottomNavigation />
      </Router>
    </Spin>}
  </Provider>;
}

ReactDOM.render(<App />, document.getElementById('app'));