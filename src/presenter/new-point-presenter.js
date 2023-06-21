import { render, remove, RenderPosition } from '../framework/render.js';
import WaypointView from '../view/point.js';
import { UserAction, UpdateType } from '../const.js';

export default class NewPointPresenter {
  #waypointListContainer = null;
  #creatingWaypointComponent = null;
  #changeData = null;
  #destroyCallback = null;
  #destinationsModel = null;
  #offersModel = null;
  #destinations = null;
  #offers = null;

  constructor(waypointListContainer, changeData, destinationsModel, offersModel) {
    this.#waypointListContainer = waypointListContainer;
    this.#changeData = changeData;
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

    this.#creatingWaypointComponent = new WaypointView(
      this.#destinations,
      this.#offers,
      true,
    );
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

  setSaving = () => {
    this.#creatingWaypointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    // this.#creatingWaypointComponent.shake(this.#resetFormState);
  };

  #resetFormState = () => {
    this.#creatingWaypointComponent.updateElement({
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
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
      point,
    );
  };
}
