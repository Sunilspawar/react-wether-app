import React, { useEffect, useReducer, useState } from "react";
import useDebounce from "../utils/useDebounce";
import LocationResultList from "./LocationResultList";
import { getLocattionByCityName } from "../services/OpenCageService";
import { connect } from "react-redux";
import { setLocation } from "../redux/actions";
import { LocationSearchActionEnum as ActionEnum } from "../local-state/location-search/location-search-actions";
import {
  reducer,
  initialState
} from "../local-state/location-search/location-search-reducer";
import { X as XIcon } from "react-feather";

import "./LocationSearch.scss";
import { useHandleClickOutside } from "../utils/useHandleClickOutside";
import { LocationSearchResult } from "../interfaces/location";

interface LocationResults {
  results: LocationSearchResult[];
}

function LocationSearch(props: any) {
  const [disableResults, setDisableResults] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { searchTerm, results, showResults } = state;
  const { locations } = props;
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const dispatchLocalAction = (type: ActionEnum, payload: any) => {
    dispatch({
      type,
      payload
    });
  };

  const node = useHandleClickOutside(() => {
    dispatchLocalAction(ActionEnum.SHOW_RESULTS, false);
  }, [showResults]);

  const getLocation = (term: string) => {
    getLocattionByCityName(term)
      .then((res: LocationResults) => {
        dispatchLocalAction(ActionEnum.SET_RESULTS, res.results);

        props.setLocation({
          term: debouncedSearchTerm.toLowerCase(),
          results: res.results
        });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (
      locations &&
      locations.currentLocation &&
      locations.currentLocation.name
    ) {
      setDisableResults(true);
      dispatchLocalAction(
        ActionEnum.SET_SEARCH_TERM,
        locations.currentLocation.name
      );
    }
  }, []);

  useEffect(() => {
    props.onSearchTermEmpty(!debouncedSearchTerm);
    if (!disableResults) {
      if (debouncedSearchTerm) {
        // load location results from store if possible
        if (locations && locations.locations[debouncedSearchTerm]) {
          console.log(
            "loading location results from store for:",
            debouncedSearchTerm
          );
          dispatchLocalAction(
            ActionEnum.SET_RESULTS,
            locations.locations[debouncedSearchTerm]
          );
        } else {
          // get location results from api
          console.log(
            "get location results from api for:",
            debouncedSearchTerm
          );
          getLocation(debouncedSearchTerm);
        }
      } else {
        if (showResults) {
          dispatchLocalAction(ActionEnum.SHOW_RESULTS, false);
        }
      }
    } else {
      setDisableResults(false);
    }
  }, [debouncedSearchTerm]);

  const onLocationListClicked = (details: Partial<LocationSearchResult>) => {
    dispatchLocalAction(ActionEnum.SHOW_RESULTS, false);
    props.onLocationClicked(details);
  };

  const onInputClicked = () => {
    if (searchTerm && !showResults && results && results.length > 0) {
      dispatchLocalAction(ActionEnum.SHOW_RESULTS, true);
    }
  };

  return (
    <div className="location-search-container">
      <div className="input-wrapper">
        <input
          placeholder="New York"
          value={searchTerm}
          onFocus={onInputClicked}
          onChange={(event) =>
            dispatchLocalAction(ActionEnum.SET_SEARCH_TERM, event.target.value)
          }
        />
        {searchTerm && (
          <button
            className="clear-icon"
            onClick={() => dispatchLocalAction(ActionEnum.SET_SEARCH_TERM, "")}
          >
            <XIcon size={18} color="#656565" />
          </button>
        )}
      </div>
      {results && results.length > 0 && showResults && (
        <div className="result-wrapper" ref={node}>
          <LocationResultList
            results={results}
            onLocationClicked={onLocationListClicked}
          />
        </div>
      )}
    </div>
  );
}

function mapStateToProps(state: any) {
  const { locations } = state;
  return { locations };
}

export default connect(mapStateToProps, { setLocation })(LocationSearch);
