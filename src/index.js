import * as React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Provider } from './context';
import { Layout, BackTop, Spin, Alert } from 'antd';
import {
  MANAGE_INGREDIENTS,
  MANAGE_PRODUCTS,
  BILLING_ALL_OPEN,
  BILLING_NEW,
  BILLING_EDIT
} from './constants/pages';
import Credentials from './utils/credentials';
import TopNavigation from './components/top-navigation';
import SideNavigation from './components/side-navigation';
import ManageIngredients from './pages/manage_ingredients/manage-ingredients';
import ManageProducts from './pages/manage_products/manage-products';
import AllOpenBills from './pages/billing/all-open-bills';
import AddBill from './pages/billing/add-bill';
import EditBill from './pages/billing/edit-bill';
import 'antd/dist/antd.less';
import './index.less';

const { Header, Content } = Layout;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      errorMessage: '',
      username: '',
      email: ''
    };
  }
  authenticate = async () => {
    this.setState({ loading: true });
    try {
      const { idToken } = await Credentials.authenticate();
      const { payload } = idToken;
      const { email, username } = payload;
      this.setState({ email, username });
    } catch (error) {
      console.log(error);
      this.setState({ errorMessage: 'Oops! Something went wrong! Try refreshing the page. If the issue persists, raise out to us at some@email.com' });
    }
    this.setState({ loading: false });
  }
  componentDidMount = () => {
    this.authenticate();
    document.cookie = 'businessId=1';
  }
  render = () => this.state.errorMessage ? <Alert
    type='error'
    showIcon
    message={this.state.errorMessage}
    style={{
      width: 'max-content',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '20px'
    }}
  /> : <Spin spinning={this.state.loading}>
    <Provider value={{ ...this.state }}>
        <Router>
          <Layout>
            <Header style={{
              padding: 0,
              background: 'transparent',
              height: 'inherit',
            }}>
              <TopNavigation />
            </Header>
            <Layout style={{
              height: 'calc(100vh - 46px)',
              overflowY: 'scroll'
            }}>
              <SideNavigation />
              <Layout>
                <Content>
                  <Switch>
                    <Route exact path={MANAGE_INGREDIENTS} component={ManageIngredients} />
                    <Route exact path={MANAGE_PRODUCTS} component={ManageProducts} />
                    <Route exact path={BILLING_ALL_OPEN} component={AllOpenBills} />
                    <Route exact path={BILLING_NEW} component={AddBill} />
                    <Route exact path={BILLING_EDIT} component={EditBill} />
                  </Switch>
                </Content>
              </Layout>
            </Layout>
          </Layout>
      </Router>
    </Provider>
  </Spin>
}

ReactDOM.render(<div>
  <BackTop />
  <App />
</div>, document.getElementById('app'));