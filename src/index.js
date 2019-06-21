import * as React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import ReactDOM from 'react-dom';
import { Layout, Button } from 'antd';
import {
  MANAGE_INGREDIENTS,
  MANAGE_PRODUCTS
} from './constants/pages';
import SideNavigation from './components/side-navigation';
import ManageIngredients from './pages/manage_ingredients/manage-ingredients';
import ManageProducts from './pages/manage_products/manage-products';
import 'antd/dist/antd.css';
import './index.css';

const { Sider, Content } = Layout;

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
      <Content style={{ background: '#FFF'}}>
        <div style={{ display: 'flex '}}>
          <div>
          <Button
            style={{ height: '100vh' }}
            icon='menu'
            onClick={this.showSideNavigation}
          />
          <SideNavigation
            visible={this.state.showSideNavigation}
            onClose={this.hideSideNavigation}
          />
          </div>
          <div style={{ width: '100%', padding: '30px' }}>
          <Switch>
              <Route exact path={MANAGE_INGREDIENTS} component={ManageIngredients} />
              <Route exact path={MANAGE_PRODUCTS} component={ManageProducts} />
          </Switch>
          </div>
        </div>
      </Content>
    </Layout>
  </Router>;
}

ReactDOM.render(<App />, document.getElementById('app'));