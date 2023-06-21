import { render, remove, RenderPosition } from '../framework/render.js';
import PointEditingView from '../view/point-editing.js';
import {nanoid} from 'nanoid';
import { UserAction, UpdateType } from '../const.js';

export default class NewPointPresenter {
  #waypointListContainer = null;
  #editingPointComponent = null;
  #changeData = null;
  #destroyCallback = null;
  #waypointsModel = null;
  #destinations = null;
  #offers = null;
  #isNewPoint = true;

  constructor(waypointListContainer, changeData, waypointsModel) {
    this.#waypointListContainer = waypointListContainer;
    this.#changeData = changeData;
    this.#waypointsModel = waypointsModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#editingPointComponent !== null) {
      return;
    }
    this.#destinations = [...this.#waypointsModel.destinations];
    this.#offers = [...this.#waypointsModel.offers];

    this.#editingPointComponent = new PointEditingView({
      destination: this.#destinations,
      offers: this.#offers,
      isNewPoint: this.#isNewPoint
    });
    this.#editingPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editingPointComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#editingPointComponent, this.#waypointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#editingPointComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#editingPointComponent);
    this.#editingPointComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleDeleteClick = () => {
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
