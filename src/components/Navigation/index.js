import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

const Navigation = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div
      className="collapse navbar-collapse"
      id="navbarSupportedContent"
    >
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link to={ROUTES.HOME} className="nav-link">
            Home
            <span className="sr-only">(current)</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to={ROUTES.RIDER} className="nav-link">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to={ROUTES.REQUESTTRIP} className="nav-link">
            Request a Trip
          </Link>
        </li>
        <li className="nav-item">
          <Link to={ROUTES.SIGNIN} className="nav-link">
            Sign In
          </Link>
        </li>
      </ul>
    </div>
  </nav>
);

export default Navigation;
