import * as React from 'react';
import { Modal, Alert, Spin } from 'antd';
import BusinessInfo from './business-info';
import { Business } from 'obiman-data-models';
import Network from '../../../utils/network';
import { BUSINESSES_API_URL } from '../../../constants/endpoints';
import {
  BUSINESS_ADDED_SUCCESSFULLY_MESSAGE,
  ADD_BUSINESS_MODAL_HEADER,
  ADD_BUSINESS_BUTTON_TEXT
} from '../../../constants/manage-businesses';

const updatePermissionText = new Business().getUpdatePermissionText();

const INITIAL_STATE = {
  loading: false,
  successMessage: '',
  errorMessage: '',
  businessToCreate: {},
  showValidationErrors: false
}

export default class AddBusiness extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
      businessToCreate: {
        employees: [{
          id: props.email,
          permissions: [updatePermissionText]
        }]
      }
    }
  }
  componentDidUpdate = prevProps => {
    const { visible: prevVisible } = { ...prevProps };
    const { visible } = { ...this.props };
    if (!prevVisible && visible) {
      this.setState({
        ...INITIAL_STATE,
        businessToCreate: {
          employees: [{
            id: this.props.email,
            permissions: [updatePermissionText]
          }]
        }
      });
    }
  }
  onChange = businessToCreate => this.setState({ businessToCreate });
  addBusiness = async () => {
    const business = new Business(this.state.businessToCreate);
    if (Object.keys(business.validate()).length) {
      this.setState({ showValidationErrors: true });
    } else {
      const businessData = business.get();
      this.setState({ loading: true, errorMessage: '', successMessage: '' });
      try {
        await Network.post(BUSINESSES_API_URL, businessData);
        this.setState({ errorMessage: '', successMessage: BUSINESS_ADDED_SUCCESSFULLY_MESSAGE(businessData.label) });
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
    title={ADD_BUSINESS_MODAL_HEADER}
    okText={ADD_BUSINESS_BUTTON_TEXT}
    style={{ maxWidth: '90vw' }}
    width={'720px'}
    visible={this.props.visible}
    closable={!this.state.loading}
    onOk={this.addBusiness}
    okButtonProps={{
      disabled: !!this.state.successMessage,
      loading: this.state.loading
    }}
    onCancel={this.props.hideModal}
    cancelButtonProps={{
      disabled: this.state.loading
    }}
  >
    {this.state.errorMessage ? <Alert message='Oops!' description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert message='Yay!' description={this.state.successMessage} type='success' showIcon /> : null}
    {this.state.successMessage || this.state.errorMessage ? <br /> : null}
    <Spin spinning={this.state.loading}>
      <BusinessInfo
        business={this.state.businessToCreate}
        showValidationErrors={this.state.showValidationErrors}
        onChange={this.onChange}
      />
    </Spin>
    {this.state.successMessage || this.state.errorMessage ? <br /> : null}
    {this.state.errorMessage ? <Alert message='Oops!' description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert message='Yay!' description={this.state.successMessage} type='success' showIcon /> : null}
  </Modal>;
}