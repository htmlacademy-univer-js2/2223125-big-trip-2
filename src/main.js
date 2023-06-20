import MenuView from './view/menu.js';
import FiltersView from './view/filters.js';
import BoardPresenter from './presenter/board-presenter.js';
import WaypointsModel from './model/waypoints-model';
import { RenderPosition, render } from './framework/render.js';
import { generateWaypoints } from './utils/waypoints.js';
import { generateFilter } from './mock/filter.js';

const menuElement = document.querySelector('.trip-controls__navigation');
const filterElement = document.querySelector('.trip-controls__filters');

const waypoints = generateWaypoints(5);
const waypointsModel = new WaypointsModel();
waypointsModel.init(waypoints);
const boardPresenter = new BoardPresenter(document.querySelector('.trip-events'), waypointsModel);
boardPresenter.init();

const filters = generateFilter(waypointsModel.waypoints);

render(new MenuView(), menuElement, RenderPosition.BEFOREEND);
render(new FiltersView(filters), filterElement, RenderPosition.BEFOREEND);
