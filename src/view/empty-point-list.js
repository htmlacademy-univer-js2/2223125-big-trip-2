import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../const.js';

const EmptyPointsListTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const createEmptyPointsListTemplate = (filterType) => {
  const emptyPointsListTextValue = EmptyPointsListTextType[filterType];

  return (
    `<p class="trip-events__msg">
      ${emptyPointsListTextValue}
    </p>`);
};

export default class EmptyListView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyPointsListTemplate(this.#filterType);
  }
}
