import * as React from 'react';
import Credentials from '../utils/credentials';
import { Upload, Icon, Card, Tooltip, Typography } from 'antd';
import Network from '../utils/network';
import pretty from 'prettysize';
import { DATE_TIME_FORMAT } from '../constants/app';
import moment from 'moment';

const { Dragger } = Upload;
const { Meta } = Card;
const { Text } = Typography;

export default class ImageUploader extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      authorization: '',
      uploadedFile: {}
    };
  }
  componentDidMount = () => {
    const { s3Key: incomingS3Key } = this.props;
    this.setPreviewUrl(incomingS3Key);
    this.authorize();
  }
  componentDidUpdate = prevProps => {
    const { s3Key: incomingS3Key } = this.props;
    const { s3Key: existingS3Key } = prevProps;
    if(incomingS3Key !== existingS3Key) {
      this.setPreviewUrl(incomingS3Key);
      this.authorize();
    }
  }
  setPreviewUrl = async s3Key => {
    if (s3Key) {
      this.setState({ loading: true, errorMessage: '' });
      try {
        const uploadedFile = await Network.get(`/api/file/${s3Key}`);
        this.setState({ uploadedFile, loading: false });
      } catch (errorMessage) {
        this.setState({ errorMessage, loading: false });
      }
    }
  }
  authorize = async () => {
    const authorization = await Credentials.getAuthorizationToken();
    this.setState({ authorization });
  }
  beforeUpload = async file => {
    try {
      await this.authorize();
      const isJpgOrPng = ['image/jpeg', 'image/png'].includes(file.type);
      if (!isJpgOrPng) {
        this.setState({ errorMessage: 'You can only upload JPG/PNG file!' });
        return false;
      }
      const isLt2M = file.size / (1024 * 1024) < 2;
      if (!isLt2M) {
        this.setState({ errorMessage: 'Image must smaller than 2MB!' });
        return false;
      }
      return true;
    } catch (errorMessage) {
      this.setState({ errorMessage });
      return false;
    }
  }
  onRemove = async () => {
    // this.setState({ loading: true, errorMessage: '' });
    // try {
    //   await Network.delete(`/api/file/${this.props.s3Key}`);
    //   await this.setState({ loading: false });
    //   this.props.onChange('');
    // } catch (errorMessage) {
    //   this.setState({ errorMessage, loading: false });
    // }
    this.props.onChange('');
  }
  render = () => !this.props.s3Key ? <Dragger
    name='file'
    accept='image/jpeg,image/png'
    beforeUpload={this.beforeUpload}
    action={'/api/file'}
    headers={{ authorization: this.state.authorization }}
    onChange={({ file }) => {
      const { status, response } = file;
      if (status === 'done') {
        const { output: { s3Key } } = response;
        this.props.onChange(s3Key);
      }
    }}
  >
    <p className='ant-upload-drag-icon'>
      <Icon type='inbox' />
    </p>
    <p className='ant-upload-text'>Click or drag file to this area to upload</p>
    <p className='ant-upload-hint'>Only .jpg and .png files are allowed</p>
    <p className='ant-upload-hint'>File size cannot exceed 2MB</p>
  </Dragger> :
  <Card
    loading={this.state.loading}
    cover={<img src={this.state.uploadedFile.url} />}
    actions={[<Text type='danger' onClick={this.onRemove} children={'Remove'} />]}
  >
    <Meta
      title={`${this.state.uploadedFile.label} (${pretty(this.state.uploadedFile.size)})`}
      description={<div>
        Uploaded by{' '}
        <span>{this.state.uploadedFile.createdBy}</span>
        {' '}
        <span>{<Tooltip title={`${moment(Number(this.state.uploadedFile.createdDate)).format(DATE_TIME_FORMAT)}`} children={`${moment(Number(this.state.uploadedFile.createdDate)).fromNow()}`} />}</span>
      </div>}
    />
  </Card>
}