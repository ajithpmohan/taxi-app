import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import * as ROUTES from 'constants/routes';

const REDIRECT_URL = {
  DRIVER: ROUTES.DRIVER,
  RIDER: ROUTES.RIDER,
  ADMIN: ROUTES.HOME,
};

const withPublicRouter = (Component) => {
  class WithPublicRouter extends React.Component {
    componentDidMount() {
      this.checkAndRedirect();
    }

    componentDidUpdate() {
      this.checkAndRedirect();
    }

    checkAndRedirect() {
      const { authUser, history } = this.props;
      if (authUser.isAuthenticated) {
        history.push(REDIRECT_URL[authUser.user?.role]);
      }
    }

    render() {
      const { authUser } = this.props;
      return (
        <Container>
          <Row className="justify-content-md-center">
            <Col xs lg="6">
              <Card>
                <Card.Body>
                  {!authUser.isAuthenticated ? (
                    <Component {...this.props} />
                  ) : null}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }
  }

  WithPublicRouter.propTypes = {
    authUser: PropTypes.shape({
      refresh: PropTypes.string,
      access: PropTypes.string,
      user: PropTypes.objectOf(PropTypes.string),
      isAuthenticated: PropTypes.bool,
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  WithPublicRouter.defaultProps = {
    authUser: null,
  };

  const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
  });

  return compose(
    withRouter,
    connect(mapStateToProps),
  )(WithPublicRouter);
};

export default withPublicRouter;
