import * as React from 'react';
import { Link } from 'react-router-dom'
import { Consumer } from '../context';
import { Row, Col, Menu, Avatar, Icon, Affix } from 'antd';
import { OBIMAN_LOGO } from '../constants/app';
import Credentials from '../utils/credentials';
import toMaterialStyle from 'material-color-hash';
import {
  HOME,
  INGREDIENTS,
  PRODUCTS,
  BILLING,
  PAGE_URL_TITLE_MAP
} from '../constants/pages';
import S3ToImage from './s3-to-image';
import { withRouter } from 'react-router';

const { SubMenu, Item, Divider } = Menu;

const NavItems = ({ isBottom }) => <Consumer>
  {({ currentBusiness, email, avatar, businesses, showBusinessManagement, onBusinessChange }) => <Menu
    theme='dark'
    mode='horizontal'
    selectedKeys={[currentBusiness.id, window.location.hash.replace('#','')]}
    className={isBottom ? 'space-between' : 'right-align'}
  >
    <Item key={INGREDIENTS}>
      <Link to={INGREDIENTS}>
        {isBottom ? <Icon type='build' style={{ marginRight: '0px' }} /> :
        <span>
          <Icon type='build' />
          {PAGE_URL_TITLE_MAP[INGREDIENTS]}
        </span>}
      </Link>
    </Item>
    <Item key={PRODUCTS}>
      <Link to={PRODUCTS}>
      {isBottom ? <Icon type='table' style={{ marginRight: '0px' }} /> :
        <span>
          <Icon type='table' />
          {PAGE_URL_TITLE_MAP[PRODUCTS]}
        </span>}
    </Link>
    </Item>
    <Item key={BILLING}>
      <Link to={BILLING}>
      {isBottom ? <Icon type='calculator' style={{ marginRight: '0px' }} /> :
        <span>
          <Icon type='calculator' />
          {PAGE_URL_TITLE_MAP[BILLING]}
        </span>}
      </Link>
    </Item>
    <SubMenu
      title={<span style={!isBottom ? { borderRight: '1px solid #DDD', paddingRight: '20px' } : {}}>
        <S3ToImage
          isAvatar
          alt={currentBusiness.label}
          s3Key={currentBusiness.logo}
        />
        </span>}
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
          <span style={{ marginLeft: '10px' }}>{business.label}</span>
        </span>
      </Item>)}
      <Divider />
      <Item onClick={showBusinessManagement}>Manage businesses</Item>
    </SubMenu>
    <SubMenu
      title={<Avatar
        style={{ ...toMaterialStyle(email), marginBottom: '3px' }}
        src={avatar}
        children={email.substr(0,1).toUpperCase()}
        size='small'
      />}
      >
      <Item>
        <span>
          <Icon type='logout' />
          <span onClick={() => Credentials.logout()}>Logout</span>
        </span>
      </Item>
    </SubMenu>
  </Menu>}
</Consumer>

class TopNav extends React.Component {
  render = () => <Affix>
    <Row
      className='center-align'
      style={{ padding: '0px 26px', background: '#001529' }}
    >
      <Col
        xs={24}
        sm={24}
        md={6}
        lg={6}
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
        md={18}
        lg={18}
        xl={21}
        xxl={21}
      >
        <NavItems />
      </Col>
    </Row>
  </Affix>
}

class BottomNav extends React.Component {
  render = () => <Affix offsetBottom={0}>
    <Row className='center-align'>
      <Col
        xs={24}
        sm={24}
        md={0}
        lg={0}
        xl={0}
        xxl={0}
      >
        <NavItems isBottom />
      </Col>
    </Row>
  </Affix>
}

export const TopNavigation = withRouter(TopNav);
export const BottomNavigation = withRouter(BottomNav);