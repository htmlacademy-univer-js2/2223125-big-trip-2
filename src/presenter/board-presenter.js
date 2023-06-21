import { render, RenderPosition, remove } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import TripEventListView from '../view/trip-event-list.js';
import SortView from '../view/sort.js';
import EmptyListView from '../view/empty-point-list.js';
import LoadingView from '../view/loading.js';
import NoAdditionalInfoView from '../view/no-additional-info.js';
import PointPresenter from './point-presenter.js';
import { UpdateType, UserAction, SortType, FilterType, TimeLimit } from '../const.js';
import { sorting } from '../utils/sort.js';
import { filter } from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter.js';
import TripInfoPresenter from './trip-info-presenter.js';


export default class BoardPresenter {
  #tripContainer = null;
  #tripInfoContainer = null;
  #waypointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #emptyWaypointsListComponent = null;
  #sortComponent = null;
  #waypointsListComponent = new TripEventListView();
  #loadingComponent = new LoadingView();
  #noAdditionalInfoComponent = new NoAdditionalInfoView();

  #waypointPresenter = new Map();
  #newWaypointPresenter = null;
  #tripInfoPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(tripContainer, tripInfoContainer, waypointsModel, destinationsModel, offersModel, filterModel) {
    this.#tripContainer = tripContainer;
    this.#tripInfoContainer = tripInfoContainer;
    this.#waypointsModel = waypointsModel;
    this.#destinationsModel =destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#newWaypointPresenter = new NewPointPresenter(
      this.#waypointsListComponent.element,
      this.#handleViewAction,
      this.#destinationsModel,
      this.#offersModel
    );

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
    if (this.#emptyWaypointsListComponent) {
      render(this.#waypointsListComponent, this.#tripContainer);
    }
    this.#newWaypointPresenter.init(callback);
  };

  #handleModeChange = () => {
    this.#newWaypointPresenter.destroy();
    this.#waypointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#waypointPresenter.get(update.id).setSaving();
        try {
          await this.#waypointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#waypointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newWaypointPresenter.setSaving();
        try {
          await this.#waypointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newWaypointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#waypointPresenter.get(update.id).setDeleting();
        try {
          await this.#waypointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#waypointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#waypointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#clearTripInfo();
        this.#renderTripInfo();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        this.#renderTripInfo();
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

  #renderTripInfo = () => {
    this.#tripInfoPresenter = new TripInfoPresenter(this.#tripInfoContainer, this.#destinationsModel, this.#offersModel);
    const sortedPoints = sorting[SortType.DAY](this.#waypointsModel.waypoints);
    this.#tripInfoPresenter.init(sortedPoints);
  };

  #renderPoint = (waypoint) => {
    const waypointPresenter = new PointPresenter(
      this.#waypointsListComponent.element,
      this.#destinationsModel,
      this.#offersModel,
      this.#handleViewAction,
      this.#handleModeChange,
    );

    waypointPresenter.init(waypoint);
    this.#waypointPresenter.set(waypoint.id, waypointPresenter);
  };

  #renderPoints = (waypoints) => {
    waypoints.forEach((waypoint) => this.#renderPoint(waypoint));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderNoAdditionalInfo = () => {
    render(this.#noAdditionalInfoComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderEmptyPointsList = () => {
    this.#emptyWaypointsListComponent = new EmptyListView(this.#filterType);
    render(this.#emptyWaypointsListComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPointList = (waypoints) => {
    render(this.#waypointsListComponent, this.#tripContainer);
    this.#renderPoints(waypoints);
  };

  #clearTripInfo = () => {
    this.#tripInfoPresenter.destroy();
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

    if (this.#offersModel.offers.length === 0 || this.#destinationsModel.destinations.length === 0) {
      this.#renderNoAdditionalInfo();
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
