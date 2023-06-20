import { RenderPosition, renderTemplate } from './render';
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
      renderTemplate(this.#tripContainer, new EmptyListView(), RenderPosition.BEFOREEND);
    }
    else {
      renderTemplate(this.#tripContainer, new SortView(), RenderPosition.BEFOREEND);
      renderTemplate(this.#tripContainer, this.#waypointsList, RenderPosition.BEFOREEND);

      for (const point of this.#boardPoints){
        this.#renderPoint(point);
      }
    }
  }

  #renderPoint = (point) => {
    const pointComponent = new TripPointView(point);
    const pointEditComponent = new PointEditingView(point);

    const replacePointToEditForm = () => {
      this.#waypointsList.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };

    const replaceEditFormToPoint = () => {
      this.#waypointsList.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToEditForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    renderTemplate(pointComponent, this.#waypointsList.element, RenderPosition.AFTERBEGIN);
  };
}
