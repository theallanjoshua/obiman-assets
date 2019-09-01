import * as React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Provider } from './context';
import { Layout, BackTop, Spin, Alert } from 'antd';
import {
  MANAGE_INGREDIENTS,
  MANAGE_PRODUCTS,
  BILLING_ALL_OPEN
} from './constants/pages';
import {
  PAGE_ERROR
} from './constants/app';
import Credentials from './utils/credentials';
import TopNavigation from './components/top-navigation';
import SideNavigation from './components/side-navigation';
import ManageIngredients from './pages/manage_ingredients/manage-ingredients';
import ManageProducts from './pages/manage_products/manage-products';
import ManageBusinesses from './pages/manage_businesses/manage-businesses';
import AllOpenBills from './pages/billing/all-open-bills';
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
      user: {},
      businessId: '',
      showBusinessManagement: false
    };
  }
  componentDidMount = () => this.authenticate();

  componentDidUpdate = (prevProps, prevState) => {
    if(prevState.email !== this.state.email && this.state.email) {
      this.fetchUser();
    }
    if(prevState.businessId !== this.state.businessId) {
      document.cookie = `businessId=${this.state.businessId}`;
    }
  }

  authenticate = async () => {
    this.setState({ loading: true });
    try {
      const { idToken } = await Credentials.authenticate();
      const { payload } = idToken;
      const { email, name, picture } = payload;
      const avatar = picture ? picture.includes('"url":') ? JSON.parse(picture).data.url : picture : '';
      this.setState({ email, name, avatar });
    } catch (error) {
      console.log(error);
      this.setState({ errorMessage: PAGE_ERROR });
    }
    this.setState({ loading: false });
  }

  fetchUser = async () => {
    this.setState({ loading: true, errorMessage: '' });
    try {
      const user = await fetchUser(this.state.email);;
      const { businesses } = user;
      const businessId = businesses.length === 1 ? businesses[0].id : '';
      this.setState({ user, businessId });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }

  onBusinessChange = businessId => this.setState({ businessId, showBusinessManagement: false });

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
    /> : !this.state.businessId ? <ManageBusinesses
    /> : this.state.showBusinessManagement ? <ManageBusinesses
      enableEdit
    /> : <Spin spinning={this.state.loading}>
          <Router>
            <Layout style={{ height: '100vh' }}>
              <Header style={{
                padding: 0,
                background: 'transparent',
                height: 'initial',
              }}>
                <TopNavigation />
              </Header>
              <Layout>
                <SideNavigation />
                <Layout>
                  <Content>
                    <Switch>
                      <Route exact path={MANAGE_INGREDIENTS} component={ManageIngredients} />
                      <Route exact path={MANAGE_PRODUCTS} component={ManageProducts} />
                      <Route exact path={BILLING_ALL_OPEN} component={AllOpenBills} />
                    </Switch>
                  </Content>
                </Layout>
              </Layout>
            </Layout>
        </Router>
    </Spin>}
  </Provider>;
}

ReactDOM.render(<div>
  <BackTop />
  <App />
</div>, document.getElementById('app'));