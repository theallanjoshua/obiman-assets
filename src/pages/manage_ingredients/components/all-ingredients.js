import * as React from 'react';
import { Table, Empty, Alert, Card, Radio, Icon, Spin } from 'antd';
import {
  IngredientImage,
  IngredientEdit,
  IngredientDelete,
  IngredientLabel,
  IngredientLocation,
  IngredientQuantity,
  IngredientExpiry,
  ALL_INGREDIENTS_TABLE_COLUMN_DEFINITION,
  INGREDIENT_DELETED_SUCCESSFULLY_MESSAGE
} from '../../../constants/manage-ingredients';
import EditIngredient from './edit-ingredient';
import Network from '../../../utils/network';
import { INGREDIENTS_API_URL } from '../../../constants/endpoints';

export default class AllIngredients extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      errorMessage: '',
      successMessage: '',
      isCard: true,
      ingredientToUpdate: {},
      showEditModal: false
    }
  }
  toggleIsCard = e => this.setState({ isCard: e.target.value });
  showEditModal = ingredientToUpdate => this.setState({ ingredientToUpdate, showEditModal: true });
  hideModal = () => this.setState({ showEditModal: false });
  deleteIngredient = async ({ id, label }) => {
    const { businessId } = this.props;
    this.setState({ loading: true, errorMessage: '', successMessage: '' });
    try {
      await Network.delete(`${INGREDIENTS_API_URL(businessId)}/${id}`);
      this.setState({ errorMessage: '', successMessage: INGREDIENT_DELETED_SUCCESSFULLY_MESSAGE(label) });
      setTimeout(() => this.setState({ successMessage: '' }), 2000);
      this.props.fetchAllIngredients(businessId);
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
    this.setState({ loading: false });
  }
  render = () => {
    const ingredients = this.props.ingredients.map(ingredient => ({
      ...ingredient,
      key: ingredient.id,
      currency: this.props.currency,
      onEdit: this.showEditModal,
      onDelete: this.deleteIngredient
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
          {ingredients.map(ingredient => <Card
            key={ingredient.key}
            style={{
              maxWidth: '90vw',
              width: '242px',
              height: '100%',
              margin: '0px 10px 10px 0px'
            }}
            cover={<IngredientImage ingredient={ingredient} />}
            actions={[<IngredientEdit ingredient={ingredient} />, <IngredientDelete ingredient={ingredient} />]}
          >
            <Card.Meta
              title={<IngredientLabel ingredient={ingredient} />}
              description={<div>
                <div><IngredientLocation ingredient={ingredient} /></div>
                <div><IngredientExpiry ingredient={ingredient} /></div>
                <div><IngredientQuantity ingredient={ingredient} /></div>
              </div>}
            />
          </Card>)}
        </div>
      </Spin> : <Table
        pagination={{ position: 'both' }}
        scroll={{ x: 2400, y: '50vh' }}
        locale={{ emptyText: <Empty description='No ingredients' /> }}
        loading={this.state.loading || this.props.loading}
        columns={ALL_INGREDIENTS_TABLE_COLUMN_DEFINITION}
        dataSource={ingredients}
      />}
      <EditIngredient
        currency={this.props.currency}
        locations={this.props.locations}
        businessId={this.props.businessId}
        visible={this.state.showEditModal}
        ingredientToUpdate={this.state.ingredientToUpdate}
        hideModal={this.hideModal}
        fetchAllIngredients={this.props.fetchAllIngredients}
      />
    </div>
  }
}