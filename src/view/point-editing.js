import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getTime } from '../utils/waypoints';
import { doCapitalizeString } from '../utils/waypoints';
import { POINT_TYPES } from '../const.js';

const renderDestinationPictures = (pictures) => {
  let result = '';
  pictures.forEach((picture) => {
    result = `${result}<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
  });
  return result;
};

const renderDestinationNames = (destinations) => {
  let result = '';
  destinations.forEach((destination) => {
    result = `${result}
    <option value="${destination.name}"></option>`;
  });
  return result;
};

const renderOffers = (offers) => {
  let result = '';
  offers.forEach((offer) => {
    result = `${result}
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-luggage" checked>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  });
  return result;
};

const renderEditingPointDateTemplate = (dateFrom, dateTo) => (
  `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getTime(dateFrom)}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getTime(dateTo)}">
  </div>`
);

const renderEditingPointTypeTemplate = (currentType) => POINT_TYPES.map((type) => `<div class="event__type-item">
<input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
<label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${doCapitalizeString(type)}</label>
</div>`).join('');


const createPointEditingTemplate = (waypoint) => {
  const {type, price, startDate, endDate, destination, offers} = waypoint;

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${renderEditingPointTypeTemplate(type)}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${destination.id}">
          ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${destination.id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
          ${renderDestinationNames(destination)}
          </datalist>
        </div>
        ${renderEditingPointDateTemplate(startDate, endDate)}
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${renderOffers(offers)}
          </div>
        </section>
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>
          <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${renderDestinationPictures(destination.pictures)}
                      </div>
                    </div>
        </section>
      </section>
    </form>
  </li>`
  );
};

export default class PointEditingView extends AbstractStatefulView {
  constructor(waypoint) {
    super();
    this._state = PointEditingView.parsePointToState(waypoint);
    this.#setInnerHandlers();
  }

  get template() {
    return createPointEditingTemplate(this._state);
  }

  setPreviewClickHandler = (callback) => {
    this._callback.previewClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#previewClickHandler);
  };

  #previewClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.previewClick();
  };

  reset = (waypoint) => {
    this.updateElement(
      PointEditingView.parsePointToState(waypoint),
    );
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#formSubmitHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setPreviewClickHandler(this._callback.previewClick);
  };

  #pointDestinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destination = this._state.destination.filter((dest) => dest.name === evt.target.value);
    this.updateElement({
      destinationId: destination[0].id,
    });
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offerIds: [],
    });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    if (this._state.offerIds.includes(Number(evt.target.id.slice(-1)))) {
      this._state.offerIds = this._state.offerIds.filter((n) => n !== Number(evt.target.id.slice(-1)));
    }
    else {
      this._state.offerIds.push(Number(evt.target.id.slice(-1)));
    }
    this.updateElement({
      offerIds: this._state.offerIds,
    });
  };


  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(PointEditingView.parseStateToPoint(this._state));
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input').addEventListener('change', this.#pointDestinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersChangeHandler);
  };

  static parsePointToState = (point) => ({...point});

  static parseStateToPoint = (state) => {
    const point = {...state};
    return point;
  };
}
