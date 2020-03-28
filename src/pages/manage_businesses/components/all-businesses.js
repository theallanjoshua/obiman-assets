import * as React from 'react';
import { Link } from 'react-router-dom'
import { List, Button, Empty, Typography } from 'antd';
import { BUSINESS } from '../../../constants/pages';
import Credentials from '../../../utils/credentials';
import S3ToImage from '../../../components/s3-to-image';

const { Text } = Typography;
const getLinkedListItem = (listItem, linkTo) => linkTo ? <Link to={linkTo}>{listItem}</Link> : listItem;

export default class AllBusinesses extends React.Component {
  render = () => <div className='center-align'>
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
        locale={{
          emptyText: <Empty description='No businesses' />
        }}
        dataSource={this.props.businesses}
        renderItem={business =>  getLinkedListItem(<List.Item
          className={'business-list-item'}
          style={{ padding: 0 }}
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
            {this.props.enableEdit && business.employees.length ? <Button
              type='link'
              icon='edit'
              children='Edit'
              onClick={() => this.props.showEditModal(business)}
            /> : null}
          </div>
        </List.Item>, this.props.enableEdit ? '' : `${BUSINESS}/${business.id}`)}
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
        <Link to={BUSINESS}>
          <Button
            type='primary'
            children={'Done'}
          />
        </Link>
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