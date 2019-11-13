import * as React from 'react';
import { Line } from 'react-chartjs-2';
import rca from 'rainbow-colors-array';
import { Utils } from 'obiman-data-models';
import moment from 'moment';

const getTrendFormats = date => [date.format('YYYY'), date.format('MMM YYYY'), `${date.format('YYYY')} Week ${date.format('WW')}`, date.format('MMM Do')];

export default class TrendChart extends React.Component {
  render = () => {
    const groupedData = this.props.group ? this.props.group(this.props.data) : [{ label: this.props.label, data: this.props.data }];
    const lineColors = rca(groupedData.length, 'hex').map(({ hex }) => `#${hex}`);
    const lineAreaColors = rca(groupedData.length, 'rgb', true).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b}, 0.5)`);
    const yearsInRange = moment(this.props.rangeEnd).diff(moment(this.props.rangeStart), 'years');
    const monthsInRange = moment(this.props.rangeEnd).diff(moment(this.props.rangeStart), 'months');
    const weeksInRange = moment(this.props.rangeEnd).diff(moment(this.props.rangeStart), 'weeks');
    const daysInRange = moment(this.props.rangeEnd).diff(moment(this.props.rangeStart), 'days');
    const labels = yearsInRange > 1 ? [ ...new Array(yearsInRange + 1) ].reduce((acc, item, index) => [ ...acc, getTrendFormats(moment(this.props.rangeStart).add(index, 'years'))[0] ], []) :
      monthsInRange > 1 ? [ ...new Array(monthsInRange + 1) ].reduce((acc, item, index) => [ ...acc, getTrendFormats(moment(this.props.rangeStart).add(index, 'months'))[1] ], []) :
      weeksInRange > 1 ? [ ...new Array(weeksInRange + 1) ].reduce((acc, item, index) => [ ...acc, getTrendFormats(moment(this.props.rangeStart).add(index, 'weeks'))[2] ], []) :
      daysInRange > 1 ? [ ...new Array(daysInRange + 1) ].reduce((acc, item, index) => [ ...acc, getTrendFormats(moment(this.props.rangeStart).add(index, 'days'))[3] ], []) : [];
    const datasets = groupedData.map(({ label, data }, index) => ({
      label,
      data: labels.map(label => this.props.reduce(data.filter(({ updatedDate }) => getTrendFormats(moment(updatedDate)).includes(label)))),
      borderColor: lineColors[index],
      backgroundColor: lineAreaColors[index],
      borderWidth: 1
    }));
    return labels.length ? <Line
    height={300}
    data={{
      labels,
      datasets
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
        }]
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const { datasets } = data;
            const { value, datasetIndex } = tooltipItem;
            const label = datasets[datasetIndex].label
            return `${label}: ${this.props.currency ? `${new Utils().getCurrencySymbol(this.props.currency)}${value}` : value}`
          }
        }
      }
    }}
  /> : null;
  }
}