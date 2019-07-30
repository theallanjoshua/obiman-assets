import * as React from 'react';
import { Breadcrumb, Icon } from 'antd';
import { Link } from 'react-router-dom'
import { BREADCRUMB_MAP, PAGE_URL_TITLE_MAP } from '../constants/pages';

const getBreadcrumbValue = () => BREADCRUMB_MAP[window.location.hash.replace('#','')] || [];

const BreadcrumbBar = () => <Breadcrumb>
  <Breadcrumb.Item key='home'>
    <Link to='/'><Icon type='home' /></Link>
  </Breadcrumb.Item>
  {getBreadcrumbValue().map(key => <Breadcrumb.Item key={key}>
    <Link to={key}>{PAGE_URL_TITLE_MAP[key]}</Link>
  </Breadcrumb.Item>)}
</Breadcrumb>;

export default BreadcrumbBar;