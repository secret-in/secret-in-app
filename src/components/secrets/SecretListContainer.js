import React, { PropTypes } from 'react';
import Immutable from 'immutable';

import MetadataStore from 'stores/MetadataStore';
import SecretList from 'components/secrets/SecretList';

const propTypes = {
  params: PropTypes.object,
  showAll: PropTypes.bool,
  showMine: PropTypes.bool,
  showShared: PropTypes.bool,
};

const defaultProps = {
  showAll: false,
};

function SecretListContainer({ params, showAll, showMine, showShared }) {
  if (showAll) {
    const secrets = MetadataStore.getAllSecrets();
    return <SecretList secrets={secrets} showAll />;
  } else if (showMine) {
    const secrets = MetadataStore.getMySecret();
    return <SecretList secrets={secrets} showMine />;
  } else if (showShared) {
    const secrets = MetadataStore.getSharedSecret();
    return <SecretList secrets={secrets} showShared />;
  }

  const path = params.path ? params.path.split('/') : [];
  const folders = new Immutable.List(path);
  const folderId = folders.last();
  const folder = MetadataStore.getById(folderId);
  const secrets = MetadataStore.getSecretsInFolder(folderId);

  return <SecretList folder={folder} folders={folders} secrets={secrets} />;
}
SecretListContainer.propTypes = propTypes;
SecretListContainer.defaultProps = defaultProps;

export default SecretListContainer;
