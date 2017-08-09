const tripDirectionsRequest = ({ tripDirections }) => ({
  type: journeyActionTypes.TRIP_DIRECTIONS_REQUEST,
  tripDirections
});
const actions = {
  tripDirectionsRequest
};

export { actions };
