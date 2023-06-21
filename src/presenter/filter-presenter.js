import { render, replace, remove } from '../framework/render.js';
import FilterView from '../view/filters.js';
import { filter } from '../utils/filter.js';
import { FilterType, UpdateType } from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #waypointsModel = null;

  #filterComponent = null;

  constructor(filterContainer, waypointsModel, filterModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#waypointsModel = waypointsModel;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const waypoints = this.#waypointsModel.waypoints;

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'EVERYTHING',
        count: filter[FilterType.EVERYTHING](waypoints).length,
      },
      {
        type: FilterType.PAST,
        name: 'PAST',
        count: filter[FilterType.PAST](waypoints).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'FUTURE',
        count: filter[FilterType.FUTURE](waypoints).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const previousFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (previousFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, previousFilterComponent);
    remove(previousFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
