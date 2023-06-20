import MenuView from './view/menu';
import FiltersView from './view/filters';
import EventsPresenter from './presenter/trip-events-presenter.js';
import WaypointsModel from './model/waypoints-model';
import { RenderPosition, render } from './framework/render.js';
import { generateWaypoints } from './utils/waypoints';
import { generateFilter } from './mock/filter';

const menuElement = document.querySelector('.trip-controls__navigation');
const filterElement = document.querySelector('.trip-controls__filters');
const tripPresenter = new EventsPresenter(document.querySelector('.trip-events'));

const waypoints = generateWaypoints();
const waypointsModel = new WaypointsModel();
waypointsModel.init(waypoints);
tripPresenter.init(waypointsModel);

const filters = generateFilter(waypointsModel.waypoints);

render(new MenuView(), menuElement, RenderPosition.BEFOREEND);
render(new FiltersView(filters), filterElement, RenderPosition.BEFOREEND);
