import * as React from 'react';
import moment from 'moment';
import { Empty, Button } from 'antd';
import { Link } from 'react-router-dom'
import { BILLING } from './pages';

export const DASHBOARDS = [
  {
    title: 'Today',
    getBills: bills => bills.filter(({ updatedDate }) => updatedDate >= moment().startOf('day').valueOf()),
    empty: <Empty
      description='No bills closed today yet'
      children={<Link to={BILLING}>
        <Button
          type='primary'
          children='Start billing'
        />
      </Link>}
    />
  },
  {
    title: 'Yesterday',
    getBills: bills => bills.filter(({ updatedDate }) => updatedDate >= moment().subtract(1, 'day').startOf('day').valueOf() && updatedDate < moment().startOf('day').valueOf()),
    empty: <Empty description='No bills closed yesterday' />
  },
  {
    title: 'This week',
    getBills: bills => bills.filter(({ updatedDate }) => updatedDate >= moment().startOf('week').valueOf()),
    showTrend: true,
    empty: <Empty
      description='No bills closed this week yet'
      children={<Link to={BILLING}>
        <Button
          type='primary'
          children='Start billing'
        />
      </Link>}
    />
  },
  {
    title: 'Last week',
    getBills: bills => bills.filter(({ updatedDate }) => updatedDate >= moment().subtract(1, 'week').startOf('week').valueOf() && updatedDate < moment().startOf('week').valueOf()),
    showTrend: true,
    empty: <Empty description='No bills closed last week' />
  }
];