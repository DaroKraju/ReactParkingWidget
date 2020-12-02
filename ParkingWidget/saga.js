import {call, put, takeLatest} from "redux-saga/effects";
import {fetchParkingInfoSuccess, loader, saveFormSuccess} from "../ParkingWidget/actions";
import {getRequest, postFormRequest} from "../../utils/request";
import {Api} from "../../config/configureApi";
import {error, success} from "react-notification-system-redux";

import {SAVE_FORM, FETCH_PARKING_INFO} from './constants';

function* fetchParkingInfo() {
    yield put(loader(true));
    try {
        const parkingInfoResponse = yield call(
            getRequest,
            Api.getEndpoint(`jsonDataParkingInfo`)
        );
        if(parkingInfoResponse.data.status!=="ok") {
            throw new Error("Invalid api response");
        }
        const parkingInfo = parkingInfoResponse && parkingInfoResponse.data && parkingInfoResponse.data.data;
        // const parkingInfoExtracted = extractParkingInfo(parkingInfo);
        yield put(fetchParkingInfoSuccess(parkingInfo));
        yield put(loader(false));
    } catch (err) {
        yield put(loader(false));
        console.error(err);
        yield put(error({
            title: 'Wystąpił błąd',
            message: 'Coś poszło nie tak. Spróbuj odświeżyć stronę.',
            position: 'tr',
            autoDismiss: 4,
        }));
    }
}

/**
 * Send settings form
 *
 * @param {object} action
 */
function* saveForm(action) {
    const parkingInfo = action.parkingInfo;
    yield put(loader(true));
    try {
        const response=yield call(
            postFormRequest,
            Api.getEndpoint(`parking/save`),
            { parkingInfo }
        );
        if(response.data.status!=="ok") {
            throw new Error(response.data.errors && response.data.errors.join(","));
        }
        yield put(loader(false));
        yield put(success({
            title: 'Zapisano!',
            message: 'Edycja przebiegła pomyślnie.',
            position: 'tr',
            autoDismiss: 4,
        }));
        yield put(saveFormSuccess());
    } catch (err) {
        yield put(loader(false));
        console.error(err);
        yield put(error({
            title: 'Wystąpił błąd',
            message: 'Coś poszło nie tak. Spróbuj odświeżyć stronę.',
            position: 'tr',
            autoDismiss: 4,
        }));
    }
}

// function extractParkingInfo(data) {
//     return  ({
//         isAvailable: data.isAvailable,
//         isPrivate: data.isPrivate,
//         isOnPlace: data.isOnPlace,
//         isPaid: data.isPaid,
//         reservationRequired: data.reservationRequired,
//         // isOnPlace: data.isOnPlace,
//     });
// }

export default function* () {
    yield takeLatest(SAVE_FORM, saveForm);
    yield takeLatest([FETCH_PARKING_INFO], fetchParkingInfo);
}
