import React from 'react';
import { compose } from 'recompose';

import * as ROLES from '../../constants/roles';
import { withAuthorization } from '../Session';

const Dashboard = () => <div> Welcome to Driver Dash</div>;

const condition = (userrole) => userrole === ROLES.DRIVER;

export default compose(withAuthorization(condition))(Dashboard);
