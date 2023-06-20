import { createElement } from '../presenter/render';

const createTripEventListTemplate = () => (
  '<ul class="trip-events__list">\
  </ul>'
);

export default class TripEventListView {
  #element = null;

  get template() {
    return createTripEventListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
