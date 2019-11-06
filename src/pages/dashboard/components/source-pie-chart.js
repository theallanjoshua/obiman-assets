import * as React from 'react';
import { Pie } from 'react-chartjs-2';
import rca from 'rainbow-colors-array';
import { Utils } from 'obiman-data-models';

export default class SourcePieChart extends React.Component {
  render = () => <Pie
    height={300}
    data={{
      labels: this.props.sources,
      datasets: [{
        data: this.props.data,
        backgroundColor: rca(this.props.sources.length, 'hex').map(({ hex}) => `#${hex}`)
      }]
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
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const { labels, datasets } = data;
            const { index } = tooltipItem;
            const label = labels[index];
            const value = datasets[0].data[index];
            return `${label}: ${this.props.currency ? `${new Utils().getCurrencySymbol(this.props.currency)}${value}` : value}`
          }
        }
      }
    }}
  />
}