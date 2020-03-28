import * as React from 'react';
import { withRouter } from 'react-router';
import { Consumer } from '../context';
import { fetchBusinesses, getBusinessIdFromPath } from '../utils/businesses';

class CurrentBusinessComponent extends React.Component {
  getBusinessIdFromLocation = ({ pathname = '' }) => getBusinessIdFromPath(pathname);
  componentDidMount = () => {
    const { location } = this.props;
    const businessId = this.getBusinessIdFromLocation(location);
    this.fetchBusiness(businessId);
  }
  componentDidUpdate = (prevProps) => {
    const { location } = this.props;
    const businessId = this.getBusinessIdFromLocation(location);
    const { location: previousLocation } = prevProps;
    const previousBusinessId = this.getBusinessIdFromLocation(previousLocation);
    if(businessId !== previousBusinessId) {
      this.fetchBusiness(businessId);
    }
  }
  fetchBusiness = async businessId => {
    this.props.onLoad(true);
    try {
      const businesses = await fetchBusinesses(businessId ? [businessId] : []);;
      const currentBusiness = businesses[0] || {};
      this.props.onSuccess(currentBusiness);
    } catch (errorMessage) {
      this.props.onError(errorMessage);
    }
    this.props.onLoad(false);
  }
  render = () => null;
}

class CurrentBusinessComponentWrapper extends React.Component {
  render = () => <Consumer>
    {({ setCurrentBusiness, setPageErrorMessage, setPageLoading }) => <CurrentBusinessComponent
      { ...this.props }
      onLoad={setPageLoading}
      onSuccess={setCurrentBusiness}
      onError={setPageErrorMessage}
    />}
  </Consumer>
}

export const CurrentBusiness = withRouter(CurrentBusinessComponentWrapper);