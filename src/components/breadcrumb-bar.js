import * as React from 'react';
import { Breadcrumb, Icon } from 'antd';
import { Link } from 'react-router-dom'
import { PAGE_URL_TITLE_MAP } from '../constants/pages';
import { withRouter } from 'react-router';

const getBreadcrumbs = () => window.location.hash
  .replace('#','')
  .split('/')
  .filter(crumb => crumb)
  .reduce((acc, crumb) => {
    const { link = '' } = acc.length ? acc[acc.length - 1] : {};
    return [ ...acc, { link: [ link, crumb ].join('/'), title: PAGE_URL_TITLE_MAP[`/${crumb}`] || crumb } ]
  }, []);

const BreadcrumbBar = () => <Breadcrumb>
  <Breadcrumb.Item key='home'>
    <Link to='/'><Icon type='home' /></Link>
  </Breadcrumb.Item>
  {getBreadcrumbs().map(({ link, title }) => <Breadcrumb.Item key={link}>
    <Link to={link}>{title}</Link>
  </Breadcrumb.Item>)}
</Breadcrumb>;

export default withRouter(BreadcrumbBar);