import * as React from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import { Utils } from 'obiman-data-models';

export default class BarChart extends React.Component {
  render = () => <HorizontalBar
    height={300}
    data={{
      labels: this.props.labels,
      datasets: [{
        data: this.props.data,
        borderColor: '#4a765f',
        backgroundColor: 'rgb(149, 236, 190, 0.5)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgb(149, 236, 190, 0.7)'
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
        xAxes: [{
          ticks: {
            min: 0,
            callback: value => this.props.currency ? `${new Utils().getCurrencySymbol(this.props.currency)}${value}` : value
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const { datasets } = data;
            const { index } = tooltipItem;
            const value = datasets[0].data[index];
            return this.props.currency ? `${new Utils().getCurrencySymbol(this.props.currency)}${value}` : value;
          }
        }
      }
    }}
  />
}