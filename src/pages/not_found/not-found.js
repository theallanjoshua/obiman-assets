import * as React from 'react';
import { Link } from 'react-router-dom'
import { Result, Button } from 'antd';
import {
  HOME,
  PAGE_URL_TITLE_MAP,
  getBusinessSpecificUrl
} from '../../constants/pages';
import { getCurrentBusinessId } from '../../utils/businesses';

export default class NotFound extends React.Component {
  componentDidMount = () => document.title = '404 - Obiman';
  render = () => <Result
    status='404'
    title='404'
    subTitle='Sorry, the page you visited does not exist.'
    extra={<Link to={getCurrentBusinessId() ? getBusinessSpecificUrl(HOME) : HOME}>
      <Button
        type='primary'
        children={`Back ${PAGE_URL_TITLE_MAP[HOME]}`}
      />
    </Link>}
  />
}