const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  BEFOREEND: 'beforeend',
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend'
};

const renderTemplate = (container, template, position) => {
  container.insertAdjacentHTML(position, template);
};

export {RenderPosition, renderTemplate};
