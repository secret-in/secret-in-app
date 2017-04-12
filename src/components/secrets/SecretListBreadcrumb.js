import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import Link from 'react-router/Link';

import { buildSecretURL } from 'utils/URLHelper';
import MetadataStore from 'stores/MetadataStore';
import AppUIStore from 'stores/AppUIStore';

import Icon from 'components/utilities/Icon';
import Title from 'components/utilities/Title';

const propTypes = {
  folders: PropTypes.instanceOf(Immutable.List),
  withTitle: PropTypes.bool,
};

const defaultProps = {
  folders: new Immutable.List(),
  withTitle: true,
};

function SecretListBreadcrumb({ folders, withTitle }) {
  const breadcrumbURLs = folders.reduce(
    (memo, folderId) =>
      memo.push({
        folderId,
        link: buildSecretURL(
          new Immutable.List([folderId]),
          memo.last() ? memo.last().link : undefined
        ),
      }),
    new Immutable.List()
  );

  let breadcrumb = breadcrumbURLs.reduce(
    (links, { folderId, link }, key) => {
      const folder = MetadataStore.getById(folderId);
      if (!folder) {
        return links;
      }

      return links
        .push(
          <div key={key} className="breadcrumb-item">
            <Link
              to={link}
              className="breadcrumb-link"
              activeClassName="breadcrumb-link--active"
              activeOnlyWhenExact
            >
              {folder.title}
            </Link>
          </div>
        )
        .push(
          <Icon
            key={`${key}-sep`}
            id="chevron-right"
            className="breadcrumb-item-separator"
          />
        );
    },
    new Immutable.List()
  );

  const currentUser = AppUIStore.getCurrentUser();
  if (withTitle) {
    breadcrumb = breadcrumb
      .unshift(
        <Icon
          key="home-sep"
          id="chevron-right"
          className="breadcrumb-item-separator"
        />
      )
      .unshift(
        <Title
          key="home"
          title={currentUser.username}
          icon="home"
          link="/secrets/"
        />
      );
  }

  return (
    <div className="breadcrumb">
      {breadcrumb}
    </div>
  );
}
SecretListBreadcrumb.propTypes = propTypes;
SecretListBreadcrumb.defaultProps = defaultProps;

export default SecretListBreadcrumb;
