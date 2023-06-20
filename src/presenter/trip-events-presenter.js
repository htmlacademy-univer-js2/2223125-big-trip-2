import { RenderPosition, render, replace } from '../framework/render';
import SortView from '../view/sort';
import TripEventListView from '../view/trip-event-list';
import TripPointView from '../view/trip-point';
import PointEditingView from '../view/point-editing';
import EmptyListView from '../view/empty-point-list';

export default class EventsPresenter {
  #waypointsList = null;
  #tripContainer = null;
  #waypointsModel = null;
  #boardPoints = null;

  constructor(tripContainer) {
    this.eventsList = new TripEventListView();
    this.tripContainer = tripContainer;
    this.#waypointsList = new TripPointView();
    this.#tripContainer = tripContainer;
  }

  init(waypointsModel) {
    this.#waypointsModel = waypointsModel;
    this.#boardPoints = [...this.#waypointsModel.waypoints];
    if (this.#boardPoints.length === 0) {
      render(new EmptyListView(), this.#tripContainer, RenderPosition.BEFOREEND);
    }
    else {
      render(new SortView(), this.#tripContainer, RenderPosition.BEFOREEND);
      render(this.#waypointsList, this.#tripContainer, RenderPosition.BEFOREEND);

      for (const point of this.#boardPoints){
        this.#renderPoint(point);
      }
    }
  }

  #renderPoint = (point) => {
    const pointComponent = new TripPointView(point);
    const pointEditingComponent = new PointEditingView(point);

    const replacePreviewPointToEditingPoint = () => {
      replace(pointEditingComponent, pointComponent);
    };

    const replaceEditingPointToPreviewPoint = () => {
      replace(pointComponent, pointEditingComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditingPointToPreviewPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.setEditClickHandler(() => {
      replacePreviewPointToEditingPoint();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditingComponent.setPreviewClickHandler(() => {
      replaceEditingPointToPreviewPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    pointEditingComponent.setFormSubmitHandler(() => {
      replaceEditingPointToPreviewPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#waypointsList.element, RenderPosition.AFTERBEGIN);
  };
}
