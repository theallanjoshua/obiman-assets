import * as React from 'react';
import { Modal, Button, Typography } from 'antd';
import BillCompositionReadonly from './bill-composition-readonly';
import BillTotal from './bill-total';
import ReactToPrint from 'react-to-print';
import { Consumer } from '../../../context';

const { Title, Paragraph } = Typography;

export default class PrintBill extends React.Component {
  render = () => <Consumer>
    {({ currentBusiness }) => <Modal
      destroyOnClose
      style={{ maxWidth: '90vw' }}
      width={'720px'}
      visible={this.props.visible}
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
          <Title>{currentBusiness.label}</Title>
          <Paragraph>{currentBusiness.address}</Paragraph>
          <Paragraph>{currentBusiness.contact}</Paragraph>
        </div>
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