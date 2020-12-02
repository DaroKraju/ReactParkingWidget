/**
 *
 * ParkingWidget reducer
 *
 */



import {
    UPDATE_STATE, SAVE_FORM, FETCH_PARKING_INFO, FETCH_PARKING_INFO_SUCCESS
} from './constants';

const initialState = {
    parkingInfo: {
        isAvailable: null,
        isPrivate: null,
        isOnPlace: null,
        isOnPossession: null,
        isPaid: null,
        reservationRequired: null,
        parkingPrice: '',
        priceFor: '',
        parkingPlaces: '',
        parkingDetails: []
    }
};


function ParkingWidget(state = initialState, action) {
    switch (action.type) {
        case UPDATE_STATE:
            return {
                ...state,
                parkingInfo: action.state
            };
        case SAVE_FORM:
            return {
                ...state,
                parkingInfo: action.parkingInfo,
            };
        case FETCH_PARKING_INFO:
            return state;
        case FETCH_PARKING_INFO_SUCCESS:
            return {
                ...state,
                parkingInfo: action.parkingInfo,
            };
        default:
            return state;
    }
}

export default ParkingWidget;
