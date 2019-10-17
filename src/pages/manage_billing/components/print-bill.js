import * as React from 'react';
import { Modal, Button, Typography, Icon } from 'antd';
import BillCompositionReadonly from './bill-composition-readonly';
import BillTotal from './bill-total';
import ReactToPrint from 'react-to-print';
import { Consumer } from '../../../context';
import S3ToImage from '../../../components/s3-to-image';
import moment from 'moment';
import { DATE_TIME_FORMAT } from '../../../constants/app';

const { Title, Paragraph, Text } = Typography;

export default class PrintBill extends React.Component {
  render = () => <Consumer>
    {({ currentBusiness }) => <Modal
      destroyOnClose
      style={{ maxWidth: '90vw' }}
      width={'720px'}
      visible={this.props.visible}
      onCancel={this.props.hideModal}
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
            onClick={() => this.props.showPrintModal(bill)}
          />}
          content={() => this.billRef}
        />
      </div>}
    >
      <div ref={billRef => this.billRef = billRef}>
        <div  className='flex-column center-align'>
          {currentBusiness.logo ? <S3ToImage
            alt={currentBusiness.label}
            s3Key={currentBusiness.logo}
          /> : null}
          <Title>{currentBusiness.label}</Title>
          {currentBusiness.address ? <div className='center-align'>
            <Icon type='home' style={{ paddingRight: '8px' }} />
            <Paragraph>{currentBusiness.address}</Paragraph>
          </div> : null}
          {/* {(currentBusiness.contacts || []).reduce((acc, contact) => {
            const potentialContactGroup = acc.filter(contactGroup => contactGroup.length < 3)[0] || [];
            return [ ...acc.filter(contactGroup => contactGroup.length === 3), [ ...potentialContactGroup, contact ] ]
          }, [])} */}
          <div className='flex-wrap space-between'>
            {(currentBusiness.contacts || []).map(({ type, info }) => <div key={type}>
              <Icon type={type} style={{ paddingRight: '8px' }} />
              <Text style={{ paddingRight: '20px' }}>{info}</Text>
            </div>)}
          </div>
        </div>
        <br />
        <div className='space-between'>
          <div className='flex-column'>
            <Text>
              <Text strong>Order ID: </Text>
              {this.props.billToPrint.id}
            </Text>
            <Text>
              <Text strong>Customer info: </Text>
              {this.props.billToPrint.customer}
            </Text>
          </div>
          <div className='flex-column'>
            <Text>
              <Text strong>Date: </Text>
              {moment(Number(this.props.billToPrint.createdDate)).format(DATE_TIME_FORMAT)}
            </Text>
            <Text>
              <Text strong>Duration: </Text>
              {moment.duration(moment(Number(this.props.billToPrint.updatedDate || Date.now())).diff(Number(this.props.billToPrint.createdDate))).humanize()}
            </Text>
            </div>
        </div>
        <br />
        <BillCompositionReadonly
          composition={this.props.billToPrint.composition}
          currency={currentBusiness.currency}
        />
        <BillTotal
          bill={this.props.billToPrint}
          currency={currentBusiness.currency}
        />
      </div>
    </Modal>}
  </Consumer>;
}