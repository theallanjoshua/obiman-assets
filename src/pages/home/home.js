import * as React from 'react';
import { Result, Icon, Typography, Timeline } from 'antd';
import { Link } from 'react-router-dom'
import {
  INGREDIENTS,
  PRODUCTS,
  BILLING,
  BUSINESS_SPECIFIC_URL_MAP
} from '../../constants/pages';
import rf from 'random-facts';
import { Consumer } from '../../context';

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
              <Link to={BUSINESS_SPECIFIC_URL_MAP[INGREDIENTS]}> Go</Link>
            </Timeline.Item>
            <Timeline.Item dot={<Icon type='table' />}>
              Build the products you sell using the created ingredients.
              <Link to={BUSINESS_SPECIFIC_URL_MAP[PRODUCTS]}> Go</Link>
            </Timeline.Item>
            <Timeline.Item dot={<Icon type='calculator' />}>
              Start billing the orders for your created products.
              <Link to={BUSINESS_SPECIFIC_URL_MAP[BILLING]}> Go</Link>
            </Timeline.Item>
          </Timeline>
        </div>
        <Text type='secondary'>It's that simple!</Text>
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
    {({ currentBusiness }) => <HomeComponent />}
  </Consumer>
}