import moment from 'moment';
import { Bill } from 'obiman-data-models';

const status = [ new Bill().getPositiveEndState() ];

export const DASHBOARDS = [
  {
    title: 'Today',
    query: {
      status,
      updatedDateFrom: moment().startOf('day'),
      updatedDateTo: moment().endOf('day')
    }
  },
  {
    title: 'This week',
    query: {
      status,
      updatedDateFrom: moment().startOf('week'),
      updatedDateTo: moment().endOf('week')
    }
  }
];