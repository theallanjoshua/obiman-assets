import * as React from 'react';
import Network from '../utils/network';
import { Avatar } from 'antd';
import toMaterialStyle from 'material-color-hash';

export default class S3ToImage extends React.Component {
  constructor() {
    super();
    this.state = {
      src: '',
      errorMessage: ''
    }
  }
  componentDidMount = () => this.fetchSrc(this.props.s3Key);
  componentDidUpdate = prevProps => {
    if(this.props.s3Key !== prevProps.s3Key) {
      this.fetchSrc(this.props.s3Key);
    }
  }
  fetchSrc = async s3Key => {
    if (s3Key) {
      try {
        const { url } = await Network.getFile(s3Key);
        this.setState({ src: url });
      } catch (errorMessage) {
        this.setState({ errorMessage });
      }
    } else {
      this.setState({ src: '' });
    }
  }
  render = () => this.props.isAvatar ? <Avatar
    style={{ ...(!this.state.src ? toMaterialStyle(this.props.alt) : { background: '#FFF' }) }}
    children={(this.props.alt || '').substr(0,1).toUpperCase()}
    size='small'
    src={this.state.src}
  /> : this.state.src ? <img
    src={this.state.src}
    alt={this.props.alt}
    style={{ maxWidth: '100%' }}
  /> :  null;
}