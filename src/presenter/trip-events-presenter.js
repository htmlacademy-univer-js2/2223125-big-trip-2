import { RenderPosition, renderTemplate } from './render';
import SortView from '../view/sort';
import TripEventListView from '../view/trip-event-list';
import TripPointView from '../view/trip-point';
import PointEditingView from '../view/point-editing';

export default class EventsPresenter {
  #waypointsList = null;
  #tripContainer = null;
  #waypointsModel = null;
  #boardPoints = null;
  #destinations = null;
  #offers = null;

  constructor(tripContainer) {
    this.eventsList = new TripEventListView();
    this.tripContainer = tripContainer;
    this.#waypointsList = new TripPointView();
    this.#tripContainer = tripContainer;
  }

  init(waypointsModel) {
    this.#waypointsModel = waypointsModel;
    this.#boardPoints = [...this.#waypointsModel.points];
    this.#destinations = [...this.#waypointsModel.destinations];
    this.#offers = [...this.#waypointsModel.offers];

    renderTemplate(new SortView(), this.#tripContainer, RenderPosition.BEFOREEND);
    renderTemplate(this.#waypointsList, this.#tripContainer, RenderPosition.BEFOREEND);

    for (const point of this.#boardPoints){
      this.#renderPoint(point);
    }
  }

  #renderPoint = (point) => {
    const pointComponent = new TripPointView(point, this.#destinations, this.#offers);
    const pointEditComponent = new PointEditingView(point, this.#destinations, this.#offers);

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
