/**
 *
 * ParkingWidget actions
 *
 */

import {
    UPDATE_STATE, SAVE_FORM,
    FETCH_PARKING_INFO, FETCH_PARKING_INFO_SUCCESS
} from './constants';
import {LOADER, SAVE_FORM_SUCCESS} from "../ParkingWidget/constants";


/**
* This action saved fetched init data into store.
*
* @export
* @param {boolean} state
* @return {object} An action object with a type of LOADER
*/
export function updateState(state) {
    return {
        type: UPDATE_STATE,
        state,
    };
}

export const saveOptions = (parkingInfo) => {
    return {
        type: SAVE_FORM,
        parkingInfo
    };
}

export function loader(state) {
    return {
        type: LOADER,
        state,
    };
}

export function saveFormSuccess() {
    return {
        type: SAVE_FORM_SUCCESS,
    };
}

export function fetchParkingInfo() {
    return {
        type: FETCH_PARKING_INFO
    };
}


export function fetchParkingInfoSuccess(parkingInfo) {
    return {
        type: FETCH_PARKING_INFO_SUCCESS,
        parkingInfo,
    };
}
