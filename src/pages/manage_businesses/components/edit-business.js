import * as React from 'react';
import { Modal, Alert } from 'antd';
import BusinessInfo from './business-info';
import { Business } from 'obiman-data-models';
import Network from '../../../utils/network';
import {
  BUSINESSES_API_URL,
  USERS_API_URL,
  USERS_BUSINESSES_API_URL
} from '../../../constants/endpoints';
import {
  BUSINESS_EDITED_SUCCESSFULLY_MESSAGE,
  EDIT_BUSINESS_MODAL_HEADER
} from '../../../constants/manage-businesses';
import { SAVE_BUTTON_TEXT } from '../../../constants/app';

const INITIAL_STATE = {
  loading: false,
  successMessage: '',
  errorMessage: '',
  businessToUpdate: {},
  showValidationErrors: false
}

export default class EditBusiness extends React.Component {
  constructor() {
    super();
    this.state = {
      ...INITIAL_STATE
    }
  }

  componentDidUpdate = prevProps => {
    const { visible: prevVisible } = { ...prevProps };
    const { businessToUpdate, visible } = { ...this.props };
    if (!prevVisible && visible) {
      this.setState({ ...INITIAL_STATE, businessToUpdate });
    }
  }

  onChange = businessToUpdate => this.setState({ businessToUpdate });

  editBusiness = async () => {
    const business = new Business(this.state.businessToUpdate);
    if (Object.keys(business.validate()).length) {
      this.setState({ showValidationErrors: true });
    } else {
      const businessData = business.get();
      const { id: businessId, label, employees: incomingEmployees } = businessData;
      this.setState({ loading: true, errorMessage: '', successMessage: '' });
      try {
        await Network.put(`${BUSINESSES_API_URL}/${businessId}`, businessData);
        this.setState({ errorMessage: '', successMessage: BUSINESS_EDITED_SUCCESSFULLY_MESSAGE(label) });
        const { employees: existingEmployees } = this.props.businessToUpdate;
        const usersToRemove = existingEmployees.filter(({ id }) => !incomingEmployees.filter(employee => employee.id === id).length);
        const usersToAdd = incomingEmployees.filter(({ id }) => !existingEmployees.filter(employee => employee.id === id).length);
        await Promise.all([
          ...usersToAdd.map(({ id }) => Network.put(`${USERS_API_URL}${id}${USERS_BUSINESSES_API_URL}`, { businessId, isRemove: false })),
          ...usersToRemove.map(({ id }) => Network.put(`${USERS_API_URL}${id}${USERS_BUSINESSES_API_URL}`, { businessId, isRemove: true }))
        ]);
        this.props.fetchUser();
        setTimeout(this.props.hideModal, 2000);
      } catch (errorMessage) {
        this.setState({ errorMessage });
      }
      this.setState({ loading: false });
    }
  }

  render = () => <Modal
    destroyOnClose
    maskClosable={false}
    title={EDIT_BUSINESS_MODAL_HEADER}
    okText={SAVE_BUTTON_TEXT}
    width={'60vw'}
    visible={this.props.visible}
    closable={!this.state.loading}
    onOk={this.editBusiness}
    okButtonProps={{
      disabled: !!this.state.successMessage,
      loading: this.state.loading
    }}
    onCancel={this.props.hideModal}
    cancelButtonProps={{
      disabled: this.state.loading
    }}
  >
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    <br />
    <BusinessInfo
      business={this.state.businessToUpdate}
      showValidationErrors={this.state.showValidationErrors}
      onChange={this.onChange}
    />
  </Modal>;
}