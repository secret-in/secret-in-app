import alt from 'utils/alt';
import secretin from 'utils/secretin';

class MetadataActions {
  constructor() {
    this.generateActions(
      'createSecretSuccess',
      'deleteSecretSuccess',
      'deleteSecretFailure',
      'createSecretUserRightsSuccess',
      'createSecretUserRightsFailure',
      'updateSecretUserRightsSuccess',
      'updateSecretUserRightsFailure',
      'deleteSecretUserRightsSuccess',
      'deleteSecretUserRightsFailure',
      'removeSecretFromCurrentFolderSuccess',
      'removeSecretFromCurrentFolderFailure',
      'moveSecretToFolderSuccess',
      'moveSecretToFolderFailure',
      'addSecretToFolderSuccess',
      'addSecretToFolderFailure',
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
        this.deleteSecretFailure({
          currentUser: secretin.currentUser,
        });
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
      .then(() => (
        this.createSecretUserRightsSuccess({ secret, user, rights })
      ))
      .catch((error) => {
        this.createSecretUserRightsFailure({ error });
        throw error;
      });
  }

  updateSecretUserRights({ secret, user, rights }) {
    return secretin
      .shareSecret(secret.id, user.username, secret.type, rights)
      .then(() => (
        this.updateSecretUserRightsSuccess({ secret, user, rights })
      ))
      .catch((error) => {
        this.updateSecretUserRightsFailure({ error });
        throw error;
      });
  }

  deleteSecretUserRights({ secret, user }) {
    return secretin
      .unshareSecret(secret.id, user.username)
      .then(() => (
        this.deleteSecretUserRightsSuccess({ secret, user })
      ))
      .catch((error) => {
        this.deleteSecretUserRightsFailure({ error });
        throw error;
      });
  }

  addSecretToFolder({ secret, folder }) {
    return secretin
      .addSecretToFolder(secret.id, folder.id)
      .then(() => (
        this.addSecretToFolderSuccess({
          secret,
          folder,
          metadata: secretin.currentUser.metadatas,
        })
      ))
      .catch((error) => {
        this.addSecretToFolderFailure({ error });
        throw error;
      });
  }

  removeSecretFromCurrentFolder({ secret, currentFolderId }) {
    return secretin
      .removeSecretFromFolder(secret.id, currentFolderId)
      .then(() => (
        this.removeSecretFromCurrentFolderSuccess({
          secret,
          currentFolderId,
          metadata: secretin.currentUser.metadatas,
        })
      ))
      .catch((error) => {
        this.removeSecretFromCurrentFolderFailure({ error });
        throw error;
      });
  }

  // moveSecretToFolder({ secret, fromFolder, toFolder }) {
  //   return secretin
  //     .removeSecretFromFolder(secret.id, fromFolder.id)
  //     .then(() => {
  //       if (toFolder !== 'ROOT') {
  //         return secretin.addSecretToFolder(secret.id, toFolder.id);
  //       }
  //       return new Promise();
  //     })
  //     .then(() => (
  //       this.moveSecretToFolderSuccess({
  //         secret,
  //         fromFolder,
  //         toFolder,
  //         metadata: secretin.currentUser.metadatas,
  //       })
  //     ))
  //     .catch((error) => {
  //       this.moveSecretToFolderFailure({ error });
  //       throw error;
  //     });
  // }
}

export default alt.createActions(MetadataActions);
