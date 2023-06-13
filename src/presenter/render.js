const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  BEFOREEND: 'beforeend',
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend'
};

const renderTemplate = (container, component, position) => {
  container.insertAdjacentHTML(position, component.element);
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

export {RenderPosition, renderTemplate, createElement};
