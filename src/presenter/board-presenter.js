import { render, RenderPosition } from '../framework/render.js';
import TripEventListView from '../view/trip-event-list.js';
import SortView from '../view/sort.js';
import EmptyListView from '../view/empty-point-list.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/waypoints.js';
import { SortType } from '../const.js';
import { sortPricePoint, sortDayPoint, sortTimePoint } from '../utils/waypoints.js';


export default class BoardPresenter {
  #tripContainer = null;
  #waypointsModel = null;
  #boardPoints = null;

  #emptyPointsListComponent = new EmptyListView();
  #sortComponent = new SortView();
  #pointsListComponent = new TripEventListView();

  #pointPresenter = new Map();
  #currentSortType = null;
  #sourcedBoardPoints = [];

  constructor(tripContainer, waypointsModel) {
    this.#tripContainer = tripContainer;
    this.#waypointsModel = waypointsModel;
  }

  init() {

    this.#boardPoints = [...this.#waypointsModel.waypoints];

    this.#sourcedBoardPoints = [...this.#waypointsModel.waypoints];

    if (this.#boardPoints.length === 0) {
      this.#renderEmptyPointsList();
    }
    else {
      this.#renderSort();
      this.#renderPointsList();
    }
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem( this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #sortPoint = (sortType) => {
    switch (sortType) {
      case SortType.DAY:
        this.#boardPoints.sort(sortDayPoint);
        break;
      case SortType.TIME:
        this.#boardPoints.sort(sortTimePoint);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortPricePoint);
        break;
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoint(sortType);
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #renderSort = () => {
    this.#boardPoints.sort(sortDayPoint);
    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsListComponent.element, this.#waypointsModel, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (from, to) => {
    this.#boardPoints
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point));
  };

  #renderEmptyPointsList = () => {
    render(this.#emptyPointsListComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderPointsList = () => {
    render(this.#pointsListComponent, this.#tripContainer);
    this.#renderPoints(0, this.#boardPoints.length);
  };
}
