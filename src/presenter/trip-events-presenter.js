import { RenderPosition, renderTemplate } from './render';
import SortView from '../view/sort';
import TripEventList from '../view/trip-event-list';
import TripPoint from '../view/trip-point';
import PointEditingView from '../view/point-editing';
import PointCreationView from '../view/point-creation';

export default class EventsPresenter {
  init(eventsContainer) {
    this.EventsContainer = eventsContainer;

    renderTemplate(new SortView(), this.EventsContainer, RenderPosition.BEFOREEND);
    renderTemplate(new TripEventList(), this.EventsContainer, RenderPosition.BEFOREEND);
    renderTemplate(new PointCreationView(), this.EventsContainer, RenderPosition.BEFOREEND);
    renderTemplate(new PointEditingView(), this.EventsContainer, RenderPosition.AFTERBEGIN);

    for (let i = 0; i < 3; i++) {
      renderTemplate(new TripPoint(), this.EventsContainer, RenderPosition.BEFOREEND);
    }
  }
}
