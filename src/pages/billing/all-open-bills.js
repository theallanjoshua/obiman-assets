import * as React from 'react';
import Network from '../../utils/network';
import { Alert, Card, Button, Spin, Table, Statistic, Empty } from 'antd';
import { BILLS_API_URL } from '../../constants/endpoints';
import {
  MANAGE_BILLS_PAGE_TITLE,
  EDIT_BILL_BUTTON_TEXT,
  ADD_BILL_TEXT
} from '../../constants/billing';
import PageHeader from '../../components/page-header';
import Page from '../../components/page';
import { Consumer } from '../../context';
import AddBill from './components/add-bill';
import EditBill from './components/edit-bill';
import { fetchAllIngredients } from '../../utils/ingredients';
import { fetchAllProducts, getEnrichedProducts } from '../../utils/products';

class AllOpenBillsComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      ingredients: [],
      products: [],
      bills: [],
      showAddModal: false,
      showEditModal: false,
      billToUpdate: {}
    }
  }

  componentDidMount = () => {
    const { businessId } = this.props;
    if(businessId) {
      this.fetchAllBills(businessId)
    }
  };

  componentDidUpdate = (preProps) => {
    const { businessId } = this.props;
    if(preProps.businessId !== businessId && preProps) {
      this.fetchAllBills(businessId)
    }
  };

  fetchAllBills = async businessId => {
    this.setState({ loading: true, errorMessage: '' });
    try {
      const ingredients = await fetchAllIngredients(businessId);
      const products = await fetchAllProducts(businessId);
      const enrichedProducts = getEnrichedProducts(products, ingredients);
      const response = await Network.get(BILLS_API_URL(businessId));
      const bills = response.bills
        .sort((prevBill, nextBill) => prevBill.label.localeCompare(nextBill.label));
      this.setState({ bills, ingredients, products: enrichedProducts });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }

  showAddModal = () => this.setState({ showAddModal: true });

  showEditModal = billToUpdate => this.setState({ billToUpdate, showEditModal: true });

  hideModal = () => this.setState({ showAddModal: false, showEditModal: false });

  render = () => <Page>
    <PageHeader
      title={MANAGE_BILLS_PAGE_TITLE(this.state.bills.length)}
      extra={<Button
        style={{ marginRight: '4px' }}
        type='primary'
        icon='plus'
        onClick={this.showAddModal}
        children={ADD_BILL_TEXT}
      />}
    />
    <br />
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    <br />
    <Spin spinning={this.state.loading}>
      {this.state.bills.length ?
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {this.state.bills.map(bill => <Card
            key={bill.id}
            style={{ minWidth: '300px', maxWidth: '300px', width: '300px', margin: '5px'}}
            title={bill.label}
            extra={<Button
              type='link'
              icon='edit'
              children={EDIT_BILL_BUTTON_TEXT}
              onClick={() => this.showEditModal(bill)}
            />}
            children={<div>
              <Table
                columns={[ { dataIndex: 'label' }, { dataIndex: 'quantity' } ]}
                dataSource={bill.composition.map(entity => ({ ...entity, key: entity.id }))}
                showHeader={false}
                pagination={false}
              />
              <br />
              <div className='invert-direction' >
                <Statistic
                  title={'Total'}
                  value={bill.total}
                />
              </div>
            </div>}
          />)}
        </div> :
      <Empty description='No open bills' />}
    </Spin>
    <AddBill
      visible={this.state.showAddModal}
      hideModal={this.hideModal}
      businessId={this.props.businessId}
      ingredients={this.state.ingredients}
      products={this.state.products}
      fetchAllBills={this.fetchAllBills}
    />
    <EditBill
      visible={this.state.showEditModal}
      hideModal={this.hideModal}
      businessId={this.props.businessId}
      ingredients={this.state.ingredients}
      products={this.state.products}
      billToUpdate={this.state.billToUpdate}
      fetchAllBills={this.fetchAllBills}
    />
  </Page>;
}

export default class AllOpenBills extends React.Component {
  render = () => <Consumer>
    {({ businessId }) => <AllOpenBillsComponent
      businessId={businessId}
    />}
  </Consumer>
}