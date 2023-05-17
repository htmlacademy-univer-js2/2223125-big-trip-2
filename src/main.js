import MenuView from './view/menu';
import FiltersView from './view/filters';
import { RenderPosition, renderTemplate } from './presenter/render';

const menuElement = document.querySelector('.trip-controls__navigation');
const filterElement = document.querySelector('.trip-controls__filters');

renderTemplate(menuElement, new MenuView, RenderPosition.BEFOREEND);
renderTemplate(filterElement, new FiltersView, RenderPosition.BEFOREEND);
