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
      this.setState({ successMessage: 'Orders updated successfully' });
      this.props.fetchOngoingOrders();
      setTimeout(() => this.setState({ successMessage: '' }), 2000);
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  render = () => {
    const order = new Order();
    const groupedOrders = this.props.orders.reduce((acc, { id, source, sourceId, productLabel }) => {
      const { products = [] } = acc.filter(item => item.source === source && item.sourceId === sourceId)[0] || {};
      return [ ...acc.filter(item => item.source !== source || item.sourceId !== sourceId), {
        source,
        sourceId,
        products: [ ...products, {
          key: id,
          title: productLabel
        }]
      }];
    }, []);
    return <>
      {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
      {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
      <br />
      {groupedOrders.length ? <Tree
        checkable
        selectable={false}
        defaultExpandAll
        onCheck={this.onSelectionChange}
      >
        {groupedOrders.map(({ source, sourceId, products }) => <TreeNode
          disableCheckbox
          key={`${source}${sourceId}`}
          title={`${source} ${sourceId}`}
        >
          {products.map(({ key, title }) => <TreeNode
            key={key}
            title={title}
          />)}
        </TreeNode>)}
      </Tree> : null}
      <br />
      <div className='flex-wrap'>
        {this.props.nextStates.map(nextState => <Button
          key={nextState}
          style={{ marginLeft: '10px' }}
          children={nextState}
          type={(order.getStates().filter(({ id, isNegative }) => id === nextState && isNegative).length ? 'danger' : 'primary')}
          disabled={!this.state.selectedOrderIds.length || this.state.loading}
          onClick={() => this.editOrders(nextState)}
        />)}
      </div>
    </>
  }
}
const AllOrders = ({ loading, orders, fetchOngoingOrders, businessId }) => {
  const order = new Order();
  return <Tabs defaultActiveKey={order.getStartState()}>
    {order
      .getStates()
      .map(({ id, business: { shortLabel, nextStates } }) => {
        const ordersByState = orders.filter(({ status }) => status === id);
        return <TabPane
          key={id}
          tab={`${shortLabel} (${ordersByState.length})`}
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