import * as React from 'react';
import { Result, Icon, Typography, Timeline } from 'antd';
import { Link } from 'react-router-dom'
import {
  INGREDIENTS,
  PRODUCTS,
  BILLING
} from '../../constants/pages';
import rf from 'random-facts';
import { Pie } from 'react-chartjs-2';
import { Consumer } from '../../context';
import rca from 'rainbow-colors-array';

const { Text } = Typography;

class HomeComponent extends React.Component {
  render = () => <>
    <Result
      icon={<Icon type='smile' theme='twoTone' twoToneColor='#52c41a' />}
      title='Welcome to Obiman!'
      subTitle={<span>The name says it all,
        <span className='obiman-x-large-font'> O</span>
        rdering
        <span className='obiman-x-large-font'> B</span>
        illing and
        <span className='obiman-x-large-font'> I</span>
        nventory
        <span className='obiman-x-large-font'> MAN</span>
        agement done the simple way
      </span>}
      extra={<div>
        <div className='center-align' style={{ textAlign: 'left'}}>
          <Timeline>
            <Timeline.Item dot={<Icon type='build' />}>
              Create the ingredients you use and want to manage.
              <Link to={INGREDIENTS}> Go</Link>
            </Timeline.Item>
            <Timeline.Item dot={<Icon type='table' />}>
              Build the products you sell using the created ingredients.
              <Link to={PRODUCTS}> Go</Link>
            </Timeline.Item>
            <Timeline.Item dot={<Icon type='calculator' />}>
              Start billing the orders for your created products.
              <Link to={BILLING}> Go</Link>
            </Timeline.Item>
          </Timeline>
        </div>
        <Text type='secondary'>It's that simple!</Text>
        <Pie
          data={{
            labels: this.props.sources,
            datasets: [{
              data: this.props.sources.map(source => source.length),
              backgroundColor: rca(this.props.sources.length, 'hex', true).map(({ hex}) => `#${hex}`)
            }]
          }}
          options={{
            legend: {
              position: 'bottom'
            }
          }}
        />
      </div>}
    />
    <Result
      icon={<Icon type='question' />}
      title='Did you know?'
      subTitle={rf.randomFact()}
    />
  </>
}

export default class Home extends React.Component {
  componentDidMount = () => document.title = 'Home - Obiman';
  render = () => <Consumer>
    {({ currentBusiness }) => <HomeComponent
      currency={currentBusiness.currency}
      sources={currentBusiness.billSources || []}
    />}
  </Consumer>
}