import * as React from 'react';
import { Spin, Empty } from 'antd';
import EditBill from './edit-bill';
import PrintBill from './print-bill';
import { Business } from 'obiman-data-models';
import LazyLoad from 'react-lazyload';
import Network from '../../../utils/network';
import { BILLS_API_URL } from '../../../constants/endpoints';
import Bill from './bill';
import { Bill as BDM } from 'obiman-data-models';

class LazyLoadMoreBills extends React.Component {
  componentDidMount = () => this.props.onLoadMore();
  render = () => <span style={{ height: '200px' }} />;
}

export default class AllBills extends React.Component {
  constructor() {
    super();
    this.state = {
      showEditModal: false,
      showPrintModal: false,
      billToUpdate: {},
      billToPrint: {}
    }
  }
  showEditModal = billToUpdate => this.setState({ billToUpdate, showEditModal: true });
  showPrintModal = billToPrint => this.setState({ billToPrint, showPrintModal: true });
  hideModal = () => this.setState({ showEditModal: false, showPrintModal: false });
  onSave = async billToSave => {
    try {
      const { businessId } = billToSave;
      const billData = new BDM(billToSave)
        .enrich(this.props.products, this.props.orders)
        .get();
      await Network.put(BILLS_API_URL(businessId), billData);
      this.props.onSuccess(businessId);
      setTimeout(this.hideModal, 2000);
    } catch (errorMessage) {
      throw errorMessage;
    }
  }
  render = () => <Spin spinning={this.props.loading}>
    {(this.props.bills || []).length ? <div className='flex-wrap'>
      {this.props.bills.map(item => <div key={item.id} >
        <Bill
          bill={item}
          orders={(this.props.orders || []).filter(({ businessId }) => businessId === item.businessId)}
          isCustomerView={this.props.isCustomerView}
          showEditModal={this.showEditModal}
          showPrintModal={this.showPrintModal}
          onSave={this.onSave}
          onSuccess={() => this.props.onSuccess(item.businessId)}
        />
      </div>)}
      {this.props.next && this.props.onLoadMore && !this.props.loading ? <LazyLoad once>
        <LazyLoadMoreBills onLoadMore={this.props.onLoadMore} />
      </LazyLoad>: null}
    </div> :
  <Empty description='No bills available' />}
  <EditBill
    visible={this.state.showEditModal}
    billToUpdate={this.state.billToUpdate}
    currency={this.state.billToUpdate.currency}
    ingredients={(this.props.ingredients || []).filter(({ businessId }) => businessId === this.state.billToUpdate.businessId)}
    products={(this.props.products || []).filter(({ businessId }) => businessId === this.state.billToUpdate.businessId)}
    orders={(this.props.orders || []).filter(({ businessId }) => businessId === this.state.billToUpdate.businessId)}
    sources={(this.props.allBusinesses.filter(({ id }) => id === this.state.billToUpdate.businessId)[0] || new Business().get()).billSources}
    onSave={this.onSave}
    isCustomerView={this.props.isCustomerView}
    hideModal={this.hideModal}
  />
  <PrintBill
    visible={this.state.showPrintModal}
    billToPrint={this.state.billToPrint}
    hideModal={this.hideModal}
    currentBusiness={this.props.allBusinesses.filter(({ id }) => id === this.state.billToUpdate.businessId)[0] || new Business().get()}
  />
</Spin>
}