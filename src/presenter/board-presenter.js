import { render, RenderPosition, remove } from '../framework/render.js';
import TripEventListView from '../view/trip-event-list.js';
import SortView from '../view/sort.js';
import EmptyListView from '../view/empty-point-list.js';
import LoadingView from '../view/loading.js';
import PointPresenter from './point-presenter.js';
import { UpdateType, UserAction, SortType, FilterType } from '../const.js';
import { sorting } from '../utils/sort.js';
import { filter } from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter.js';


export default class BoardPresenter {
  #tripContainer = null;
  #waypointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #emptyWaypointsListComponent = null;
  #sortComponent = null;
  #waypointsListComponent = new TripEventListView();
  #loadingComponent = new LoadingView();

  #waypointPresenter = new Map();
  #newWaypointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  constructor(tripContainer, waypointsModel, destinationsModel, offersModel, filterModel) {
    this.#tripContainer = tripContainer;
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel =destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#newWaypointPresenter = new NewPointPresenter({
      pointListContainer: this.#waypointsListComponent.element,
      changeData: this.#handleViewAction,
      pointsModel: this.#waypointsModel,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
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
    this.#newWaypointPresenter.init(callback);
  };

  #handleModeChange = () => {
    this.#newWaypointPresenter.destroy();
    this.#waypointPresenter.forEach((presenter) => presenter.resetView());
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        remove(this.#emptyWaypointsListComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#waypointPresenter.get(data.id).init(data);
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

  #renderPoint = (waypoint) => {
    const waypointPresenter = new PointPresenter(this.#waypointsListComponent.element, this.#waypointsModel, this.#handleViewAction, this.#handleModeChange);
    waypointPresenter.init(waypoint);
    this.#waypointPresenter.set(waypoint.id, waypointPresenter);
  };

  #renderPoints = (waypoint) => {
    const waypointPresenter = new PointPresenter({
      pointListContainer: this.#waypointsListComponent.element,
      pointsModel: this.#waypointsModel,
      changeData: this.#handleViewAction,
      changeMode: this.#handleModeChange,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });

    waypointPresenter.init(waypoint);
    this.#waypointPresenter.set(waypoint.id, waypointPresenter);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderEmptyPointsList = () => {
    this.#emptyWaypointsListComponent = new EmptyListView(this.#filterType);
    render(this.#emptyWaypointsListComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPointList = (waypoints) => {
    render(this.#waypointsListComponent, this.#tripContainer);
    this.#renderPoints(waypoints);
  };

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#newWaypointPresenter.destroy();
    this.#waypointPresenter.forEach((presenter) => presenter.destroy());
    this.#waypointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#emptyWaypointsListComponent) {
      remove(this.#emptyWaypointsListComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const waypoints = this.waypoints;
    const waypointsCount = waypoints.length;

    if (waypointsCount === 0) {
      this.#renderEmptyPointsList();
      return;
    }
    this.#renderSort();
    this.#renderPointList(waypoints);
  };
}
