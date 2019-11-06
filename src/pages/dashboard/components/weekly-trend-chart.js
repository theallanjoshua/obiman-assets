import * as React from 'react';
import { Line } from 'react-chartjs-2';
import rca from 'rainbow-colors-array';
import { Utils } from 'obiman-data-models';

const defaultLineColors = ['rgb(0,128,128)', 'rgb(63,134,0)'];
const defaultLineAreaColors = ['rgb(0,128,128, 0.5)', 'rgb(63,134,0, 0.5)'];

export default class WeeklyTrendChart extends React.Component {
  render = () => {
    const lineColors = this.props.data.length > defaultLineColors.length ? rca(this.props.data.length, 'hex').map(({ hex }) => `#${hex}`) : defaultLineColors;
    const lineAreaColors = this.props.data.length > defaultLineAreaColors.length ? rca(this.props.data.length, 'rgb', true).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b}, 0.5)`) : defaultLineAreaColors;
    const datasets = this.props.data.map((datum, index) => ({ ...datum, borderColor: lineColors[index], backgroundColor: lineAreaColors[index]}));
    return <Line
    height={300}
    data={{
      labels: this.props.daysOfWeek,
      datasets
    }}
    options={{
      title: {
        display: true,
        text: this.props.title,
        fontSize: 18
      },
      legend: {
        position: 'right'
      },
      scales: {
        yAxes: [{
            ticks: {
              min: 0,
              callback: value => this.props.currency ? `${new Utils().getCurrencySymbol(this.props.currency)}${value}` : value
            }
        }]
      }
    }}
  />
  }
}