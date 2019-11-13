import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import { Utils } from 'obiman-data-models';
import rca from 'rainbow-colors-array';

export default class BarChart extends React.Component {
  render = () => {
    const borderColors = rca(this.props.data.length, 'hex').map(({ hex}) => `#${hex}`);
    const backgroundColors = rca(this.props.data.length, 'rgb', true).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b}, 0.5)`)
    return <Bar
      height={300}
      data={{
        datasets: this.props.data.map(({ label, data }, index) => ({
          label,
          data: [data],
          borderColor: borderColors[index],
          backgroundColor: backgroundColors[index],
          borderWidth: 1,
          hoverBackgroundColor: backgroundColors[index]
        }))
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
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              callback: value => this.props.currency ? `${new Utils().getCurrencySymbol(this.props.currency)}${value}` : value
            }
          }],
          xAxes: [{
            ticks: {
                display: false
            }
          }]
        },
        tooltips: {
          callbacks: {
            title: (tooltipItems, data) => {
              const { datasets } = data;
              const { datasetIndex } = tooltipItems[0];
              const { label } = datasets[datasetIndex];
              return label;
            },
            label: (tooltipItem, data) => {
              const { datasets } = data;
              const { index } = tooltipItem;
              const value = datasets[index].data[0];
              return this.props.currency ? `${new Utils().getCurrencySymbol(this.props.currency)}${value}` : value;
            }
          }
        }
      }}
    />
  }
}