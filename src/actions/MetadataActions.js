import alt from 'utils/alt';
import secretin from 'utils/secretin';

class MetadataActions {
  constructor() {
    this.generateActions(
      'createSecretSuccess',
      'deleteSecretSuccess',
      'createSecretUserRightsSuccess',
      'createSecretUserRightsFailure',
      'updateSecretUserRightsSuccess',
      'updateSecretUserRightsFailure',
      'deleteSecretUserRightsSuccess',
      'deleteSecretUserRightsFailure',
    );
  }

  createSecret({ title, data, folder, isFolder } = { isFolder: false }) {
    let promise;
    if (isFolder) {
      promise = secretin.addFolder(title);
    } else {
      promise = secretin.addSecret(title, data.toJS());
    }

    return promise
      .then((id) => {
        if (folder) {
          return secretin.addSecretToFolder(id, folder);
        }
        return id;
      })
      .then(() => (
        this.createSecretSuccess({
          currentUser: secretin.currentUser,
        })
      ));
  }

  deleteSecret({ secret }) {
    return secretin
      .deleteSecret(secret.id)
      .catch((error) => {
        throw error;
      })
      .then(() => (
        this.deleteSecretSuccess({
          currentUser: secretin.currentUser,
        })
      ));
  }

  createSecretUserRights({ secret, user, rights }) {
    return secretin
      .shareSecret(secret.id, user.username, secret.type, rights)
      .catch((error) => {
        this.createSecretUserRightsFailure({ error });
        throw error;
      })
      .then(() => (
        this.createSecretUserRightsSuccess({ secret, user, rights })
      ));
  }

  updateSecretUserRights({ secret, user, rights }) {
    return secretin
      .shareSecret(secret.id, user.username, secret.type, rights)
      .catch((error) => {
        this.updateSecretUserRightsFailure({ error });
        throw error;
      })
      .then(() => (
        this.updateSecretUserRightsSuccess({ secret, user, rights })
      ));
  }

  deleteSecretUserRights({ secret, user }) {
    return secretin
      .unshareSecret(secret.id, user.username)
      .catch((error) => {
        this.deleteSecretUserRightsFailure({ error });
        throw error;
      })
      .then(() => (
        this.deleteSecretUserRightsSuccess({ secret, user })
      ));
  }
}

export default alt.createActions(MetadataActions);