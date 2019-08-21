import * as React from 'react';
import { Consumer } from '../context';
import { Button, Menu, Avatar } from 'antd';
import Credentials from '../utils/credentials';
import toMaterialStyle from 'material-color-hash';

const { SubMenu, Item } = Menu;

export default class TopNavigation extends React.Component {
  render = () => <Consumer>
      {({ email, profilePicture }) => <Menu
        theme='dark'
        mode='horizontal'
      >
        <Item style={{ float: 'left' }}>Obiman</Item>
        <SubMenu title={<Avatar style={toMaterialStyle(email)} src={profilePicture} children={email.substr(0,1).toUpperCase()} />} style={{ float: 'right' }}>
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