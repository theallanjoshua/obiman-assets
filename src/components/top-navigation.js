import * as React from 'react';
import { Link } from 'react-router-dom'
import { Consumer } from '../context';
import { Menu, Avatar, Icon, Badge } from 'antd';
import Credentials from '../utils/credentials';
import toMaterialStyle from 'material-color-hash';
import { OBIMAN_LOGO } from '../constants/app';
import {
  HOME
} from '../constants/pages';

const { SubMenu, Item, Divider } = Menu;

export default class TopNavigation extends React.Component {
  render = () => <Consumer>
      {({ email, avatar, businesses, businessId, showBusinessManagement, onBusinessChange }) =>< Menu
      theme='dark'
      mode='horizontal'
      style={{
        padding: '0px 6px 0px 1px'
      }}
      selectedKeys={[businessId]}
    >
      <Item>
        <Link to={HOME}>{OBIMAN_LOGO}</Link>
      </Item>
      <SubMenu
        title={<Avatar
          style={{ ...toMaterialStyle(email), marginBottom: '6px' }}
          src={avatar}
          children={email.substr(0,1).toUpperCase()}
          size='small'
        />}
        style={{ float: 'right' }}
      >
        {businesses.map(({ id, logo, label, currency }) => <Item
          key={id}
          onClick={() => onBusinessChange({ id, currency })}
        >
          <span>
            <Avatar
              style={{ ...toMaterialStyle(label), marginRight: '10px' }}
              src={logo}
              children={label.substr(0,1).toUpperCase()}
              size='small'
            />
            <span>{label}</span>
          </span>
        </Item>)}
        <Item onClick={showBusinessManagement}>Manage businesses</Item>
        <Divider />
        <Item>
          <span>
            <Icon type='user' />
            <span>Account</span>
          </span>
        </Item>
        <Item>
          <span>
            <Icon type='logout' />
            <span onClick={() => Credentials.logout()}>Logout</span>
          </span>
        </Item>
      </SubMenu>
      {/* <SubMenu
        title={<Badge
          count={2}
          style={{ boxShadow: 'none', transform: 'scale(0.8)' }}
          offset={[4, -6]}
        >
          <Icon type='bell' theme='filled' style={{ fontSize: '16px' }} />
        </Badge>}
        style={{ float: 'right' }}
      >
        <Item>Notification 1</Item>
        <Item>Notification 2</Item>
      </SubMenu> */}
    </Menu>}
  </Consumer>
}