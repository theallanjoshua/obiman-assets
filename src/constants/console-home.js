import * as React from 'react';
import moment from 'moment';
import { Empty, Button } from 'antd';
import { Link } from 'react-router-dom'
import { BILLING } from './pages';

const DashboardEmpty = ({ message, showStartBilling }) =>  <Empty
  description={message}
  children={showStartBilling ? <Link to={BILLING}>
    <Button
      type='primary'
      children='Start billing'
    />
  </Link> : null}
/>

export const DASHBOARDS = [
  {
    key: 'today',
    title: 'Today',
    query: `updatedDateFrom=${moment().startOf('day').valueOf()}`,
    empty: <DashboardEmpty
      message='No bills closed today yet'
      showStartBilling
    />
  },
  {
    key: 'yesterday',
    title: 'Yesterday',
    query: `updatedDateFrom=${moment().subtract(1, 'day').startOf('day').valueOf()}&updatedDateTo=${moment().startOf('day').valueOf()}`,
    empty: <DashboardEmpty
      message='No bills closed yesterday'
    />
  },
  {
    key: 'thisWeek',
    title: 'This week',
    query: `updatedDateFrom=${moment().startOf('week').valueOf()}`,
    showTrend: true,
    empty: <DashboardEmpty
      message='No bills closed this week yet'
      showStartBilling
    />
  },
  {
    key: 'lastWeek',
    title: 'Last week',
    query: `updatedDateFrom=${moment().subtract(1, 'week').startOf('week').valueOf()}&updatedDateTo=${moment().startOf('week').valueOf()}`,
    showTrend: true,
    empty: <DashboardEmpty
      message='No bills closed last week'
    />
  }
];