import React from 'react';
import { hot } from 'react-hot-loader';
import { withRouter } from 'react-router';
import MainView from './MainView';

/**
 * This is the container for the main component.
 *
 * @component MainContainer
 */
class MainContainer extends React.PureComponent {
	/** @inheritdoc */
	render() {
		return (
			<MainView />
		);
	}
}

MainContainer.propTypes = {};

export { MainContainer as MainContainerTest };
export default hot(module)(withRouter(MainContainer));
