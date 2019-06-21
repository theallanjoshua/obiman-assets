import * as React from 'react';
import { NavLink } from 'react-router-dom'
import { Menu, Drawer } from 'antd';
import {
  HOME,
  MANAGE,
  MANAGE_INGREDIENTS,
  MANAGE_PRODUCTS
} from '../constants/pages';
import {
  HOME_MENU_ITEM_TITLE,
  MANAGE_SUB_MENU_TITLE,
  MANAGE_INGREDIENTS_MENU_ITEM_TITLE,
  MANAGE_PRODUCTS_MENU_ITEM_TITLE
} from '../constants/side-navigation';

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
    title={'Navigation'}
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
        <NavLink to={HOME}>{HOME_MENU_ITEM_TITLE}</NavLink>
      </Item>
      <SubMenu key={MANAGE} title={MANAGE_SUB_MENU_TITLE}>
        <Item key={MANAGE_INGREDIENTS}>
          <NavLink to={MANAGE_INGREDIENTS}>{MANAGE_INGREDIENTS_MENU_ITEM_TITLE}</NavLink>
        </Item>
        <Item key={MANAGE_PRODUCTS}>
          <NavLink to={MANAGE_PRODUCTS}>{MANAGE_PRODUCTS_MENU_ITEM_TITLE}</NavLink>
        </Item>
      </SubMenu>
      <Item key={'/billing'}>
        <NavLink to={'/billing'}>{'Billing'}</NavLink>
      </Item>
    </Menu>
  </Drawer>;
}