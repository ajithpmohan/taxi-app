import React from 'react';
import { compose } from 'recompose';

import * as ROLES from '../../constants/roles';
import { withAuthorization } from '../Session';

const Dashboard = () => <div> Welcome to Rider Dash</div>;

const condition = (userrole) => userrole === ROLES.RIDER;

export default compose(withAuthorization(condition))(Dashboard);
