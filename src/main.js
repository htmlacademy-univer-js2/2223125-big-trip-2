import { createMenuTemplate } from './view/menu';
import { createFilterTemplate } from './view/filters';
import { createSortTemplate } from './view/sort';
import { createListTemplate } from './view/list';
import { createInfoTemplate } from './view/info';
import { RenderPosition, renderTemplate } from './render';

const menuElement = document.querySelector('.trip-controls__navigation');
const filterElement = document.querySelector('.trip-controls__filters');
const sortElement = document.querySelector('.trip-events');
const listElement = document.querySelector('.trip-events');
const infoElement = document.querySelector('.trip-main');

renderTemplate(menuElement, createMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(filterElement, createFilterTemplate(), RenderPosition.BEFOREEND);
renderTemplate(sortElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(listElement, createListTemplate(), RenderPosition.BEFOREEND);
renderTemplate(infoElement, createInfoTemplate(), RenderPosition.AFTERBEGIN);
