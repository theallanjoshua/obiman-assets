import * as React from 'react';
import { Avatar } from 'antd';
import toMaterialStyle from 'material-color-hash';
import { fetchS3Object } from '../utils/s3';

export default class BusinessAvatar extends React.Component {
  constructor() {
    super();
    this.state = {
      src: '',
      errorMessage: ''
    }
  }
  componentDidMount = () => this.fetchSrc(this.props.logo);
  componentDidUpdate = prevProps => {
    if(this.props.logo !== prevProps.logo) {
      this.fetchSrc(this.props.logo);
    }
  }
  fetchSrc = async logo => {
    if (logo) {
      try {
        const { url } = await fetchS3Object(logo);
        this.setState({ src: url });
      } catch (errorMessage) {
        this.setState({ errorMessage });
      }
    } else {
      this.setState({ src: '' });
    }
  }
  render = () => <Avatar
    style={{ ...toMaterialStyle(this.props.name), marginRight: '10px' }}
    children={(this.props.name || '')
      .split(' ')
      .filter((value, index) => index < 2)
      .map(value => value.substr(0,1).toUpperCase())
      .join('')}
    size='small'
    src={this.state.src}
  />
}