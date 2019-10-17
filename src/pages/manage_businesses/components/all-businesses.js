import * as React from 'react';
import { List, Button, Empty, Typography } from 'antd';
import { OBIMAN_LOGO } from '../../../constants/app';
import Credentials from '../../../utils/credentials';
import { Business } from 'obiman-data-models';
import S3ToImage from '../../../components/s3-to-image';

const { Text } = Typography;

export default class AllBusinesses extends React.Component {
  render = () => <div className='center-align' style={{ height: '100vh' }}>
    <div style={{ width: 'min-content' }}>
      <List
        style={{
          width: '500px',
          maxWidth: '80vw',
          border: '1px solid #DDD',
          borderRadius: '5px'
        }}
        loading={this.props.loading}
        itemLayout='horizontal'
        header={<div className='center-align'>
          <div>
            {OBIMAN_LOGO}
          </div>
        </div>}
        locale={{
          emptyText: <Empty description='No businesses' />
        }}
        dataSource={this.props.businesses}
        renderItem={business =>  <List.Item
          className={`business-list-item${this.props.enableEdit ? `` : ` clickable`}`}
          style={{
            padding: 0
          }}
          onClick={this.props.enableEdit ? () => {} : () => this.props.onBusinessChange(business)}
        >
          <div className='center-align'>
            <List.Item.Meta
              avatar={<S3ToImage
                isAvatar
                alt={business.label}
                s3Key={business.logo}
              />}
              title={business.label}
            />
            {this.props.enableEdit && business.employees.filter(employee => employee.id === this.props.email && employee.permissions.includes(new Business().getUpdatePermissionText())).length ? <Button
              type='link'
              icon='edit'
              children='Edit'
              onClick={() => this.props.showEditModal(business)}
            /> : null}
          </div>
        </List.Item>}
        footer={!this.props.loading ? <Button
          type='link'
          children='Create a new business'
          onClick={this.props.showAddModal}
        /> : null}
      />
      {this.props.enableEdit ? <div
        className='center-align'
        style={{
          width: '100%',
          marginTop: '40px'
        }}
      >
        <Button
          type='primary'
          children={'Done'}
          onClick={this.props.hideBusinessManagement}
        />
      </div> : <div>
        <br />
        <Text>Don't see your business here? </Text>
        <Button
          type='link'
          style={{ padding: 0 }}
          children={'Login with a different account'}
          onClick={Credentials.logout}
        />
      </div>}
    </div>
  </div>;
}