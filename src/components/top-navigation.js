import * as React from 'react';
import { Consumer } from '../context';
import { Button, Menu } from 'antd';
import Credentials from '../utils/credentials';

const { SubMenu, Item } = Menu;

export default class TopNavigation extends React.Component {
  render = () => <Consumer>
      {({ email }) => <Menu
        theme='dark'
        mode='horizontal'
      >
        <Item style={{ float: 'left' }}>Obiman</Item>
        <SubMenu title={`Logged in as ${email}`} style={{ float: 'right' }}>
          <Item>My account</Item>
          <Item>My preferences</Item>
          <Item>
            <Button
              type='link'
              children={'Logout'}
              icon='logout'
              onClick={() => Credentials.logout()}
            />
          </Item>
        </SubMenu>
      </Menu>}
    </Consumer>
}