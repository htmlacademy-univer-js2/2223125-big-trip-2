import { render } from '../framework/render.js';
import NewPointButtonView from '../view/new-point-button.js';

export default class NewPointButtonPresenter {
  #newPointButtonContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #boardPresenter = null;

  #newPointButtonComponent = null;

  constructor({newPointButtonContainer, destinationsModel, offersModel, boardPresenter}) {
    this.#newPointButtonContainer = newPointButtonContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#boardPresenter = boardPresenter;
  }

  init() {
    this.#newPointButtonComponent = new NewPointButtonView();
  }

  renderNewPointButton = () => {
    render(this.#newPointButtonComponent, this.#newPointButtonContainer);
    this.#newPointButtonComponent.setClickHandler(this.#handleNewPointButtonClick);
    if (this.#offersModel.offers.length === 0 || this.#destinationsModel.destinations.length === 0) {
      this.#newPointButtonComponent.element.disabled = true;
    }
  };

  #handleNewPointFormClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };

  #handleNewPointButtonClick = () => {
    this.#boardPresenter.createPoint(this.#handleNewPointFormClose);
    this.#newPointButtonComponent.element.disabled = true;
  };
}
