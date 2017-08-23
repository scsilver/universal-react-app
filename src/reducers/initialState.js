import moment from "moment";
export default {
  // const suggestions = {
  //   planSuggestions: [plan:{}],
  //   tripSuggestions: [trips: string],
  //   placeOfStaySuggestions: Place
  // }

  // const journey = {
  //   trips: [],
  //   startDate: new Date(),
  //   endDate: new Date(),
  //    PlacesofStay: [googlePlace]
  //

  //   days: [
  //   morningPlaceOfStay: googlePlace,
  //   eveningPlaceOfStay: googlePlace,

  //   plans: [{
  //     place: googlePlace
  //     time: newDate
  //     planType: oneOF('breakfast, brunch, lunch, happyhour, dinner, evening, recreation... ')

  //   }]
  //   planTravel: {
  //     legs,
  //   }

  //   ]

  //   ]
  // }
  // const trip = {
  //   filters: {
  //     route: number
  //   },
  //   tripSettings: {
  //     origin: "string",
  //     destination: "string",
  //     travelMode: "TRANSIT",
  //     transitOptions: {
  //       departureTime: new Date(),
  //       arrivalTime: new Date()
  //     }
  //   },
  //   routes: []
  // };
  suggestions: {
    places: [],
    plans: [],
    placesOfStay: [],
    cities: []
  },
  map: { center: { lat: 0, lng: 0 } },
  panels: {
    routesPanel: {
      expanded: true
    },
    searchPanel: {
      expanded: false,
      inputs: {
        autoSuggest: {
          origin: {
            value: "london",
            suggestions: []
          },
          destination: {
            value: "paris",
            suggestions: []
          }
        },
        dateTime: {
          originDeparture: moment(),
          destinationArrival: moment()
        }
      }
    },
    suggestionsPanel: {
      expanded: true
    }
  },
  events: {
    trips: [{}],
    plans: [],
    stays: [
      {
        placeOfStay,
        checkIn: moment(),
        checkOut: moment()
      }
    ]
  }, //a trip {selected: {route}, origin: string, destination, transitMode: 'TRANSIT', transitOptions: {departureTime: date, arrivalTime}},
  notifications: {
    spinner: false
  }
};
