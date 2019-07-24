import * as React from 'react';
import { Link } from 'react-router-dom'
import { Menu, Drawer } from 'antd';
import {
  HOME,
  MANAGE,
  MANAGE_INGREDIENTS,
  MANAGE_PRODUCTS,
  BILLING,
  BILLING_ALL_OPEN,
  BILLING_NEW,
  BILLING_SEARCH,
  PAGE_URL_TITLE_MAP
} from '../constants/pages';
import { SIDE_NAVIGATION_TITLE } from '../constants/side-navigation';

const { SubMenu, Item } = Menu;

export default class SideNavigation extends React.Component {
  constructor() {
    super();
    const URI = window.location.hash.replace('#','');
    this.state = {
      selectedKeys: [URI],
      openKeys: [`/${URI.split('/')[1]}`]
    }
  }
  onOpenChange = openKeys => this.setState({ openKeys })
  onSelect = ({ selectedKeys }) => this.setState({ selectedKeys })
  render = () => <Drawer
    title={SIDE_NAVIGATION_TITLE}
    placement='left'
    bodyStyle={{ padding: '0px' }}
    closable={true}
    visible={this.props.visible}
    onClose={this.props.onClose}
  >
    <Menu
      style={{ borderRight: 'none' }}
      mode='inline'
      selectedKeys={this.state.selectedKeys}
      openKeys={this.state.openKeys}
      onOpenChange={this.onOpenChange}
      onSelect={this.onSelect}
    >
      <Item key={HOME}>
        <Link to={HOME}>{PAGE_URL_TITLE_MAP[HOME]}</Link>
      </Item>
      <SubMenu key={MANAGE} title={PAGE_URL_TITLE_MAP[MANAGE]}>
        <Item key={MANAGE_INGREDIENTS}>
          <Link to={MANAGE_INGREDIENTS}>{PAGE_URL_TITLE_MAP[MANAGE_INGREDIENTS]}</Link>
        </Item>
        <Item key={MANAGE_PRODUCTS}>
          <Link to={MANAGE_PRODUCTS}>{PAGE_URL_TITLE_MAP[MANAGE_PRODUCTS]}</Link>
        </Item>
      </SubMenu>
      <SubMenu key={BILLING} title={PAGE_URL_TITLE_MAP[BILLING]}>
        <Item key={BILLING_ALL_OPEN}>
          <Link to={BILLING_ALL_OPEN}>{PAGE_URL_TITLE_MAP[BILLING_ALL_OPEN]}</Link>
        </Item>
        <Item key={BILLING_NEW}>
          <Link to={BILLING_NEW}>{PAGE_URL_TITLE_MAP[BILLING_NEW]}</Link>
        </Item>
        {/* <Item key={BILLING_SEARCH}>
          <Link to={BILLING_SEARCH}>{PAGE_URL_TITLE_MAP[BILLING_SEARCH]}</Link>
        </Item> */}
      </SubMenu>
    </Menu>
  </Drawer>;
}