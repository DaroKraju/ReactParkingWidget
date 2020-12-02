import React from 'react';
import PropType from 'prop-types';

import { connect } from 'react-redux';
import { compose } from 'redux';

import { updateState, saveOptions, fetchParkingInfo } from "./actions";

import Input from "../../components/Input"
import Button from "../../components/Button"
import Radio from "../../components/RadioGroup/subs/Radio";
import Select from "../../components/Select"
import RadioGroup from "../../components/RadioGroup";
import Checkbox from "../../components/Checkbox"

import reducer from './reducer';
import saga from './saga';
import injectReducer from '../../config/injectReducer';
import injectSaga from '../../config/injectSaga';
import NotificationsWrapper from "../../components/NotificationsWrapper";

/**
 * ParkingWidget
 *
 * @class ParkingWidget
 * @extends {React.Component}
 */

const selectOptions = [
    { label: 'za pobyt', value: 'stay' },
    { label: 'za dobę', value: '24 hours' },
    { label: 'za dzień', value: 'day' },
    { label: 'za godzinę', value: 'hour' }
]

class ParkingWidget extends React.Component {

    updateStore(obj) {
        const { parkingInfo } = this.props.ParkingWidget;
        this.props.parking(
            {
                ...parkingInfo,
                ...obj
            }
        );
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { parkingInfo } = this.props.ParkingWidget;
        this.props.saveOptions(parkingInfo);
    }

    componentDidMount() {
        this.props.fetchParkingInfo()
    }
    getOptionPriceFor = (value) => {
        return selectOptions.filter(s => s.value == value).pop();
    }

    addParkingType(mealId) {
        const { parkingDetails } = this.props.ParkingWidget.parkingInfo;
        const i = parkingDetails.indexOf(mealId);
        if (i === -1) {
            parkingDetails.push(mealId);
        }
        this.updateStore({ parkingDetails })
    }

    removeParkingType(mealId) {
        const { parkingDetails } = this.props.ParkingWidget.parkingInfo;
        const i = parkingDetails.indexOf(mealId);
        if (i !== -1) {
            parkingDetails.splice(i, 1);
        }
        this.updateStore({ parkingDetails })
    }

    render() {

        const parkingTypes = [
            { id: "street", name: 'parking przy ulicy' },
            { id: "garage", name: 'parking w garażu' },
            { id: "guarded", name: 'parking strzeżony' },
            { id: "disabled", name: 'parking dla niepełnosprawnych' },
            { id: "closed", name: 'parking zamknięty' },
            { id: "indoor", name: 'parking kryty' },
            { id: "camera", name: 'parking pod nadzorem kamer' },
            { id: "charging", name: 'stacja ładowania pojazdów elektrycznych' },
            { id: "property", name: 'parking na posesji obiektu' }
        ]

        const {
            isAvailable,
            isPrivate,
            isOnPlace,
            isOnPossession,
            isPaid,
            reservationRequired,
            parkingDetails,
            parkingPrice,
            parkingPlaces,
            priceFor
        } = this.props.ParkingWidget.parkingInfo;

        return (
            <div className="widget">
                <div class="widget__header">
                    <h2>Parking</h2>
                    <p>Określ szczegóły dostępności parkingu dla gości.</p>
                </div>
                <div className="widget__body">
                <div className="widget__section">
                    <label>Czy dostępny jest parking dla gości?</label>
                    <RadioGroup
                        className="radio radio-success radio-inline"
                        name={"isAvailable"}
                        onChange={({ index }) => this.updateStore({ isAvailable: index === 0 })}
                    >
                        <Radio
                            className="checkbox check-success"
                            label="Tak"
                            checked={!!isAvailable}
                        />
                        <Radio
                            className="checkbox check-success"
                            label="Nie"
                            checked={isAvailable==false}
                        />
                    </RadioGroup>
                </div>
                    {isAvailable ? (
                        <>
                        <div className="widget__section">
                            <label>Czy parking jest prywatny czy publiczny?</label>
                            <RadioGroup
                                className="radio radio-success radio-inline"
                                name={"isPrivate"}
                                onChange={({ index }) => this.updateStore({ isPrivate: index === 0 })}
                            >
                                <Radio
                                    className="checkbox check-success"
                                    label="Prywatny"
                                    checked={!!isPrivate}
                                />
                                <Radio
                                    className="checkbox check-success"
                                    label="Publiczny"
                                    checked={isPrivate == false}
                                />
                            </RadioGroup>
                            </div>
                            <div className="widget__section">
                            <label>Czy parking jest na miejscu, czy poza obiektem?</label>
                            <RadioGroup
                                className="radio radio-success radio-inline"
                                name={"isOnPlace"}
                                onChange={({ index }) => this.updateStore({ isOnPlace: index === 0 })}
                            >
                                <Radio
                                    className="checkbox check-success"
                                    label="Na miejscu"
                                    checked={!!isOnPlace}
                                />
                                <Radio
                                    className="checkbox check-success"
                                    label="Poza obiektem"
                                    checked={isOnPlace == false}
                                />
                            </RadioGroup>
                            </div>
                            <div className="widget__section">
                            <label>Czy parking jest na posesji?</label>
                            <RadioGroup
                                className="radio radio-success radio-inline"
                                name={"isOnPossession"}
                                onChange={({ index }) => this.updateStore({ isOnPossession: index === 0 })}
                            >
                                <Radio
                                    className="checkbox check-success"
                                    label="Tak"
                                    checked={!!isOnPossession}
                                />
                                <Radio
                                    className="checkbox check-success"
                                    label="Nie"
                                    checked={isOnPossession == false}
                                />
                            </RadioGroup>
                            </div>
                            <div className="widget__section">
                            <label>Czy parking jest płatny?</label>
                            <RadioGroup
                                className="radio radio-success radio-inline"
                                name={"isPaid"}
                                onChange={({ index }) => this.updateStore({ isPaid: index === 0 })}
                            >
                                <Radio
                                    className="checkbox check-success"
                                    label="Tak"
                                    checked={!!isPaid}
                                />
                                <Radio
                                    className="checkbox check-success"
                                    label="Nie"
                                    checked={isPaid == false}
                                />
                            </RadioGroup>
                            </div>
                            {isPaid ? (
                                <div className="row">
                                   <div className="col-sm-10 col-md-8 col-xl-6">
                                        <div className="row align-items-center">
                                            <div className="col-sm-5">
                                                <Input
                                                    label="Cena za parking"
                                                    onChange={(e) => this.updateStore({ parkingPrice: e, priceFor: !!priceFor ? priceFor : selectOptions[0].value })}
                                                    sufix={'zł'}
                                                    // style={{ maxWidth: 110 }}
                                                    defaultValue={parkingPrice}
                                                />
                                            </div>
                                                <div className="col-sm-5">
                                                <Select
                                                    label="Za jaki okres czasu?"
                                                    options={selectOptions}
                                                    onChange={(e) => this.updateStore({ priceFor: e.value })}
                                                    value={this.getOptionPriceFor(priceFor) ? this.getOptionPriceFor(priceFor) : selectOptions[0]}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ) : ''}
                             <div className="widget__section">
                            <label>Czy wymagana jest rezerwacja miejsca parkingowego?</label>
                            <RadioGroup
                                className="radio radio-success radio-inline"
                                name={"reservationRequired"}
                                onChange={({ index }) => this.updateStore({ reservationRequired: index === 0 })}
                            >
                                <Radio
                                    className="checkbox check-success"
                                    label="Wymagana"
                                    checked={!!reservationRequired}
                                />
                                <Radio
                                    className="checkbox check-success"
                                    label="Niewymagana"
                                    checked={reservationRequired == false}
                                />
                            </RadioGroup>
                            </div>
                            <div className="widget__section">
                            <label>Ile jest miejsc parkingowych?</label>
                            <div className="row">
                                <div className="col-md-4">
                                    <Input
                                        onChange={(e) => this.updateStore({ parkingPlaces: e })}
                                        style={{ maxWidth: 110 }}
                                        defaultValue={parkingPlaces}
                                    />
                                </div>
                            </div>
                            </div>
                            <div className="widget__section">
                            <label>Co charakteryzuje parking?</label>
                            {parkingTypes.map(park => {
                                return (
                                    <Checkbox
                                        // key={index}
                                        className={"checkbox check-info"}
                                        label={park.name}
                                        checked={parkingDetails.indexOf(park.id) !== -1 || parkingDetails.indexOf(park.id.toString()) !== -1}
                                        onChange={(val) => val ? this.addParkingType(park.id) : this.removeParkingType(park.id)}
                                        validation={['required']}
                                    />
                                )
                            })}
                            </div>
                            </>
                    ) : ""}
            </div>
                <div className="widget__footer">
                <Button
                    className="btn btn-lg btn-success w-xs-100 mt-3"
                    onClick={this.onSubmit}
                >
                    <strong>Zapisz</strong>
                </Button>
                </div>
                <NotificationsWrapper />
            </div>
        )
    }
};


ParkingWidget.propTypes = {
};


const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
    return {
        parking: (state) => dispatch(updateState(state)),
        saveOptions: (parkingInfo) => dispatch(saveOptions(parkingInfo)),
        fetchParkingInfo: value => dispatch(fetchParkingInfo())
    };
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'ParkingWidget', reducer });
const withSaga = injectSaga({ key: 'ParkingWidget', saga });

export default compose(
    withReducer,
    withSaga,
    withConnect
)(ParkingWidget);