import React from 'react';
import Select from 'react-select';

const TargetDropdown = ({
  currencyOptions,
  selectedToCurrencies,
  setSelectedToCurrencies,
  favorites
}) => {
  // Create an options array for react-select with favorites and a divider
  const getOptionsWithFavorites = () => {
    const favoriteOptions = favorites.map(fav => ({
      value: fav,
      label: fav,
      isFavorite: true
    }));

    const regularOptions = currencyOptions
      .filter(option => !favorites.includes(option.value))
      .map(option => ({ ...option, isFavorite: false }));

    return [
      ...favoriteOptions,
      { value: '', label: '──────────', isDisabled: true }, // Divider
      ...regularOptions
    ];
  };

  return (
    <Select
      isMulti
      options={getOptionsWithFavorites()}
      value={selectedToCurrencies}
      onChange={setSelectedToCurrencies}
      className="currency-select"
      classNamePrefix="select"
      placeholder="Select target currencies..."
    />
  );
};

export default TargetDropdown;
