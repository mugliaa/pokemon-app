import React from 'react';
import DashboardView from './DashboardView';

/**
 * This is the container for the dashboard page.
 *
 * @component DashboardContainer
 */
class DashboardContainer extends React.PureComponent {
	/** @inheritdoc */
	render() {
		return (
			<DashboardView />
		);
	}
}

DashboardContainer.propTypes = {};

export { DashboardContainer as DashboardContainerTest };
export default DashboardContainer;
