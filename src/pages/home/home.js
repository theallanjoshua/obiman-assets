import * as React from 'react';
import Page from '../../components/page';
import { Result, Icon, Typography, Timeline } from 'antd';
import { Link } from 'react-router-dom'
import {
  INGREDIENTS,
  PRODUCTS,
  BILLING
} from '../../constants/pages';
import rf from 'random-facts';

const { Text } = Typography;

export default class Home extends React.Component {
  render = () => <Page>
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
      </div>}
    />
    <Result
      icon={<Icon type='question' />}
      title='Did you know?'
      subTitle={rf.randomFact()}
    />
  </Page>
}