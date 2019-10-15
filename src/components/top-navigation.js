import * as React from 'react';
import { Link } from 'react-router-dom'
import { Consumer } from '../context';
import { Row, Col, Menu, Avatar, Icon } from 'antd';
import Credentials from '../utils/credentials';
import toMaterialStyle from 'material-color-hash';
import { OBIMAN_LOGO } from '../constants/app';
import {
  HOME,
  INGREDIENTS,
  PRODUCTS,
  BILLING,
  PAGE_URL_TITLE_MAP
} from '../constants/pages';
import S3ToImage from './s3-to-image';

const { SubMenu, Item, Divider } = Menu;

export default class TopNavigation extends React.Component {
  constructor() {
    super();
    this.state = { selectedKeys: [window.location.hash.replace('#','')] }
  }
  onSelect = ({ selectedKeys }) => this.setState({ selectedKeys });
  render = () => <Consumer>
    {({ currentBusiness, email, avatar, businesses, showBusinessManagement, onBusinessChange }) => <Row
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0px 26px'
      }}
    >
      <Col
        xs={18}
        sm={18}
        md={3}
        lg={3}
        xl={3}
        xxl={3}
      >
        <Link
          style={{ color: '#ddd' }}
          to={HOME}
        >
            {OBIMAN_LOGO}
        </Link>
      </Col>
      <Col
        xs={0}
        sm={0}
        md={21}
        lg={21}
        xl={21}
        xxl={21}
      >
        <Menu
          theme='dark'
          mode='horizontal'
          onSelect={this.onSelect}
          selectedKeys={[currentBusiness.id, ...this.state.selectedKeys.filter(key => key !== currentBusiness.id)]}
          style={{ float: 'right' }}
        >
          {NavItems()}
          {NavAvatarSubMenu(email, avatar, businesses, showBusinessManagement, onBusinessChange)}
        </Menu>
      </Col>
      <Col
        xs={6}
        sm={6}
        md={0}
        lg={0}
        xl={0}
        xxl={0}
      >
        <Menu
          theme='dark'
          mode='horizontal'
          onSelect={this.onSelect}
          selectedKeys={[currentBusiness.id, ...this.state.selectedKeys.filter(key => key !== currentBusiness.id)]}
          style={{ float: 'right' }}
        >
          {NavAvatarSubMenu(email, avatar, businesses, showBusinessManagement, onBusinessChange)}
          <SubMenu title={<Icon style={{ marginRight: 0 }} type='menu' />}>
            {NavItems()}
          </SubMenu>
        </Menu>
      </Col>
    </Row>}
  </Consumer>
}

const NavItems = () => [
  <Item key={INGREDIENTS}>
    <Link to={INGREDIENTS}>
      <span>
        <Icon type='build' />
        {PAGE_URL_TITLE_MAP[INGREDIENTS]}
      </span>
    </Link>
  </Item>,
  <Item key={PRODUCTS}>
    <Link to={PRODUCTS}>
      <span>
        <Icon type='table' />
        {PAGE_URL_TITLE_MAP[PRODUCTS]}
      </span>
  </Link>
  </Item>,
  <Item key={BILLING}>
    <Link to={BILLING}>
      <span>
        <Icon type='calculator' />
        {PAGE_URL_TITLE_MAP[BILLING]}
      </span>
    </Link>
  </Item>
]

const NavAvatarSubMenu = (email, avatar, businesses, showBusinessManagement, onBusinessChange) => <SubMenu
  title={<Avatar
    style={{ ...toMaterialStyle(email), marginBottom: '3px' }}
    src={avatar}
    children={email.substr(0,1).toUpperCase()}
    size='small'
  />}
  >
  {businesses.map(business => <Item
    key={business.id}
    onClick={() => onBusinessChange(business)}
  >
    <span>
      <S3ToImage
        isAvatar
        alt={business.label}
        s3Key={business.logo}
      />
      <span>{business.label}</span>
    </span>
  </Item>)}
  <Item onClick={showBusinessManagement}>Manage businesses</Item>
  <Divider />
  <Item>
    <span>
      <Icon type='logout' />
      <span onClick={() => Credentials.logout()}>Logout</span>
    </span>
  </Item>
</SubMenu>