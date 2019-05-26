import * as React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import ReactDOM from 'react-dom';
import { Layout } from 'antd';
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
  componentDidMount = () => {
    document.cookie = 'businessId=1';
  }
  render = () => <Router>
    <Layout>
      <Sider>
        <SideNavigation />
      </Sider>
      <Content style={{ padding: '30px', background: '#FFF'}}>
        <Switch>
            <Route exact path={MANAGE_INGREDIENTS} component={ManageIngredients} />
            <Route exact path={MANAGE_PRODUCTS} component={ManageProducts} />
        </Switch>
      </Content>
    </Layout>
  </Router>;
}

ReactDOM.render(<App />, document.getElementById('app'));