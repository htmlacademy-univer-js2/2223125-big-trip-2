import MenuView from './view/menu.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import WaypointsModel from './model/waypoints-model';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/new-point-button.js';
import { RenderPosition, render } from './framework/render.js';
import { generateWaypoints } from './utils/waypoints.js';

const menuElement = document.querySelector('.trip-controls__navigation');

const waypoints = generateWaypoints(5);
const waypointsModel = new WaypointsModel();
waypointsModel.init(waypoints);
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(document.querySelector('.trip-controls__filters'), filterModel, waypointsModel);
filterPresenter.init();
const boardPresenter = new BoardPresenter(document.querySelector('.trip-events'), waypointsModel, filterModel);
boardPresenter.init();

const newPointButtonComponent = new NewPointButtonView();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  boardPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

render(newPointButtonComponent, document.querySelector('.trip-main'));
newPointButtonComponent.setClickHandler(handleNewPointButtonClick);

render(new MenuView(), menuElement, RenderPosition.BEFOREEND);
