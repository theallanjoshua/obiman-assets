import * as React from 'react';
import { Table, Empty, Alert, Card, Radio, Icon, Spin } from 'antd';
import {
  ALL_PRODUCTS_TABLE_COLUMN_DEFINITION,
  PRODUCT_DELETED_SUCCESSFULLY_MESSAGE,
  ProductImage,
  ProductEdit,
  ProductDelete,
  ProductLabel,
  ProductClassification,
  ProductIssues,
  ProductPrice,
  ProductDescription
} from '../../../constants/manage-products';
import Network from '../../../utils/network';
import EditProduct from './edit-product';
import { PRODUCTS_API_URL } from '../../../constants/endpoints';

export default class AllProducts extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      successMessage: '',
      isCard: true,
      productToUpdate: {},
      showEditModal: false
    }
  }
  toggleIsCard = e => this.setState({ isCard: e.target.value });
  showEditModal = productToUpdate => this.setState({ productToUpdate, showEditModal: true });
  hideModal = () => this.setState({ showEditModal: false });
  deleteProduct = async ({ id, label }) => {
    const { businessId } = this.props;
    this.setState({ loading: true, errorMessage: '', successMessage: '' });
    try {
      await Network.delete(`${PRODUCTS_API_URL(businessId)}/${id}`);
      this.setState({ errorMessage: '', successMessage: PRODUCT_DELETED_SUCCESSFULLY_MESSAGE(label) });
      setTimeout(() => this.setState({ successMessage: '' }), 2000);
      this.props.fetchAllProducts(businessId);
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  render = () => {
    const products = this.props.products.map(product => ({
      ...product,
      key: product.id,
      currency: this.props.currency,
      onEdit: this.showEditModal,
      onDelete: this.deleteProduct
    }));
    return <div>
      {this.state.errorMessage ? <Alert message='Oops!' description={this.state.errorMessage} type='error' showIcon /> : null}
      {this.state.successMessage ? <Alert message='Yay!' description={this.state.successMessage} type='success' showIcon /> : null}
      {this.state.errorMessage || this.state.successMessage ? <br /> : null}
      <Radio.Group
        value={this.state.isCard}
        buttonStyle='solid'
        onChange={this.toggleIsCard}
      >
        <Radio.Button value={true}>
          <Icon type='appstore' />
        </Radio.Button>
        <Radio.Button value={false}>
          <Icon type='unordered-list' />
        </Radio.Button>
      </Radio.Group>
      {this.state.isCard ? <Spin spinning={this.state.loading || this.props.loading}>
        <div className='flex-wrap' style={{ paddingTop: '10px' }}>
          {products.map(product => <Card
            key={product.key}
            style={{
              maxWidth: '90vw',
              width: '242px',
              height: '100%',
              margin: '0px 10px 10px 0px'
            }}
            bodyStyle={{ flexGrow: 1 }}
            cover={<ProductImage product={product} />}
            actions={[<ProductEdit product={product} />, <ProductDelete product={product} />]}
          >
            <Card.Meta
              title={<ProductLabel product={product} />}
              description={<div>
                <div><ProductClassification product={product} /></div>
                <div><ProductPrice product={product} /></div>
                <div><ProductIssues product={product} /></div>
                <div><ProductDescription product={product} /></div>
              </div>}
            />
          </Card>)}
        </div>
      </Spin> : <Table
        pagination={{ position: 'both' }}
        scroll={{ x: 2400, y: '50vh' }}
        locale={{ emptyText: <Empty description='No products' /> }}
        loading={this.state.loading || this.props.loading}
        columns={ALL_PRODUCTS_TABLE_COLUMN_DEFINITION}
        dataSource={products}
      />}
      <EditProduct
        currency={this.props.currency}
        classifications={this.props.classifications}
        taxes={this.props.taxes}
        businessId={this.props.businessId}
        ingredients={this.props.ingredients}
        visible={this.state.showEditModal}
        productToUpdate={this.state.productToUpdate}
        hideModal={this.hideModal}
        fetchAllProducts={this.props.fetchAllProducts}
      />
    </div>
  }
}