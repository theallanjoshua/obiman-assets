import * as React from 'react';
import { DATE_TIME_FORMAT } from '../constants/app';
import moment from 'moment';
import { Tooltip } from 'antd';

export default class Timestamp extends React.Component {
  render = () => <Tooltip
    title={`${moment(Number(this.props.value)).format(DATE_TIME_FORMAT)}`}
    children={`${moment(Number(this.props.value)).fromNow()}`}
  />
}