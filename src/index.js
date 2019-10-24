import * as React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Provider } from './context';
import { Layout, Spin, Alert } from 'antd';
import {
  INGREDIENTS,
  PRODUCTS,
  BILLING
} from './constants/pages';
import { PAGE_ERROR } from './constants/app';
import Credentials from './utils/credentials';
import TopNavigation from './components/top-navigation';
import ManageIngredients from './pages/manage_ingredients/manage-ingredients';
import ManageProducts from './pages/manage_products/manage-products';
import ManageBusinesses from './pages/manage_businesses/manage-businesses';
import ManageBilling from './pages/manage_billing/manage-billing';
import { fetchUser } from './utils/user';
import 'antd/dist/antd.less';
import './index.less';

const { Header, Content } = Layout;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      errorMessage: '',
      name: '',
      email: '',
      avatar: '',
      businesses: [],
      currentBusiness: {},
      showBusinessManagement: false
    };
  }
  componentDidMount = () => this.authenticate();
  componentDidUpdate = (prevProps, prevState) => {
    if(prevState.email !== this.state.email && this.state.email) {
      this.fetchUser();
    }
  }
  authenticate = async () => {
    this.setState({ loading: true });
    try {
      const session = await Credentials.authenticate();
      const idToken = session.getIdToken();
      const { payload } = idToken;
      const { email, name, picture } = payload || {};
      const avatar = picture ? picture.includes('"url":') ? JSON.parse(picture).data.url : picture : '';
      this.setState({ email, name, avatar, loading: false });
    } catch (error) {
      if(error) {
        this.setState({ errorMessage: PAGE_ERROR, loading: false });
      }
    }
  }
  fetchUser = async () => {
    this.setState({ loading: true, errorMessage: '' });
    try {
      const user = await fetchUser(this.state.email);;
      const { businesses } = user;
      const currentBusiness = businesses.length === 1 ? businesses[0] : {};
      this.setState({ businesses, currentBusiness, loading: false });
    } catch (errorMessage) {
      this.setState({ errorMessage, loading: false });
    }
  }
  onBusinessChange = currentBusiness => this.setState({ currentBusiness, showBusinessManagement: false });
  showBusinessManagement = () => this.setState({ showBusinessManagement: true });
  hideBusinessManagement = () => this.setState({ showBusinessManagement: false });
  render = () => <Provider value={{ ...this.state,
    fetchUser: this.fetchUser,
    onBusinessChange: this.onBusinessChange,
    showBusinessManagement: this.showBusinessManagement,
    hideBusinessManagement: this.hideBusinessManagement
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
    /> : !this.state.currentBusiness.id ? <ManageBusinesses
    /> : this.state.showBusinessManagement ? <ManageBusinesses
      enableEdit
    /> : <Spin spinning={this.state.loading}>
          <Router>
            <Layout style={{ height: '100vh' }}>
              <Header style={{
                padding: 0,
                height: 'initial',
              }}>
                <TopNavigation />
              </Header>
                <Content>
                  <Switch>
                    <Route exact path={INGREDIENTS} component={ManageIngredients} />
                    <Route exact path={PRODUCTS} component={ManageProducts} />
                    <Route exact path={BILLING} component={ManageBilling} />
                  </Switch>
                </Content>
            </Layout>
        </Router>
    </Spin>}
  </Provider>;
}

ReactDOM.render(<App />, document.getElementById('app'));