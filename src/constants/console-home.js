import moment from 'moment';
import { Bill } from 'obiman-data-models';

export const DASHBOARDS = [
  {
    title: 'Today',
    query: {
      status: [ new Bill().getPositiveEndState() ],
      updatedDateFrom: moment().startOf('day').valueOf()
    }
  },
  {
    title: 'This week',
    query: {
      status: [ new Bill().getPositiveEndState() ],
      updatedDateFrom: moment().startOf('week').valueOf()
    }
  }
];