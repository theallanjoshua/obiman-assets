import * as React from 'react';
import { List, Avatar, Button, Empty } from 'antd';
import { OBIMAN_LOGO } from '../../../constants/app';
import toMaterialStyle from 'material-color-hash';

export default class AllBusinesses extends React.Component {
  render = () => <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }}>
    <div>
      <List
        style={{
          width: '500px',
          maxWidth: '80vw',
          border: '1px solid #DDD',
          borderRadius: '5px'
        }}
        loading={this.props.loading}
        itemLayout='horizontal'
        header={<div style={{ display: 'flex', justifyContent: 'center'}}>
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
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <List.Item.Meta
              avatar={<Avatar
                style={{ ...toMaterialStyle(business.label), marginRight: '10px' }}
                children={business.label.substr(0,1).toUpperCase()}
                size='small'
                src={business.logo}
              />}
              title={business.label}
            />
            {this.props.enableEdit ? <Button
              type='link'
              icon='edit'
              children='Edit'
              onClick={() => this.props.showEditModal(business)}
            /> : null}
          </div>
        </List.Item>}
        footer={<Button
          type='link'
          children='Create a new business'
          onClick={this.props.showAddModal}
        />}
      />
      {this.props.enableEdit ? <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '40px'
        }}
      >
        <Button
          type='primary'
          children={'Done'}
          onClick={this.props.hideBusinessManagement}
        />
      </div>: null}
    </div>
  </div>;
}