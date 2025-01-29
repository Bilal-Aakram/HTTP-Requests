import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlace } from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlace] = useState([]);
  const [error, SetError] = useState();
  useEffect(() => {
    async function fetchPlace() {
      setIsFetching(true);

      try {
        const places = await fetchAvailablePlace();
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.longitude,
            position.coords.longitude
          );
          setAvailablePlace(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        SetError({
          message: error.message || "Could not fetch place. Please try again!!",
        });
        setIsFetching(false);
      }
    }
    fetchPlace();
  }, []);

  if (error) {
    return <Error title="An Error Occurred!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
