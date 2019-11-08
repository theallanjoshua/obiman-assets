import * as React from 'react';
import Page from '../../components/page';
import { Consumer } from '../../context';
import { DASHBOARDS } from '../../constants/console-home';
import Dashboard from './components/dashboard';

class ConsoleHomeComponent extends React.Component {
  render = () => <Page>
    {DASHBOARDS.map(dashboard => <Dashboard
      { ...dashboard }
      businessId={this.props.businessId}
      currency={this.props.currency}
      sources={this.props.sources}
    />)}
  </Page>
}

export default class ConsoleHome extends React.Component {
  componentDidMount = () => document.title = 'Home - Obiman';
  render = () => <Consumer>
    {({ currentBusiness }) => <ConsoleHomeComponent
      businessId={currentBusiness.id}
      currency={currentBusiness.currency}
      sources={currentBusiness.metadata.sources || []}
    />}
  </Consumer>
}