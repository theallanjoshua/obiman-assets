import * as React from 'react';
import { Link } from 'react-router-dom'
import { Consumer } from '../context';
import { Row, Col, Menu, Avatar, Icon, Affix } from 'antd';
import { OBIMAN_LOGO } from '../constants/app';
import Credentials from '../utils/credentials';
import toMaterialStyle from 'material-color-hash';
import {
  HOME,
  BUSINESS,
  BUSINESS_EDIT,
  INGREDIENTS,
  PRODUCTS,
  BILLS,
  ORDERS,
  PAGE_URL_TITLE_MAP,
  BUSINESS_SPECIFIC_URL_MAP
} from '../constants/pages';
import S3ToImage from './s3-to-image';
import { withRouter } from 'react-router';
import { getCurrentBusinessId } from '../utils/businesses';

const { SubMenu, Item, Divider } = Menu;

const NavItems = ({ isBottom }) => {
  const businessId = getCurrentBusinessId();
  return businessId ? <Consumer>
    {({ currentBusiness }) => <Menu
      theme='dark'
      mode='horizontal'
      selectedKeys={[window.location.hash.replace(`#/${BUSINESS}/${businessId}`,'')]}
      className={isBottom ? 'space-between' : 'right-align'}
    >
      <Item key={ORDERS}>
        <Link to={BUSINESS_SPECIFIC_URL_MAP[ORDERS]}>
        {isBottom ? <Icon type='shopping' style={{ marginRight: '0px' }} /> :
          <span>
            <Icon type='shopping' />
            {PAGE_URL_TITLE_MAP[ORDERS]}
          </span>}
        </Link>
      </Item>
      <Item key={BILLS}>
        <Link to={BUSINESS_SPECIFIC_URL_MAP[BILLS]}>
        {isBottom ? <Icon type='container' style={{ marginRight: '0px' }} /> :
          <span>
            <Icon type='container' />
            {PAGE_URL_TITLE_MAP[BILLS]}
          </span>}
        </Link>
      </Item>
      <Item key={PRODUCTS}>
        <Link to={BUSINESS_SPECIFIC_URL_MAP[PRODUCTS]}>
          {isBottom ? <Icon type='table' style={{ marginRight: '0px' }} /> :
          <span>
            <Icon type='table' />
            {PAGE_URL_TITLE_MAP[PRODUCTS]}
          </span>}
        </Link>
      </Item>
      <Item key={INGREDIENTS}>
        <Link to={BUSINESS_SPECIFIC_URL_MAP[INGREDIENTS]}>
        {isBottom ? <Icon type='build' style={{ marginRight: '0px' }} /> :
          <span>
            <Icon type='build' />
            {PAGE_URL_TITLE_MAP[INGREDIENTS]}
          </span>}
        </Link>
      </Item>
      <Item>
        <Link to={BUSINESS_EDIT}>
          <span>
            <S3ToImage
              isAvatar
              alt={currentBusiness.label}
              s3Key={currentBusiness.logo}
            />
          </span>
        </Link>
      </Item>
    </Menu>}
  </Consumer>  : null
}

class TopNav extends React.Component {
  render = () => <Consumer>
    {({ email, avatar }) => <Affix>
      <Row
        className='center-align'
        style={{ padding: '0px 26px', background: '#001529' }}
      >
        <Col
          xs={20}
          sm={20}
          md={5}
          lg={5}
          xl={3}
          xxl={3}
        >
          <Link
            to={HOME}
            style={{ color: '#ddd' }}
          >
            {OBIMAN_LOGO}
          </Link>
        </Col>
        <Col
          xs={0}
          sm={0}
          md={17}
          lg={17}
          xl={20}
          xxl={20}
        >
          <NavItems />
        </Col>
        <Col
          xs={4}
          sm={4}
          md={2}
          lg={2}
          xl={1}
          xxl={1}
        >
          <Menu
            theme='dark'
            mode='horizontal'
            className='center-align'
          >
            <SubMenu
              title={<Avatar
                style={{ ...toMaterialStyle(email), marginBottom: '3px' }}
                src={avatar}
                children={email.substr(0,1).toUpperCase()}
                size='small'
              />}
              >
              <Item>
                <Link to={getCurrentBusinessId() ? HOME : BUSINESS}>
                  <span>
                    <Icon type='sync' />
                    <span>{`Switch to ${getCurrentBusinessId() ? 'customer' : 'business'} view`}</span>
                  </span>
                </Link>
              </Item>
              <Divider />
              <Item>
                <span>
                  <Icon type='logout' />
                  <span onClick={() => Credentials.logout()}>Logout</span>
                </span>
              </Item>
            </SubMenu>
          </Menu>
        </Col>
      </Row>
    </Affix>}
  </Consumer>
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