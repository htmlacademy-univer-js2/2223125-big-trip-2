import AbstractView from '../framework/view/abstract-view';
import { humanizePointDueDate, calculateDuration, renderOffers, getDate, getTime } from '../utils/waypoints';
import he from 'he';

const createTripPointTemplate = (waypoint, destinations, allOffers) => {
  const {type, price, startDate, endDate, isFavorite, destination, offers} = waypoint;
  const allPointTypeOffers = allOffers.find((offer) => offer.type === type);
  const dateFrom = humanizePointDueDate(startDate);
  const dateTo = humanizePointDueDate(endDate);
  const duration = calculateDuration(startDate, endDate);
  const destinationData = destinations.find((item) => item.id === destination);

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${getDate(startDate)}">${dateFrom}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event ${type} icon">
      </div>
      <h3 class="event__title">${type} ${destinationData ? he.encode(destinationData.name) : '' }</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startDate}">${(dateFrom === dateTo) ? getTime(startDate) : dateFrom}</time>
          &mdash;
          <time class="event__end-time" datetime="${endDate}">${(dateFrom === dateTo) ? getTime(endDate) : dateTo}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${renderOffers(allPointTypeOffers, offers)}
      </ul>
      <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class TripPointView extends AbstractView {
  #waypoint = null;
  #destinations = null;
  #offers = null;

  constructor(waypoint, destinations, offers) {
    super();
    this.#waypoint = waypoint;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTripPointTemplate(this.#waypoint, this.#destinations, this.#offers);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
