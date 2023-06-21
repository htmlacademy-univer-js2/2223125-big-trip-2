import MenuView from './view/menu.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import WaypointsModel from './model/waypoints-model';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/new-point-button.js';
import { RenderPosition, render } from './framework/render.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsApiService from './api/points.js';
import DestinationsApiService from './api/destinations.js';
import OffersApiService from './api/offers.js';

const AUTHORIZATION = 'Basic hIfpbpd204fpubd6';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const menuElement = document.querySelector('.trip-controls__navigation');

const pointsModel = new WaypointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new OffersApiService(END_POINT, AUTHORIZATION));

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter({
  filterContainer: document.querySelector('.trip-controls__filters'),
  pointsModel: pointsModel,
  filterModel: filterModel
});
filterPresenter.init();

const boardPresenter = new BoardPresenter({
  tripContainer: document.querySelector('.trip-events'),
  pointsModel: pointsModel,
  filterModel: filterModel,
  destinationsModel: destinationsModel,
  offersModel: offersModel
});
boardPresenter.init();

const newPointButtonComponent = new NewPointButtonView();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  boardPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

offersModel.init().finally(() => {
  destinationsModel.init().finally(() => {
    pointsModel.init().finally(() => {
      render(newPointButtonComponent, document.querySelector('.trip-main'));
      newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
    });
  });
});

render(new MenuView(), menuElement, RenderPosition.BEFOREEND);
