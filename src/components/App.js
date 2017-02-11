import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import Router from 'react-router/BrowserRouter';
import connectToStores from 'alt-utils/lib/connectToStores';
import secretin from 'utils/secretin';

import AppUIActions from 'actions/AppUIActions';

import AppUIStore from 'stores/AppUIStore';
import MetadataStore from 'stores/MetadataStore';

import UserConnect from 'components/users/UserConnect';
import Layout from 'components/Layout';

class App extends Component {

  static propTypes = {
    savedUsername: PropTypes.string,
    loading: PropTypes.bool,
    connected: PropTypes.bool,
    errors: PropTypes.instanceOf(Immutable.Map),
  }

  static getStores() {
    return [
      AppUIStore,
      MetadataStore,
    ];
  }

  static getPropsFromStores() {
    const state = AppUIStore.getState();
    return {
      savedUsername: state.get('savedUsername'),
      loading: state.get('loading'),
      connected: state.get('connected'),
      errors: state.get('errors'),
      secrets: MetadataStore.getSecretsInFolder(),
    };
  }

  componentDidMount() {
    secretin.addEventListener('connectionChange', AppUIActions.connectionChange);
  }

  componentWillUnmount() {
    secretin.removeEventListener('connectionChange', AppUIActions.connectionChange);
  }

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          {
            this.props.connected ? (
              <Layout />
            ) : (
              <UserConnect
                savedUsername={this.props.savedUsername}
                loading={this.props.loading}
                errors={this.props.errors}
              />
            )
          }
        </div>
      </Router>
    );
  }
}

export default connectToStores(App);
