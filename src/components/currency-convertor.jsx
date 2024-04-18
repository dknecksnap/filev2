import { useEffect, useState } from "react";
import CurrencyDropdown from "./dropdown";
import { HiArrowsRightLeft } from "react-icons/hi2";
import SimpleHistoricalChart from './simple-chart';
import CurrencyInfo from './currency-info';
import TargetDropdown from "./target-dropdown";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [selectedToCurrencies, setSelectedToCurrencies] = useState([]);
  const [convertedAmounts, setConvertedAmounts] = useState({});
  const [converting, setConverting] = useState(false);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || ["PLN", "USD"]
  );

  // Fetch available currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await fetch("https://api.frankfurter.app/currencies");
        const data = await res.json();
      console.log(data);

        setCurrencies(Object.keys(data));
        setCurrencyOptions(Object.keys(data).map(key => ({ value: key, label: key })));
      } catch (error) {
        console.error("Error Fetching", error);
      }
    };
    fetchCurrencies();
  }, []);

  // Convert currency
  const convertCurrency = async () => {
    if (!amount || selectedToCurrencies.length === 0) return;
    setConverting(true);
    try {
      const promises = selectedToCurrencies.map(option =>
        fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${option.value}`)
      );
      const responses = await Promise.all(promises);
      const data = await Promise.all(responses.map(res => res.json()));
      
      const newConvertedAmounts = {};
      data.forEach((item, index) => {
        newConvertedAmounts[selectedToCurrencies[index].value] = item.rates[selectedToCurrencies[index].value];
      });
      setConvertedAmounts(newConvertedAmounts);
    } catch (error) {
      console.error("Error Fetching", error);
    } finally {
      setConverting(false);
    }
  };

   // Handle favorite currencies
   const handleFavorite = (currency) => {
    const updatedFavorites = favorites.includes(currency)
      ? favorites.filter((fav) => fav !== currency)
      : [...favorites, currency];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };


  // Swap currencies
  const swapCurrencies = () => {
    if (selectedToCurrencies.length > 0) {
      const newFromCurrency = selectedToCurrencies[0].value;
      const newSelectedToCurrencies = [{ value: fromCurrency, label: fromCurrency }];
      setFromCurrency(newFromCurrency);
      setSelectedToCurrencies(newSelectedToCurrencies);
    }
  };

  
  // Extract the currency codes from the selectedToCurrencies for the chart
  const comparisonCurrencies = selectedToCurrencies.map(currency => currency.value);

  // Render component
  return (
    <div>
      <h2>Currency Converter</h2>
      <CurrencyDropdown
        favorites={favorites}
        currencies={currencies}
        title="From:"
        currency={fromCurrency}
        setCurrency={setFromCurrency}
        handleFavorite={handleFavorite}
      />
      <button onClick={swapCurrencies}>
        <HiArrowsRightLeft />
      </button>
      <TargetDropdown
        currencyOptions={currencyOptions}
        selectedToCurrencies={selectedToCurrencies}
        setSelectedToCurrencies={setSelectedToCurrencies}
        favorites={favorites}
      />

        <label htmlFor="amount">Amount:</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
        />
      
        <button onClick={convertCurrency}>Convert</button>
      
      {/* Display converted amounts */}
   
        {Object.entries(convertedAmounts).map(([currency, value]) => (
          <div key={currency}>
            Converted to {currency}: {value.toFixed(2)} {currency}
          </div>
        ))}
      
      {selectedToCurrencies.length > 0 && (
        <SimpleHistoricalChart baseCurrency={fromCurrency} comparisonCurrencies={comparisonCurrencies} />
      )}

      {/* Conditional rendering for CurrencyInfo */}
      {fromCurrency && (
        <CurrencyInfo currencyCode={fromCurrency} />
      )}
    </div>
  );
};

export default CurrencyConverter;
