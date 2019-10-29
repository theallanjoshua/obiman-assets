import * as React from 'react';
import Page from '../../components/page';
import { Link } from 'react-router-dom'
import { Result, Button } from 'antd';
import { HOME, PAGE_URL_TITLE_MAP } from '../../constants/pages';

export default class NotFound extends React.Component {
  componentDidMount = () => document.title = '404 - Obiman';
  render = () => <Page>
    <Result
      status='404'
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={<Link to={HOME}>
        <Button
          type='primary'
          children={`Back ${PAGE_URL_TITLE_MAP[HOME]}`}
        />
      </Link>}
    />
  </Page>
}