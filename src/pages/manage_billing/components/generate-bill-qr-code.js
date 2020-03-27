import * as React from 'react';
import { Button, Form, Select, Input, Modal, Collapse } from 'antd';
import QRGenerator from 'qrcode.react';
import { Bill } from 'obiman-data-models';
import ReactToPrint from 'react-to-print';

const { Panel } = Collapse;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 15 }
  }
};

const formValidation = (showValidationErrors, validationErrors = []) => ({
  validateStatus: showValidationErrors ? validationErrors.length ? 'error' : 'success' : '',
  help: showValidationErrors ? validationErrors.length > 1 ? <ul>
    {validationErrors.map(error => <li key={error}>{error}</li>)}
  </ul> : validationErrors.join(',') : undefined
})

export default class GenerateBillQrCode extends React.Component {
  constructor() {
    super();
    this.state = {
      source: '',
      sourceId: '',
      qrCodesToPrint: []
    }
  }
  setSource = source => this.setState({ source });
  setSourceId = e => this.setState({ sourceId: e.target.value });
  addQrCodeToPrint = () => {
    const { qrCodesToPrint } = this.state;
    this.setState({ qrCodesToPrint: [ ...qrCodesToPrint, this.getQrCodeValue()] });
  }
  getQrCodeValue = () => {
    const { source, sourceId } = this.state;
    const { businessId } = this.props;
    return encodeURI(JSON.stringify({
      source,
      sourceId,
      businessId
    }))
  }
  render = () => {
    const { source, sourceId, qrCodesToPrint } = this.state;
    const { visible, hideModal, sources } = this.props;
    const billData = { source, sourceId };
    const bill = new Bill(billData);
    const validationErrors = bill.validate();
    const hasErrors = !!Object.keys(billData).filter(key => validationErrors[key]).length;
    return <Modal
      destroyOnClose
      maskClosable={false}
      title={'Generate QR Code'}
      okText={'Print'}
      style={{ maxWidth: '90vw' }}
      width={'720px'}
      visible={visible}
      onCancel={hideModal}
      footer={<div className='right-align'>
        <Button
          children={'Cancel'}
          onClick={this.props.hideModal}
        />
        <ReactToPrint
          trigger={() => <Button
            type='primary'
            icon='printer'
            children={'Print'}
            disabled={!qrCodesToPrint.length}
          />}
          content={() => this.qrCodeRef}
        />
      </div>}
    >
      <Form>
        <Form.Item
          { ...formItemLayout }
          label={'Source'}
          required
          hasFeedback
          { ...formValidation(true, validationErrors.source) }
          children={
            <Select
              showSearch
              allowClear
              filterOption
              placeholder={'Eg: Uber eats'}
              optionFilterProp='children'
              value={billData.source || undefined}
              onChange={this.setSource}
            >
              {sources.map(source => <Select.Option key={source} value={source} children={source}/>)}
            </Select>
          }
        />
        <Form.Item
          { ...formItemLayout }
          label={'Source ID'}
          required
          hasFeedback
          { ...formValidation(true, validationErrors.sourceId) }
          children={
            <Input
              placeholder={'Eg: 12444666666'}
              value={billData.sourceId}
              onChange={this.setSourceId}
            />
          }
        />
        {!hasErrors? <Form.Item
          { ...formItemLayout }
          label={'QR Code'}
          children={<div className='flex-wrap vertical-center-align'>
            <QRGenerator
              value={this.getQrCodeValue()}
              renderAs='svg'
            />
            <Button
              style={{ marginLeft: '20px' }}
              icon='plus'
              children={'Add to print'}
              onClick={this.addQrCodeToPrint}
            />
          </div>}
        /> : null}
        <Collapse>
          <Panel header={`QR Codes to print (${qrCodesToPrint.length})`}>
            <div className='flex-wrap' ref={qrCodeRef => this.qrCodeRef = qrCodeRef}>
              {qrCodesToPrint.map(qrCode => {
                const { source, sourceId } = JSON.parse(decodeURI(qrCode));
                return <span className='flex-column' style={{ margin: '10px' }}>
                  <span>{source} {sourceId}</span>
                  <QRGenerator
                    value={qrCode}
                    renderAs='svg'
                  />
                </span>
              })}
            </div>
          </Panel>
        </Collapse>
      </Form>
    </Modal>
  }
}