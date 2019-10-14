import * as React from 'react';
import { Upload, Icon, Card, Typography } from 'antd';
import pretty from 'prettysize';
import Network from '../utils/network';
import AuditTrail from './audit-trail';

const { Dragger } = Upload;
const { Meta } = Card;
const { Text } = Typography;

export default class ImageUploader extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      uploadedFile: {}
    };
  }
  fetchUploadedFile = async s3Key => {
    if (s3Key) {
      this.setState({ loading: true, errorMessage: '' });
      try {
        const uploadedFile = await Network.getFile(s3Key);
        this.setState({ uploadedFile, loading: false });
      } catch (errorMessage) {
        this.setState({ errorMessage, loading: false });
      }
    }
  }
  componentDidMount = () => {
    const { s3Key: incomingS3Key } = this.props;
    this.fetchUploadedFile(incomingS3Key);
  }
  componentDidUpdate = prevProps => {
    const { s3Key: incomingS3Key } = this.props;
    const { s3Key: existingS3Key } = prevProps;
    if(incomingS3Key !== existingS3Key) {
      this.fetchUploadedFile(incomingS3Key);
    }
  }
  beforeUpload = file => {
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
  onUpload = async ({ file }) => {
    try {
      const s3Key = await Network.uploadFile(file);
      this.props.onChange(s3Key);
    } catch (errorMessage) {
      this.setState({ errorMessage })
    }
  }
  onRemove = async () => this.props.onChange('');
  render = () => !this.props.s3Key ? <Dragger
    accept='image/jpeg,image/png'
    beforeUpload={this.beforeUpload}
    customRequest={this.onUpload}
    showUploadList={{
      showPreviewIcon: true,
      showRemoveIcon: false
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