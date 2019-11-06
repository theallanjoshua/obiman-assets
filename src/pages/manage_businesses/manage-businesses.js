import * as React from 'react';
import AllBusinesses from './components/all-businesses';
import AddBusiness from './components/add-business';
import EditBusiness from './components/edit-business';
import { Consumer } from '../../context';

export default class ManageBusinesses extends React.Component {
  constructor() {
    super();
    this.state = {
      businessToUpdate: {},
      showAddModal: false,
      showEditModal: false
    }
  }
  showAddModal = () => this.setState({ showAddModal: true });
  showEditModal = businessToUpdate => this.setState({ businessToUpdate, showEditModal: true });
  hideModal = () => this.setState({ showAddModal: false, showEditModal: false });
  render = () => <Consumer>
    {({ email, loading, businesses, fetchUser, onBusinessChange, hideBusinessManagement }) => <div>
      <AllBusinesses
        email={email}
        loading={loading}
        businesses={businesses}
        enableEdit={this.props.enableEdit}
        onBusinessChange={onBusinessChange}
        showAddModal={this.showAddModal}
        showEditModal={this.showEditModal}
        hideBusinessManagement={hideBusinessManagement}
      />
      <AddBusiness
        email={email}
        visible={this.state.showAddModal}
        hideModal={this.hideModal}
        fetchUser={fetchUser}
      />
      <EditBusiness
        visible={this.state.showEditModal}
        businessToUpdate={this.state.businessToUpdate}
        hideModal={this.hideModal}
        fetchUser={fetchUser}
      />
    </div>}
  </Consumer>;
}