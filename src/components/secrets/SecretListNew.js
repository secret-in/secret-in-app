import React, { PropTypes } from 'react';

import Secret from 'models/Secret';
import AppUIStore from 'stores/AppUIStore';
import NewSecretUIActions from 'actions/NewSecretUIActions';
import SecretNew from 'components/secrets/SecretNew';
import Icon from 'components/utilities/Icon';
import Button from 'components/utilities/Button';

const propTypes = {
  folder: PropTypes.instanceOf(Secret),
};

function SecretListNew({ folder }) {
  let folderId = null;
  let canWrite = true;
  if (folder) {
    folderId = folder.id;
    const currentUser = AppUIStore.getCurrentUser();
    canWrite = folder.canBeUpdatedBy(currentUser);
  }

  return (
    <div className="secret-list-new">
      <SecretNew />
      <Button
        title="Add secret"
        buttonStyle="icon"
        disabled={!canWrite}
        onClick={() => NewSecretUIActions.showModal({ folder: folderId, isFolder: false })}
      >
        <Icon id="add-secret" />
        Add secret
      </Button>
      <Button
        title="Add secret"
        buttonStyle="icon"
        disabled={!canWrite}
        onClick={() => NewSecretUIActions.showModal({ folder: folderId, isFolder: true })}
      >
        <Icon id="add-folder" />
        Create folder
      </Button>
    </div>
  );
}
SecretListNew.propTypes = propTypes;

export default SecretListNew;
