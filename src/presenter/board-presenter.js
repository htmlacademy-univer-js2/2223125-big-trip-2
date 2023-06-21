import { render, RenderPosition, remove } from '../framework/render.js';
import TripEventListView from '../view/trip-event-list.js';
import SortView from '../view/sort.js';
import EmptyListView from '../view/empty-point-list.js';
import PointPresenter from './point-presenter.js';
import { UpdateType, UserAction, SortType, FilterType } from '../const.js';
import { sorting } from '../utils/sort.js';
import { filter } from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter.js';


export default class BoardPresenter {
  #tripContainer = null;
  #waypointsModel = null;
  #filterModel = null;

  #emptyWaypointsListComponent = null;
  #sortComponent = null;
  #waypointsListComponent = new TripEventListView();

  #pointPresenter = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor(tripContainer, waypointsModel, filterModel) {
    this.#tripContainer = tripContainer;
    this.#waypointsModel = waypointsModel;
    this.#filterModel = filterModel;
    this.#newPointPresenter = new NewPointPresenter(this.#waypointsListComponent.element, this.#handleViewAction, this.#waypointsModel);
    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get waypoints() {
    this.#filterType = this.#filterModel.filter;
    const waypoints = this.#waypointsModel.waypoints;
    const filteredPoints = filter[this.#filterType](waypoints);
    sorting[this.#currentSortType](filteredPoints);
    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  createWaypoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(callback);
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#waypointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#waypointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#waypointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#waypointsListComponent.element, this.#waypointsModel, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (waypoints) => {
    waypoints.forEach((waypoint) => this.#renderPoint(waypoint));
  };

  #renderEmptyPointsList = () => {
    this.#emptyWaypointsListComponent = new EmptyListView(this.#filterType);
    render(this.#emptyWaypointsListComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPointList = () => {
    render(this.#waypointsListComponent, this.#tripContainer);
    this.#renderPoints(this.points);
  };

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);

    if (this.#emptyWaypointsListComponent) {
      remove(this.#emptyWaypointsListComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderBoard = () => {
    const waypoints = this.waypoints;
    const waypointsCount = waypoints.length;

    if (waypointsCount === 0) {
      this.#renderEmptyPointsList();
      return;
    }
    this.#renderSort();
    this.#renderPointList();
  };
}
