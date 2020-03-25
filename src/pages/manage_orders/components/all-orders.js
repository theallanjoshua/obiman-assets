import * as React from 'react';
import { Tabs, Button, Table, Alert } from 'antd';
import { Order } from 'obiman-data-models';
import { ORDERS_API_URL } from '../../../constants/endpoints';
import Network from '../../../utils/network';

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
    return <>
      {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
      {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
      <br />
      <div className='right-align'>
        {this.props.nextStates.map(nextState => <Button
          key={nextState}
          style={{ marginLeft: '10px' }}
          children={nextState}
          type={(order.getStates().filter(({ id, isNegative }) => id === nextState && isNegative).length ? 'danger' : 'primary')}
          disabled={!this.state.selectedOrderIds.length}
          onClick={() => this.editOrders(nextState)}
        />)}
      </div>
      <br />
      <Table
        // size='small'
        columns={[
          {
            title: 'Product',
            dataIndex: 'productLabel',
            render: (text, { productLabel }) => <a>{productLabel}</a>
          },
          {
            title: 'Source',
            dataIndex: 'source'
          },
          {
            title: 'Source ID',
            dataIndex: 'sourceId'
          }
        ]}
        scroll={{ y: '45vh' }}
        pagination={false}
        loading={this.props.loading}
        dataSource={this.props.orders.map(entity => ({...entity, key: entity.id }))}
        rowSelection={{ onChange: this.onSelectionChange }}
      />
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
        return <Tabs.TabPane
          key={id}
          tab={`${shortLabel} (${ordersByState.length})`}
        >
          <OrdersByState
            loading={loading}
            nextStates={nextStates}
            orders={ordersByState}
            fetchOngoingOrders={fetchOngoingOrders}
            businessId={businessId}
          />
        </Tabs.TabPane>
      })}
  </Tabs>
}

export default AllOrders;