import * as React from 'react';
import { Alert } from 'antd';
import AllBusinesses from './components/all-businesses';
import AddBusiness from './components/add-business';
import EditBusiness from './components/edit-business';
import { Consumer } from '../../context';
import { fetchUser } from '../../utils/user';

class ManageBusinessesComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      businesses: [],
      businessToUpdate: {},
      showAddModal: false,
      showEditModal: false
    }
  }
  componentDidMount = () => this.fetchUser();
  componentDidUpdate = prevProps => {
    const { email } = this.props;
    const { email: existingEmail } = prevProps;
    if(email !== existingEmail) this.fetchUser();
  }
  fetchUser = async () => {
    const { email } = this.props;
    if(email) {
      this.setState({ loading: true, errorMessage: '' });
      try {
        const user = await fetchUser(email);
        const { businesses } = user;
        this.setState({ businesses });
      } catch (errorMessage) {
        this.setState({ errorMessage });
      }
      this.setState({ loading: false });
    }
  }
  showAddModal = () => this.setState({ showAddModal: true });
  showEditModal = businessToUpdate => this.setState({ businessToUpdate, showEditModal: true });
  hideModal = () => this.setState({ showAddModal: false, showEditModal: false });
  render = () => <div>
    {this.state.errorMessage ? <Alert message='Oops!' description={this.state.errorMessage} type='error' showIcon /> : null}
    <AllBusinesses
      loading={this.state.loading}
      businesses={this.state.businesses}
      showAddModal={this.showAddModal}
      showEditModal={this.showEditModal}
      enableEdit={this.props.enableEdit}
    />
    <AddBusiness
      visible={this.state.showAddModal}
      hideModal={this.hideModal}
      fetchUser={this.fetchUser}
      email={this.props.email}
    />
    <EditBusiness
      visible={this.state.showEditModal}
      businessToUpdate={this.state.businessToUpdate}
      hideModal={this.hideModal}
      fetchUser={this.fetchUser}
    />
  </div>;
}

export default class ManageBusinesses extends React.Component {
  render = () => <Consumer>
    {({ email }) => <ManageBusinessesComponent { ...this.props } email={email} />}
  </Consumer>
}