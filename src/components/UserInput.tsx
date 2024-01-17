import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";

function CascadingDropdowns({ setQuery }) {
  const [selectedCountry, setSelectedCountry] = useState({
    label: "Select Country",
    id: null,
  });
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchedCountries = Country.getAllCountries();
    const countries = fetchedCountries.map((country) => {
      return {
        label: country.name,
        id: country.isoCode,
      };
    });
    setCountries(countries);
  }, []);

  useEffect(() => {
    if (selectedCountry && selectedState && selectedCity) {
      setQuery(
        `${selectedCity.label}, ${selectedState.label}, ${selectedCountry.label}`
      );
    }
  }, [selectedCountry, selectedState, selectedCity]);

  const handleCountryChange = (e) => {
    setSelectedCountry(e);
    selectedState && setSelectedState(null);
    selectedCity && setSelectedCity(null);
    const fetchedStates = State.getStatesOfCountry(e.id);
    const states = fetchedStates.map((state) => {
      return {
        label: state.name,
        id: state.isoCode,
      };
    });

    setStates(states);
  };
  const handleStateChange = (e) => {
    setSelectedState(e);
    selectedCity && setSelectedCity(null);
    const fetchedCities = City.getCitiesOfState(selectedCountry.id, e.id);
    const cities = fetchedCities.map((city) => {
      return {
        label: city.name,
      };
    });
    setCities(cities);
  };
  const handleCityChange = (e) => {
    setSelectedCity(e);
  };

  return (
    <form className="flex flex-row gap-2 justify-around mt-7">
      <Select
        placeholder="Select Country"
        value={selectedCountry}
        options={countries}
        onChange={handleCountryChange}
      />
      <Select
        placeholder="Select State"
        value={selectedState}
        options={states}
        onChange={handleStateChange}
      />
      <Select
        placeholder="Select City"
        value={selectedCity}
        options={cities}
        onChange={handleCityChange}
      />
    </form>
  );
}

const UserInput = () => {
  const [query, setQuery] = useState("");
  const [inputs, setInputs] = useState(0);
  const [locations, setLocations] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [keyword, setKeyword] = useState("");

  const addLocation = () => {
    if (query === "") {
      return alert("Please select a location");
    } else if (inputs > 19) {
      return alert("You can only add 20 locations");
    } else {
      setInputs(inputs + 1);
      setLocations([...locations, query]);
      setQuery("");
    }
  };

  const startScraping = (keywords,locations) => {
    if(keywords.length === 0 || locations.length === 0){
        return alert("Please add at least one keyword and location")
    }
    var port = chrome.runtime.connect({name: "scraper"});
    port.postMessage({keywords: keywords, locations: locations});
    setKeywords([]);
    setLocations([]);
    setQuery("");
    // setPage("Output")
  }

  return (
    <div className="container w-full text-center">
      <h1 className="text-3xl">Google Maps Web Scrapper</h1>
      <div className="flex flex-row gap-10 w-full justify-around mt-10">
        <div className="w-1/2">
          <h1 className="text-xl">Locations</h1>
          <div>
            <div>
              {locations.map((location) => (
                <p key={location}>{location}</p>
              ))}
            </div>
            <div>
              <CascadingDropdowns setQuery={setQuery} />
            </div>
            <div>
              <button
                onClick={addLocation}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
              >
                + Add Location
              </button>
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-xl">Keywords</h1>
          <div>
            <div>
              {keywords.map((keyword) => (
                <p key={keyword}>{keyword}</p>
              ))}
            </div>
            <div>
              <input
                className="border border-gray-400 w-64 rounded px-2 py-1 mt-6"
                type="text"
                placeholder="Enter Keyword"
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div>
              <button
                onClick={() => setKeywords([...keywords, keyword])}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
              >
                + Add Keyword
              </button>
            </div>
          </div>
        </div>
      </div>
      <button onClick={()=>startScraping(keywords,locations)} className="absolute bottom-0 left-0 right-0 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded text-xl">
        Scrape
      </button>
    </div>
  );
};

export default UserInput;
