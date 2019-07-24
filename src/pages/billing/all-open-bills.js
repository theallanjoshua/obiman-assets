import * as React from 'react';
import Network from '../../utils/network';
import { PageHeader, Alert, Row, Col, Card, Button, Spin, Table, Statistic } from 'antd';
import { BILLS_API_URL } from '../../constants/endpoints';
import {
  MANAGE_BILLS_PAGE_TITLE,
  EDIT_BILL_BUTTON_TEXT
} from '../../constants/billing';
import { BILLING } from '../../constants/pages';

export default class AllOpenBills extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      bills: []
    }
  }

  componentDidMount = () => this.fetchAllBills();

  fetchAllBills = async () => {
    this.setState({ loading: true, errorMessage: '' });
    try {
      const response = await Network.get(BILLS_API_URL);
      const bills = response.bills
        .sort((prevBill, nextBill) => prevBill.label.localeCompare(nextBill.label));;
      this.setState({ bills });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }

  render = () => <React.Fragment>
    <PageHeader
      title={MANAGE_BILLS_PAGE_TITLE(this.state.bills.length)}
    />
    <br />
    {this.state.errorMessage ? <Alert description={this.state.errorMessage} type='error' showIcon /> : null}
    {this.state.successMessage ? <Alert description={this.state.successMessage} type='success' showIcon /> : null}
    <br />
    <Spin spinning={this.state.loading}>
      <Row gutter={16}>
        {this.state.bills.map(bill => <Col
          key={bill.id}
          span={4}
          style={{ paddingBottom: '16px' }}
        >
          <Card
            title={bill.label}
            extra={<Button
              type='link'
              icon='edit'
              href={`/#${BILLING}/${bill.id}`}
              children={EDIT_BILL_BUTTON_TEXT}
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
          />
        </Col>)}
      </Row>
    </Spin>
  </React.Fragment>;
}