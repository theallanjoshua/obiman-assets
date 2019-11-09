import * as React from 'react';
import moment from 'moment';
import { Empty, Button } from 'antd';
import { Link } from 'react-router-dom'
import { BILLING } from './pages';

export const DASHBOARDS = [
  {
    title: 'Today',
    query: `updatedDateFrom=${moment().startOf('day').valueOf()}`,
    emptyBills: <Empty
      description={'No bills closed today yet!'}
      children={<Link to={BILLING}>
        <Button
          type='primary'
          children='Start billing'
        />
      </Link>}
    />,
    emptyProducts: <Empty description={'No products sold today yet!'} />
  },
  {
    title: 'This week',
    query: `updatedDateFrom=${moment().startOf('week').valueOf()}`,
    showTrend: true,
    empty: <Empty description={'No bills closed this week yet!'} />,
    emptyProducts: <Empty description={'No products sold this week yet!'} />
  }
];