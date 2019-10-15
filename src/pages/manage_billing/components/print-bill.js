import * as React from 'react';
import { Modal, Button, Typography, Icon } from 'antd';
import BillCompositionReadonly from './bill-composition-readonly';
import BillTotal from './bill-total';
import ReactToPrint from 'react-to-print';
import { Consumer } from '../../../context';
import S3ToImage from '../../../components/s3-to-image';

const { Title, Paragraph, Text } = Typography;

export default class PrintBill extends React.Component {
  render = () => <Consumer>
    {({ currentBusiness }) => <Modal
      destroyOnClose
      style={{ maxWidth: '90vw' }}
      width={'720px'}
      visible={this.props.visible}
      onCancel={this.props.hideModal}
      footer={<div style={{
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {currentBusiness.logo ? <S3ToImage
            alt={currentBusiness.label}
            s3Key={currentBusiness.logo}
          /> : null}
          <Title>{currentBusiness.label}</Title>
          {currentBusiness.address ? <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <Icon type='home' style={{ paddingRight: '8px' }} />
            <Paragraph>{currentBusiness.address}</Paragraph>
          </div> : null}
          {(currentBusiness.contacts || []).reduce((acc, contact) => {
            const potentialContactGroup = acc.filter(contactGroup => contactGroup.length < 3)[0] || [];
            return [ ...acc.filter(contactGroup => contactGroup.length === 3), [ ...potentialContactGroup, contact ] ]
          }, []).map(contactGroup => <div key={contactGroup[0].type} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Icon type={contactGroup[0].type} style={{ paddingRight: '8px' }} />
              <Text style={{ paddingRight: '20px' }}>{contactGroup[0].info}</Text>
            </div>
            {contactGroup[1] ? <div>
              <Icon type={contactGroup[1].type} style={{ paddingRight: '8px' }} />
              <Text style={{ paddingRight: '20px' }}>{contactGroup[1].info}</Text>
            </div> : null}
            {contactGroup[2] ? <div>
              <Icon type={contactGroup[2].type} style={{ paddingRight: '8px' }} />
              <Text style={{ paddingRight: '20px' }}>{contactGroup[2].info}</Text>
            </div> : null}
          </div>)}
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