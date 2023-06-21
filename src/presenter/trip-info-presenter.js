import { render, remove } from '../framework/render.js';
import TripInfoView from '../view/trip-info.js';

export default class TripInfoPresenter {
  #waypoints = null;
  #tripInfoComponent = null;
  #tripInfoContainer = null;
  #destinationsModel = null;
  #offersModel = null;

  #destinations = null;
  #offers = null;

  constructor(tripInfoContainer, destinationsModel, offersModel) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init = (waypoints) => {
    this.#waypoints = waypoints;
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#tripInfoComponent = new TripInfoView(this.#waypoints, this.#destinations, this.#offers);

    render(this.#tripInfoComponent, this.#tripInfoContainer);
  };

  destroy = () => {
    remove(this.#tripInfoComponent);
  };
}
