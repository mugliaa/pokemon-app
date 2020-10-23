import React from 'react';

import CategorySearchView from './CategorySearchView';

/**
 * This is the container for the categgory search component.
 *
 * @component CategorySearchContainer
 */
class CategorySearchContainer extends React.PureComponent {
	/** @inheritdoc */
	render() {
		return (
			<CategorySearchView />
		);
	}
}

CategorySearchContainer.propTypes = {};

export { CategorySearchContainer as CategorySearchContainerTest };
export default CategorySearchContainer;
