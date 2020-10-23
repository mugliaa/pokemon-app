import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DashboardContainer from '../pages/dashboard/DashboardContainer';

/**
 * This is used as the base view of the application.
 *
 * @component MainView
 * @inheritdoc
 */
const MainView = () => (
	<main>
        <Switch>
            <Route
                exact
                path="/"
                render={({ match, location, history }) => (
                    <DashboardContainer match={match} location={location} history={history} />
                )}
            />
        </Switch>
	</main>
);

MainView.propTypes = {};

export default MainView;
