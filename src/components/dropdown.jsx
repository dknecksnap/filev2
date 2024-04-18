import React from 'react';
import Select from 'react-select';
import { HiOutlineStar, HiStar } from "react-icons/hi2";

const CurrencyDropdown = ({
  currencies,
  currency,
  setCurrency,
  favorites,
  handleFavorite,
  title = "",
}) => {
  const isFavorite = (curr) => favorites.includes(curr);

  // Create an options array for react-select
  const options = [
    ...favorites.map((favCurrency) => ({ value: favCurrency, label: favCurrency })),
    { value: '', label: '──────────', isDisabled: true }, // Divider
    ...currencies
      .filter((curr) => !favorites.includes(curr))
      .map((currCurrency) => ({ value: currCurrency, label: currCurrency })),
  ];

  // Handle selection
  const handleChange = (selectedOption) => {
    setCurrency(selectedOption.value);
  };

  return (
    <div>
      <label htmlFor={title}>{title}</label>
      <div>
        <Select
          value={options.find(option => option.value === currency)}
          onChange={handleChange}
          options={options}
          className="currency-select"
          classNamePrefix="select"
        />
        <button onClick={() => handleFavorite(currency)}>
          {isFavorite(currency) ? <HiStar /> : <HiOutlineStar />}
        </button>
      </div>
    </div>
  );
};

export default CurrencyDropdown;
