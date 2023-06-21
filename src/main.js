import MenuView from './view/menu.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import NewPointButtonPresenter from './presenter/new-point-button-presenter.js';
import WaypointsModel from './model/waypoints-model';
import FilterModel from './model/filter-model.js';
import { RenderPosition, render } from './framework/render.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsApiService from './api/points.js';
import DestinationsApiService from './api/destinations.js';
import OffersApiService from './api/offers.js';
import { END_POINT, AUTHORIZATION } from './const.js';

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
  tripInfoContainer: document.querySelector('.trip-main__trip-info'),
  pointsModel: pointsModel,
  filterModel: filterModel,
  destinationsModel: destinationsModel,
  offersModel: offersModel
});
boardPresenter.init();

const newPointButtonPresenter = new NewPointButtonPresenter({
  newPointButtonContainer: document.querySelector('.trip-main'),
  destinationsModel: destinationsModel,
  offersModel: offersModel,
  boardPresenter: boardPresenter
});

newPointButtonPresenter.init();

offersModel.init().finally(() => {
  destinationsModel.init().finally(() => {
    pointsModel.init().finally(() => {
      newPointButtonPresenter.renderNewPointButton();
    });
  });
});

render(new MenuView(), menuElement, RenderPosition.BEFOREEND);
