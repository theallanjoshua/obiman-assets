import * as React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Layout, Button, BackTop } from 'antd';
import {
  MANAGE_INGREDIENTS,
  MANAGE_PRODUCTS,
  BILLING_ALL_OPEN,
  BILLING_NEW,
  BILLING_EDIT
} from './constants/pages';
import SideNavigation from './components/side-navigation';
import { BreadcrumbBar } from './components/breadcrumb-bar';
import ManageIngredients from './pages/manage_ingredients/manage-ingredients';
import ManageProducts from './pages/manage_products/manage-products';
import AllOpenBills from './pages/billing/all-open-bills';
import AddBill from './pages/billing/add-bill';
import EditBill from './pages/billing/edit-bill';
import 'antd/dist/antd.less';
import './index.less';

const { Content } = Layout;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      showSideNavigation: false,
    }
  }
  componentDidMount = () => {
    document.cookie = 'businessId=1';
  }
  showSideNavigation = () => this.setState({ showSideNavigation: true });
  hideSideNavigation = () => this.setState({ showSideNavigation: false });
  render = () => <Router>
    <Layout>
      <Content>
        <div style={{ display: 'flex '}}>
          <div>
            <Button
              className='side-navigation-expand-trigger'
              icon='menu'
              onClick={this.showSideNavigation}
            />
            <SideNavigation
              visible={this.state.showSideNavigation}
              onClose={this.hideSideNavigation}
            />
          </div>
          <div style={{ width: '100%', padding: '30px', background: '#fff' }}>
            <BreadcrumbBar />
            <br />
            <Switch>
                <Route exact path={MANAGE_INGREDIENTS} component={ManageIngredients} />
                <Route exact path={MANAGE_PRODUCTS} component={ManageProducts} />
                <Route exact path={BILLING_ALL_OPEN} component={AllOpenBills} />
                <Route exact path={BILLING_NEW} component={AddBill} />
                <Route exact path={BILLING_EDIT} component={EditBill} />
            </Switch>
          </div>
        </div>
      </Content>
    </Layout>
  </Router>;
}

ReactDOM.render(<div>
  <BackTop />
  <App />
</div>, document.getElementById('app'));