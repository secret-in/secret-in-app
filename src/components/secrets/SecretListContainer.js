import React, { PropTypes } from 'react';
import Immutable from 'immutable';

import MetadataStore from 'stores/MetadataStore';
import SecretList from 'components/secrets/SecretList';

const propTypes = {
  params: PropTypes.object,
  showAll: PropTypes.bool,
};

const defaultProps = {
  showAll: false,
};

function SecretListContainer({ params, showAll }) {
  if (showAll) {
    const secrets = MetadataStore.getAllSecrets();
    return (
      <div className="secret-list-container">
        <SecretList secrets={secrets} showAll />
      </div>
    );
  }

  const path = params.path ? params.path.split('/') : [];
  const folders = new Immutable.List(path);
  const folderId = folders.last();
  const folder = MetadataStore.getById(folderId);
  const secrets = MetadataStore.getSecretsInFolder(folderId);

  return (
    <div className="secret-list-container">
      <SecretList folder={folder} folders={folders} secrets={secrets} />
    </div>
  );
}
SecretListContainer.propTypes = propTypes;
SecretListContainer.defaultProps = defaultProps;

export default SecretListContainer;
