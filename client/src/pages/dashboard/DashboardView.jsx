import React from 'react';
import CategorySearchContainer from '../../components/category-search/CategorySearchContainer';

/**
 * This is used as the base view of the dashboard page.
 *
 * @component DashboardView
 * @inheritdoc
 */
const DashboardView = () => (
	<div className="container">
        <div className="row">
            <div className="col">
                <h1>Dashboard</h1>
            </div>
        </div>
        <div className="row">
            <div className="col">
                <CategorySearchContainer />
            </div>
        </div>
    </div>
);

DashboardView.propTypes = {};

export default DashboardView;
