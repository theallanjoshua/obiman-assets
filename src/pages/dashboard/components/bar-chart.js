import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import rca from 'rainbow-colors-array';
import { Utils } from 'obiman-data-models';

export default class BarChart extends React.Component {
  render = () => <Bar
    data={{
      labels: this.props.labels,
      datasets: [{
        data: this.props.data,
        borderColor: rca(this.props.labels.length, 'hex').map(({ hex }) => `#${hex}`),
        backgroundColor: rca(this.props.data.length, 'rgb', true).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b}, 0.5)`),
        borderWidth: 1,
        hoverBackgroundColor: rca(this.props.data.length, 'rgb', true).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b}, 0.7)`)
      }]
    }}
    options={{
      title: {
        display: true,
        text: this.props.title,
        fontSize: 18
      },
      legend: {
        display: false
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