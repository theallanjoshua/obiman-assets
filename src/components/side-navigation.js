import * as React from 'react';
import { Link } from 'react-router-dom'
import { Menu, Icon, Drawer, Layout } from 'antd';
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
import { OBIMAN_LOGO } from '../constants/app';

const { Sider } = Layout;
const { SubMenu, Item } = Menu;

export default class SideNavigation extends React.Component {
  constructor() {
    super();
    const URI = window.location.hash.replace('#','');
    this.state = {
      isDrawer: false,
      isCollapsed: false,
      selectedKeys: [URI],
      openKeys: [`/${URI.split('/')[1]}`]
    }
  }
  onOpenChange = openKeys => this.setState({ openKeys });
  onSelect = ({ selectedKeys }) => this.setState({ selectedKeys });
  onCollapse = (isCollapsed = true) => this.setState({ isCollapsed });
  onBreakpoint = broken => this.setState({ isDrawer: broken });
  render = () => <React.Fragment>
    {this.state.isDrawer ? <Drawer
    title={OBIMAN_LOGO}
    placement='left'
    bodyStyle={{ padding: '0px' }}
    closable
    visible={!this.state.isCollapsed}
    onClose={this.onCollapse}
    children={<SideNavigationMenu
      selectedKeys={this.state.selectedKeys}
      openKeys={this.state.openKeys}
      onOpenChange={this.onOpenChange}
      onSelect={this.onSelect}
    />}
  /> : null}
  <Sider
    theme='light'
    breakpoint={'md'}
    collapsible
    collapsed={this.state.isDrawer || this.state.isCollapsed}
    collapsedWidth={0}
    onCollapse={this.onCollapse}
    onBreakpoint={this.onBreakpoint}
    trigger={this.state.isCollapsed ? <Icon type='menu' /> : <Icon type='close' />}
    children={<SideNavigationMenu
      selectedKeys={this.state.selectedKeys}
      openKeys={this.state.openKeys}
      onOpenChange={this.onOpenChange}
      onSelect={this.onSelect}
    />}
  />
  </React.Fragment>;
}

const SideNavigationMenu = ({ selectedKeys, openKeys, onOpenChange, onSelect }) => <div
  style={{
    borderRight: '1px solid #DDD',
    height: 'inherit',
    overflowY: 'scroll'
  }}
>
  <Menu
    style={{ borderRight: 'none' }}
    mode='inline'
    selectedKeys={selectedKeys}
    openKeys={openKeys}
    onOpenChange={onOpenChange}
    onSelect={onSelect}
  >
    <Item key={HOME} style={{ marginTop: 0 }}>
      <Link to={HOME}>{
        <span>
          <Icon type='home' />
          <span>{PAGE_URL_TITLE_MAP[HOME]}</span>
        </span>
        }
      </Link>
    </Item>
    <SubMenu
      key={MANAGE}
      title={
        <span>
          <Icon type='control' />
          <span>{PAGE_URL_TITLE_MAP[MANAGE]}</span>
        </span>
      }
    >
      <Item key={MANAGE_INGREDIENTS}>
        <Link to={MANAGE_INGREDIENTS}>{PAGE_URL_TITLE_MAP[MANAGE_INGREDIENTS]}</Link>
      </Item>
      <Item key={MANAGE_PRODUCTS}>
        <Link to={MANAGE_PRODUCTS}>{PAGE_URL_TITLE_MAP[MANAGE_PRODUCTS]}</Link>
      </Item>
    </SubMenu>
    <SubMenu
      key={BILLING}
      title={
        <span>
          <Icon type='shopping-cart' />
          <span>{PAGE_URL_TITLE_MAP[BILLING]}</span>
        </span>
      }
    >
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
</div>;