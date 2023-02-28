import React from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'react-bootstrap';
import { Link, useRouteMatch } from 'react-router-dom';

const MenuLink = ({ label, to, activeOnlyWhenExact }) => {
  const match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact,
  });

  return (
    <Nav.Link as={Link} to={to} className={match && 'active'}>
      {label}
    </Nav.Link>
  );
};

MenuLink.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  activeOnlyWhenExact: PropTypes.string.isRequired,
};

export default MenuLink;
