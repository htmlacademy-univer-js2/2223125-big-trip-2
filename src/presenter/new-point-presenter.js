import { render, remove, RenderPosition } from '../framework/render.js';
import WaypointView from '../view/point.js';
import {nanoid} from 'nanoid';
import { UserAction, UpdateType } from '../const.js';

export default class NewPointPresenter {
  #waypointListContainer = null;
  #creatingWaypointComponent = null;
  #changeData = null;
  #destroyCallback = null;
  #waypointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #destinations = null;
  #offers = null;

  constructor(waypointListContainer, changeData, waypointsModel, destinationsModel, offersModel) {
    this.#waypointListContainer = waypointListContainer;
    this.#changeData = changeData;
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#creatingWaypointComponent !== null) {
      return;
    }
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#creatingWaypointComponent = new WaypointView({
      destination: this.#destinations,
      offers: this.#offers,
      isNewPoint: true,
    });
    this.#creatingWaypointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#creatingWaypointComponent.setResetClickHandler(this.#handleResetClick);

    render(this.#creatingWaypointComponent, this.#waypointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#creatingWaypointComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#creatingWaypointComponent);
    this.#creatingWaypointComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleResetClick = () => {
    this.destroy();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };
}
