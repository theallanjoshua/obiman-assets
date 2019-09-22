import * as React from 'react';
import { Spin, Card, Button, Table, Statistic, Empty, Typography, Tooltip, Avatar } from 'antd';
import { Utils } from 'obiman-data-models';
import { EDIT_BILL_BUTTON_TEXT } from '../../../constants/manage-billing';
import { DATE_TIME_FORMAT } from '../../../constants/app';
import moment from 'moment';
import toMaterialStyle from 'material-color-hash';

const { Text } = Typography;

export default class AllBills extends React.Component {
  render = () => <Spin spinning={this.props.loading}>
  {this.props.bills.length ?
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {this.props.bills.map(bill => <Card
        key={bill.id}
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '90vw',
          width: '300px',
          margin: '5px'
        }}
        bodyStyle={{ flexGrow: 1 }}
        title={<div>
          <Text type='secondary' style={{ fontSize: 'x-small' }}>
            {`Created `}
            <Tooltip title={`${moment(bill.createdDate).format(DATE_TIME_FORMAT)}`} children={`${moment(bill.createdDate).fromNow()}`} />
            {` by `}
            <Tooltip title={bill.createdBy} children={
              <Avatar
                style={{ ...toMaterialStyle(bill.createdBy) }}
                children={bill.createdBy.substr(0,1).toUpperCase()}
                size='small'
              />
            } />
          </Text>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
          }}>
            {bill.label}
            <Button
              style={{ padding: 0 }}
              type='link'
              icon='edit'
              children={EDIT_BILL_BUTTON_TEXT}
              onClick={() => this.props.showEditModal(bill)}
            />
          </div>
          {bill.updatedDate ?
            <Text type='secondary' style={{ fontSize: 'x-small' }}>
              {`Last edited `}
              <Tooltip title={`${moment(bill.updatedDate).format(DATE_TIME_FORMAT)}`} children={` ${moment(bill.updatedDate).fromNow()}`} />
              {` by `}
              <Tooltip title={bill.updatedBy} children={
                <Avatar
                  style={{ ...toMaterialStyle(bill.updatedBy) }}
                  children={bill.updatedBy.substr(0,1).toUpperCase()}
                  size='small'
                />
              } />
            </Text>
          : null}
        </div>}
        children={<div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <Table
            columns={[
              { dataIndex: 'label' },
              { dataIndex: 'quantity' },
              { render: (text, { price }) => <Statistic
                style={{ float: 'right' }}
                precision={2}
                prefix={new Utils().getCurrencySymbol(this.props.currency)}
                value={price}
                valueStyle={{ fontSize: 'initial' }}
              /> }
           ]}
            dataSource={bill.composition.map(entity => ({ ...entity, key: entity.id }))}
            showHeader={false}
            pagination={false}
          />
          <br />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexGrow: 1
          }} >
            <strong>To pay:</strong>
            <Statistic
              precision={2}
              prefix={new Utils().getCurrencySymbol(this.props.currency)}
              value={bill.total}
              valueStyle={{ color: '#cf1322' }}
            />
          </div>
        </div>}
      />)}
    </div> :
  <Empty description='No bills available' />}
</Spin>
}