import React from 'react';
import PropTypes from 'prop-types';
import { Link, useRouteMatch } from 'react-router-dom';

const MenuLink = ({ label, to, activeOnlyWhenExact }) => {
  const match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact,
  });

  return (
    <li className={match ? 'nav-item active' : 'nav-item'}>
      <Link to={to} className="nav-link">
        {label}
        {match && <span className="sr-only">(current)</span>}
      </Link>
    </li>
  );
};

MenuLink.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  activeOnlyWhenExact: PropTypes.string.isRequired,
};

export default MenuLink;
