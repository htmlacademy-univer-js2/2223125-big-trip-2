import MenuView from './view/menu';
import FiltersView from './view/filters';
import EventsPresenter from './presenter/trip-events-presenter.js';
import WaypointsModel from './model/waypoints-model';
import { RenderPosition, renderTemplate } from './presenter/render';
import { generateWaypoints } from './utils/waypoints';

const menuElement = document.querySelector('.trip-controls__navigation');
const filterElement = document.querySelector('.trip-controls__filters');
const tripPresenter = new EventsPresenter(document.querySelector('.trip-events'));

const waypoints = generateWaypoints();
const waypointsModel = new WaypointsModel();

renderTemplate(menuElement, new MenuView(), RenderPosition.BEFOREEND);
renderTemplate(filterElement, new FiltersView(), RenderPosition.BEFOREEND);

waypointsModel.init(waypoints);
tripPresenter.init(waypointsModel);
