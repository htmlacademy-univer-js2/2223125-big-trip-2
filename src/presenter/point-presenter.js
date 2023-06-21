import { render, replace, remove } from '../framework/render';
import TripPointView from '../view/trip-point';
import WaypointView from '../view/point.js';
import { UserAction, UpdateType, Mode } from '../const';

export default class PointPresenter {
  #waypointsListContainer = null;
  #previewComponent = null;
  #editingComponent = null;
  #waypointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #waypoint = null;
  #destinations = null;
  #offers = null;

  #changeData = null;
  #changeMode = null;
  #mode = Mode.PREVIEW;

  constructor(waypointsListContainer, waypointsModel, destinationsModel, offersModel, changeData, changeMode) {
    this.#waypointsListContainer = waypointsListContainer;
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(waypoint) {
    this.#waypoint = waypoint;
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    const previousPreviewComponent = this.#previewComponent;
    const previousEditingComponent =  this.#editingComponent;

    this.#previewComponent = new TripPointView(waypoint);
    this.#editingComponent = new WaypointView({
      waypoint: waypoint,
      destination: this.#destinations,
      offers: this.#offers,
      isNewPoint: true,
    });

    this.#previewComponent.setEditClickHandler(this.#handleEditClick);
    this.#previewComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editingComponent.setPreviewClickHandler(this.#handlePreviewClick);
    this.#editingComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editingComponent.setResetClickHandler(this.#handleResetClick);

    if (previousPreviewComponent === null || previousEditingComponent === null) {
      render(this.#previewComponent, this.#waypointsListContainer);
      return;
    }

    switch (this.#mode) {
      case Mode.PREVIEW:
        replace(this.#previewComponent, previousPreviewComponent);
        break;
      case Mode.EDITING:
        replace(this.#editingComponent, previousEditingComponent);
        break;
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
      this.#editingComponent.reset(this.#waypoint);
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
      this.resetView();
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#waypoint, isFavorite: !this.#waypoint.isFavorite},
    );
  };

  #handleEditClick = () => {
    this.#replacePreviewPointToEditingPoint();
  };

  #handlePreviewClick = (evt) => {
    evt.preventDefault();
    this.resetView();
  };

  #handleFormSubmit = (waypoint) => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      waypoint,
    );
    this.#replaceEditingPointToPreviewPoint();
  };

  #handleResetClick = (waypoint) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      waypoint,
    );
  };
}
