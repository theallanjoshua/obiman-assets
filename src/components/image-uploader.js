import * as React from 'react';
import { Upload, Icon, Card, Typography, Spin } from 'antd';
import pretty from 'prettysize';
import Network from '../utils/network';
import AuditTrail from './audit-trail';
import imageCompression from 'browser-image-compression';

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
        this.setState({ uploadedFile });
      } catch (errorMessage) {
        this.setState({ errorMessage });
      }
      this.setState({ loading: false });
    }
  }
  componentDidMount = () => this.fetchUploadedFile(this.props.s3Key);
  componentDidUpdate = prevProps => {
    const { s3Key: incomingS3Key } = this.props;
    const { s3Key: existingS3Key } = prevProps;
    if(incomingS3Key !== existingS3Key) {
      this.fetchUploadedFile(incomingS3Key);
    }
  }
  onUpload = async ({ file }) => {
    this.setState({ loading: true, errorMessage: '' });
    try {
      if (['image/jpeg', 'image/png'].includes(file.type)) {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 240 }
        const compressedFile = await imageCompression(file, options)
        const s3Key = await Network.uploadFile(compressedFile);
        this.setState({ loading: false, errorMessage: '' });
        this.props.onChange(s3Key);
      } else {
        throw 'Only .jpg and .png files are allowed';
      }
    } catch (errorMessage) {
      this.setState({ loading: false, errorMessage })
    }
  }
  onRemove = async () => this.props.onChange('');
  render = () => !this.props.s3Key ? <Spin tip='Compressing and uploading...' spinning={this.state.loading}>
    <Dragger
      accept='image/jpeg,image/png'
      customRequest={this.onUpload}
      listType='picture'
      showUploadList={{
        showPreviewIcon: true,
        showRemoveIcon: false
      }}
    >
      <p className='ant-upload-drag-icon'>
        <Icon type='picture' />
      </p>
      <p className='ant-upload-text'>Click or drag images to this area to upload</p>
      <p className='ant-upload-hint'>Only .jpg, .jpeg and .png files are allowed</p>
      <p className='ant-upload-hint'>Images will be compressed to less than 1MB</p>
    </Dragger>
  </Spin> :
  <Card
    loading={this.state.loading}
    cover={<img
      style={{
        width: 240,
        height: 160
      }}
      src={this.state.uploadedFile.url}
    />}
    actions={[<Text
      type='danger'
      children={'Remove'}
      onClick={this.onRemove}
    />]}
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