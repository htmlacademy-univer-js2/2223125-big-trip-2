import { render, replace, remove } from '../framework/render';
import TripPointView from '../view/trip-point';
import PointEditingView from '../view/point-editing';

const Mode = {
  PREVIEW: 'preview',
  EDITING: 'editing',
};

export default class PointPresenter {
  #waypointsListContainer = null;
  #previewComponent = null;
  #editingComponent = null;
  #waypointsModel = null;
  #waypoint = null;

  #changeData = null;
  #changeMode = null;
  #mode = Mode.PREVIEW;

  constructor(waypointsListContainer, waypointsModel, changeData, changeMode) {
    this.#waypointsListContainer = waypointsListContainer;
    this.#waypointsModel = waypointsModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(waypoint) {
    this.#waypoint = waypoint;
    const previousPreviewComponent = this.#previewComponent;
    const previousEditingComponent =  this.#editingComponent;

    this.#previewComponent = new TripPointView(waypoint);
    this.#editingComponent = new PointEditingView(waypoint);

    this.#previewComponent.setEditClickHandler(this.#handleEditClick);
    this.#previewComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editingComponent.setPreviewClickHandler(this.#handlePreviewClick);
    this.#editingComponent.setFormSubmitHandler(this.#handleFormSubmit);

    if (previousPreviewComponent === null || previousEditingComponent === null) {
      render(this.#previewComponent, this.#waypointsListContainer);
      return;
    }

    if (this.#mode === Mode.PREVIEW) {
      replace(this.#previewComponent, previousPreviewComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editingComponent, previousEditingComponent);
    }

    remove(previousPreviewComponent);
    remove(previousEditingComponent);
  }

  destroy = () => {
    remove(this.#previewComponent);
    remove(this.#editingComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.PREVIEW) {
      this.#replaceEditingPointToPreviewPoint();
    }
  };

  #replacePreviewPointToEditingPoint = () => {
    replace(this.#editingComponent, this.#previewComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceEditingPointToPreviewPoint = () => {
    replace(this.#previewComponent, this.#editingComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.PREVIEW;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceEditingPointToPreviewPoint();
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#waypoint, isFavorite: !this.#waypoint.isFavorite});
  };

  #handleEditClick = () => {
    this.#replacePreviewPointToEditingPoint();
  };

  #handlePreviewClick = (evt) => {
    evt.preventDefault();
    this.#replaceEditingPointToPreviewPoint();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(point);
    this.#replaceEditingPointToPreviewPoint();
  };
}
