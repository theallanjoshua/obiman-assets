import moment from 'moment';

export const DASHBOARDS = [
  {
    title: 'Today',
    query: {
      status: ['Closed'],
      updatedDateFrom: moment().startOf('day').valueOf()
    }
  },
  {
    title: 'This week',
    query: {
      status: ['Closed'],
      updatedDateFrom: moment().startOf('week').valueOf()
    }
  }
];