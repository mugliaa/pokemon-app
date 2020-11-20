import React from 'react';
import Select from "react-select";
import { useForm, Controller } from 'react-hook-form';

/**
 * This is used as the base view of the category search component.
 *
 * @component BetterSelect
 * @inheritdoc
 */
const BetterSelect = ({ name, onBlur, onChange, options, value }) => (
    <Select
        isSearchable={false}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        options={options}
        value={value}
    />
);

/**
 * This is used as the base view of the category search component.
 *
 * @component CategorySearchView
 * @inheritdoc
 */
const CategorySearchView = () => {
    const { control, errors, handleSubmit } = useForm();

    /**
     * Handles submission of the form.
     *
     * @param {object} data - The form values. 
     */
    const onSubmit = (data) => console.log(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="category"
                as={BetterSelect}
                options={[
                    { value: 'pokemon', label: 'Pokemon' },
                    { value: 'berries', label: 'Berries' },
                ]}
                control={control}
                rules={{ required: true }}
            />
            <input type="submit" />
            {errors.category && <span className="text-danger">This field is required</span>}
        </form>
    );
};

CategorySearchView.propTypes = {};

export default CategorySearchView;
