import AbstractView from '../framework/view/abstract-view.js';
import { humanizePointDueDate } from '../utils/waypoints.js';

const renderRouteTrip = (waypoints, destinations) => {
  if (waypoints.length === 0) {
    return '';
  }
  const routeWithoutRepeats = [waypoints[0].destination];
  for (let i = 1; i < waypoints.length; i++) {
    if (waypoints[i].destination !== waypoints[i-1].destination) {
      routeWithoutRepeats.push(waypoints[i].destination);
    }
  }

  if (routeWithoutRepeats.length > 3) {
    const startPoint = destinations.find((item) => item.id === routeWithoutRepeats[0]);
    const endPoint = destinations.find((item) => item.id === routeWithoutRepeats[routeWithoutRepeats.length - 1]);
    return `${startPoint.name} &mdash; ... &mdash; ${endPoint.name}`;
  }

  return routeWithoutRepeats.map((destination) => `${destinations.find((item) => item.id === destination).name}`).join(' &mdash; ');

};
const renderDatesTrip = (waypoints) => {
  if (waypoints.length === 0) {
    return '';
  }
  const startDate = waypoints[0].dateFrom !== null ? humanizePointDueDate(waypoints[0].dateFrom) : '';
  const endDate = waypoints[waypoints.length - 1].dateTo !== null ? humanizePointDueDate(waypoints[waypoints.length - 1].dateTo) : '';
  return `${startDate}&nbsp;&mdash;&nbsp;${endDate}`;
};

const getPricePointOffers = (waypoint, offers) => {
  if (offers.length === 0) {
    return 0;
  }
  let pricePointOffers = 0;
  const offersByType = offers.find((offer) => offer.type === waypoint.type);
  const pointOffers = waypoint.offers;
  pointOffers.forEach((offer) => {
    pricePointOffers += offersByType.offers.find((item) => item.id === offer).price;
  });
  return pricePointOffers;
};

const renderTotalPriceTrip = (waypoints, offers) => {
  if (waypoints.length === 0) {
    return '';
  }
  let totalPrice = 0;
  waypoints.forEach((waypoint) => {
    totalPrice += waypoint.basePrice;
    totalPrice += getPricePointOffers(waypoint, offers);
  });
  return `Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>`;
};

const createTripInfoTemplate = (waypoints, destinations, offers) => {
  if (destinations.length === 0 || offers.length === 0) {
    return '';
  }
  return  `<div class="trip-info"><div class="trip-info__main">
  <h1 class="trip-info__title">${renderRouteTrip(waypoints, destinations)}</h1>
  <p class="trip-info__dates">${renderDatesTrip(waypoints)}</p>
</div>
<p class="trip-info__cost">
  ${renderTotalPriceTrip(waypoints, offers)}
</p></div>`;
};

export default class TripInfoView extends AbstractView {
  #waypoints = null;
  #destinations = null;
  #offers = null;

  constructor(waypoints, destinations, offers) {
    super();
    this.#waypoints = waypoints;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template () {
    return createTripInfoTemplate(this.#waypoints, this.#destinations, this.#offers);
  }
}
