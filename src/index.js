import * as React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import ReactDOM from 'react-dom';
import { Layout } from 'antd';
import {
  MANAGE_INGREDIENTS,
  MANAGE_PRODUCTS
} from './constants/pages';
import SideNavigation from './components/sideNavigation';
import ManageIngredients from './pages/manageIngredients';
import ManageProducts from './pages/manageProducts';
import 'antd/dist/antd.css';
import './index.css';

const { Sider, Content } = Layout;

class App extends React.Component {
  render = () => {
    return <Router>
      <Layout>
        <Sider>
          <SideNavigation />
        </Sider>
        <Content style={{ padding: '10px'}}>
          <Switch>
              <Route exact path={MANAGE_INGREDIENTS} component={ManageIngredients} />
              <Route exact path={MANAGE_PRODUCTS} component={ManageProducts} />
          </Switch>
        </Content>
      </Layout>
    </Router>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));