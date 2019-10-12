import * as React from 'react';
import Credentials from '../utils/credentials';
import { Upload, Icon, Card, Typography } from 'antd';
import pretty from 'prettysize';
import { FILE_API_URL } from '../constants/endpoints';
import AuditTrail from './audit-trail';
import { fetchS3Object } from '../utils/s3';

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
  authorize = async () => {
    const authorization = await Credentials.getAuthorizationToken();
    this.setState({ authorization });
  }
  fetchUploadedFile = async s3Key => {
    if (s3Key) {
      this.setState({ loading: true, errorMessage: '' });
      try {
        const uploadedFile = await fetchS3Object(s3Key);
        this.setState({ uploadedFile, loading: false });
      } catch (errorMessage) {
        this.setState({ errorMessage, loading: false });
      }
    }
  }
  componentDidMount = () => {
    const { s3Key: incomingS3Key } = this.props;
    this.fetchUploadedFile(incomingS3Key);
    this.authorize();
  }
  componentDidUpdate = prevProps => {
    const { s3Key: incomingS3Key } = this.props;
    const { s3Key: existingS3Key } = prevProps;
    if(incomingS3Key !== existingS3Key) {
      this.fetchUploadedFile(incomingS3Key);
      this.authorize();
    }
  }
  beforeUpload = file => {
    this.authorize();
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
  }
  onRemove = async () => {
    // this.setState({ loading: true, errorMessage: '' });
    // try {
    //   await Network.delete(FILE_API_URL(this.props.s3Key));
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
    action={FILE_API_URL()}
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
      description={<AuditTrail
        prefixText={'Uploaded'}
        date={this.state.uploadedFile.createdDate}
        user={this.state.uploadedFile.createdBy}
      />}
    />
  </Card>
}