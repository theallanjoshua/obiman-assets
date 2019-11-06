import * as React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.piecelabel.js';
import rca from 'rainbow-colors-array';
import { Utils } from 'obiman-data-models';

export default class SourcePieChart extends React.Component {
  render = () => <Pie
    data={{
      labels: this.props.sources,
      datasets: [{
        data: this.props.data,
        backgroundColor: rca(this.props.sources.length, 'hex', true).map(({ hex}) => `#${hex}`)
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
      pieceLabel: {
        render: ({ label, value }) => `${label}: ${this.props.currency ? `${new Utils().getCurrencySymbol(this.props.currency)}${value}` : value}`,
        position: this.props.data.filter(item => item).length > 1 ? 'outside' : 'border',
        fontSize: 14
    },
    tooltips: {
      enabled: false
    }
    }}
  />
}