import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';
import rca from 'rainbow-colors-array';
import { Utils } from 'obiman-data-models';

export default class PieChart extends React.Component {
  render = () => {
    const groupedData = this.props.group ? this.props.group(this.props.data) : [{ label: this.props.label, data: this.props.data }];
    const labels = groupedData.map(({ label }) => label);
    const data = groupedData.map(({ data }) => this.props.reduce(data));
    return <Doughnut
      height={300}
      data={{
        labels,
        datasets: [{
          data,
          backgroundColor: rca(data.length, 'hex').map(({ hex}) => `#${hex}`)
        }]
      }}
      options={{
        title: {
          display: true,
          text: this.props.title,
          fontSize: 18
        },
        legend: {
          position: 'right',
          labels: {
            boxWidth: 10
          }
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
}