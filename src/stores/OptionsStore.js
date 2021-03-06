import Immutable, { Record } from 'immutable';
import alt from 'utils/alt';
import makeImmutable from 'utils/makeImmutable';

import AppUIActions from 'actions/AppUIActions';
import OptionsActions from 'actions/OptionsActions';

const OptionsState = new Record({
  options: new Immutable.Map(),
  errors: new Immutable.Map(),
  showQRCode: false,
  showShortLogin: false,
  showRescueCodes: false,
  newPass: new Immutable.Map({
    shown: false,
    newPass1: '',
    newPass2: '',
    error: '',
    loading: false,
    status: 'initial', // 3 possible states : initial, success, failure
  }),
  rescueCodes: new Immutable.List(),
  loading: false,
});

class OptionsStore {
  constructor() {
    this.bindAction(AppUIActions.LOGIN_USER_SUCCESS, this.onLoadOptions);
    this.bindActions(OptionsActions);

    this.state = new OptionsState();
  }

  onLoadOptions({ options }) {
    this.setState(this.state.set('options', new Immutable.Map(options)));
  }

  onActivateTotp() {
    this.setState(this.state.set('loading', true));
  }

  onActivateShortLogin() {
    this.setState(this.state.set('loading', true));
  }

  onToggleTotp(showQRCode) {
    this.setState(this.state.set('showQRCode', showQRCode));
  }

  onToggleShortLogin(showShortLogin) {
    this.setState(this.state.set('showShortLogin', showShortLogin));
  }

  onActivateTotpFailure({ error }) {
    this.setState(
      this.state.merge({
        errors: new Immutable.Map({ totp: error }),
        loading: false,
      })
    );
  }

  onHideQRCode() {
    this.setState(
      this.state.merge({
        showQRCode: false,
        loading: false,
        errors: new Immutable.Map(),
      })
    );
  }

  onHideShortLogin() {
    this.setState(
      this.state.merge({
        showShortLogin: false,
        loading: false,
        errors: new Immutable.Map(),
      })
    );
  }

  onActivateTotpSuccess() {
    this.setState(
      this.state
        .merge({
          showQRCode: false,
          loading: false,
          errors: new Immutable.Map(),
        })
        .setIn(['options', 'totp'], true)
    );
  }

  onDeactivateTotpSuccess() {
    this.setState(this.state.setIn(['options', 'totp'], false));
  }

  onDeactivateShortLoginSuccess({ shortLogin }) {
    this.setState(this.state.setIn(['options', 'shortLogin'], shortLogin));
  }

  onActivateShortLoginSuccess({ shortLogin }) {
    this.setState(
      this.state
        .merge({
          showShortLogin: false,
          loading: false,
          errors: new Immutable.Map(),
        })
        .setIn(['options', 'shortLogin'], shortLogin)
    );
  }

  onChangeDelaySuccess({ timeToClose }) {
    this.setState(this.state.setIn(['options', 'timeToClose'], timeToClose));
  }

  onChangeNewPass1(newPass1) {
    this.setState(this.state.setIn(['newPass', 'newPass1'], newPass1.value));
  }

  onChangeNewPass2(newPass2) {
    this.setState(this.state.setIn(['newPass', 'newPass2'], newPass2.value));
  }

  onShowChangePassword() {
    this.setState(
      this.state
        .setIn(['newPass', 'newPass1'], '')
        .setIn(['newPass', 'newPass2'], '')
        .setIn(['newPass', 'error'], '')
        .setIn(['newPass', 'loading'], false)
        .setIn(['newPass', 'shown'], true)
    );
  }

  onHideChangePassword() {
    this.setState(
      this.state
        .setIn(['newPass', 'newPass1'], '')
        .setIn(['newPass', 'newPass2'], '')
        .setIn(['newPass', 'error'], '')
        .setIn(['newPass', 'loading'], false)
        .setIn(['newPass', 'shown'], false)
    );
  }

  onChangePassword() {
    this.setState(
      this.state
        .setIn(['newPass', 'loading'], true)
        .setIn(['newPass', 'error'], '')
    );
  }

  onChangePasswordSuccess() {
    this.setState(
      this.state
        .setIn(['newPass', 'newPass1'], '')
        .setIn(['newPass', 'newPass2'], '')
        .setIn(['newPass', 'error'], '')
        .setIn(['newPass', 'loading'], false)
        .setIn(['newPass', 'status'], 'success')
    );
  }

  onChangePasswordFailure() {
    this.setState(
      this.state
        .setIn(['newPass', 'error'], 'Password change failed')
        .setIn(['newPass', 'loading'], false)
        .setIn(['newPass', 'status'], 'failure')
    );
  }

  onShowRescueCodesSuccess({ rescueCodes }) {
    this.setState(
      this.state.merge({
        rescueCodes: new Immutable.List(rescueCodes),
        showRescueCodes: true,
      })
    );
  }

  onHideRescueCodes() {
    this.setState(
      this.state.merge({
        rescueCodes: new Immutable.List(),
        showRescueCodes: false,
      })
    );
  }

  static getOptions() {
    return this.getState().get('options');
  }

  static getNewPass() {
    return this.getState().get('newPass');
  }
}

export default alt.createStore(makeImmutable(OptionsStore), 'OptionsStore');
