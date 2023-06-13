import MenuView from './view/menu';
import FiltersView from './view/filters';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import WaypointsModel from './model/waypoints-model';
import { RenderPosition, renderTemplate } from './presenter/render';
import { generateWaypoint } from './mock/waypoints';

const menuElement = document.querySelector('.trip-controls__navigation');
const filterElement = document.querySelector('.trip-controls__filters');
const tripPresenter = new TripEventsPresenter(document.querySelector('.trip-events'));

const waypoints = generateWaypoint();
const waypointsModel = new WaypointsModel();

renderTemplate(menuElement, new MenuView, RenderPosition.BEFOREEND);
renderTemplate(filterElement, new FiltersView, RenderPosition.BEFOREEND);

waypointsModel.init(waypoints);
tripPresenter.init(waypointsModel);
