import * as React from 'react';
import { Tabs, Button, Alert, Tree, Spin } from 'antd';
import { Order } from 'obiman-data-models';
import { ORDERS_API_URL } from '../../../constants/endpoints';
import Network from '../../../utils/network';

const { TreeNode } = Tree;
const { TabPane } = Tabs;

class OrdersByState extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      successMessage: '',
      selectedOrderIds: []
    }
  }
  onSelectionChange = selectedOrderIds => this.setState({ selectedOrderIds });
  editOrders = async status => {
    const { businessId, orders } = this.props;
    const ordersToUpdate = orders
      .filter(({ id }) => this.state.selectedOrderIds.includes(id))
      .map(order => new Order(order)
        .setStatus(status)
        .get())
    this.setState({ loading: true, errorMessage: '', successMessage: '' });
    try {
      await Network.put(ORDERS_API_URL(businessId), ordersToUpdate);
      this.setState({ successMessage: 'Orders updated successfully', selectedOrderIds: [] });
      this.props.fetchOngoingOrders();
      setTimeout(() => this.setState({ successMessage: '' }), 2000);
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  render = () => {
    const order = new Order();
    const groupedOrders = this.props.orders.reduce((acc, { source, sourceId, orderedBy, id: key, productLabel: title }) => {
      const { customers = [] } = acc.filter(item => item.source === source && item.sourceId === sourceId)[0] || {};
      const { products = [] } = customers.filter(item => item.customer === orderedBy)[0] || {};
      return [ ...acc.filter(item => item.source !== source || item.sourceId !== sourceId), {
        source,
        sourceId,
        customers: [ ...customers.filter(item => item.customer !== orderedBy), {
          customer: orderedBy,
          products: [ ...products, { key, title } ]
        }]
      }];
    }, []);
    return <>
      {this.state.errorMessage ? <Alert message='Oops!' description={this.state.errorMessage} type='error' showIcon /> : null}
      {this.state.successMessage ? <Alert message='Yay!' description={this.state.successMessage} type='success' showIcon /> : null}
      {this.state.successMessage || this.state.errorMessage ? <br /> : null}
      {groupedOrders.length ? <Tree
        checkable
        selectable={false}
        onCheck={this.onSelectionChange}
      >
        {groupedOrders.map(({ source, sourceId, customers }) => <TreeNode
          disableCheckbox
          key={`${source}${sourceId}`}
          title={`${source} ${sourceId} (${customers.reduce((acc, { products = [] }) => acc + products.length, 0)})`}
        >
          {customers.map(({ customer, products = [] }) => <TreeNode
            disableCheckbox
            key={customer}
            title={`${customer} (${products.length})`}
          >
            {products.map(({ key, title }) => <TreeNode
              key={key}
              title={title}
            />)}
          </TreeNode>)}
        </TreeNode>)}
      </Tree> : null}
      <br />
      <div className='flex-wrap'>
        {this.props.nextStates.map(({ id, label }) => <Button
          key={id}
          style={{ marginLeft: '10px' }}
          children={label}
          type={order.getStateById(id).isNegative ? 'danger' : 'primary'}
          disabled={!this.state.selectedOrderIds.length || this.state.loading}
          onClick={() => this.editOrders(id)}
        />)}
      </div>
    </>
  }
}
const AllOrders = ({ loading, orders, fetchOngoingOrders, businessId }) => {
  const order = new Order();
  return <Tabs defaultActiveKey={order.getStartState()}>
    {order.getStates()
      .map(({ id, business: { label, nextStates } }) => {
        const ordersByState = orders.filter(({ status }) => status === id);
        return <TabPane
          key={id}
          tab={`${label} (${ordersByState.length})`}
        >
          <Spin spinning={loading}>
            <OrdersByState
              loading={loading}
              nextStates={nextStates}
              orders={ordersByState}
              fetchOngoingOrders={fetchOngoingOrders}
              businessId={businessId}
            />
          </Spin>
        </TabPane>
      })}
  </Tabs>
}

export default AllOrders;