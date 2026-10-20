/* Sekme kayıtları — sıra sekme çubuğundaki sırayı belirler. */
(function () {
  const has = (r) => typeof App.routes[r] === 'function';
  const placeholder = (title) => () => ({ title, render(el) { el.innerHTML = App.ui.empty('clock', title, 'Hazırlanıyor…'); } });
  App.registerTab({ id: 'pathways', title: 'Yolaklar', icon: 'point.3.connected', root: () => has('pathwaysHome') ? App.routes.pathwaysHome({}) : placeholder('Yolaklar')() });
  App.registerTab({ id: 'map', title: 'Harita', icon: 'map', root: () => has('mapHome') ? App.routes.mapHome({}) : placeholder('Harita')() });
  App.registerTab({ id: 'hubs', title: 'Kavşaklar', icon: 'link', root: () => has('hubsHome') ? App.routes.hubsHome({}) : placeholder('Kavşaklar')() });
  App.registerTab({ id: 'enzymes', title: 'Sınav', icon: 'stethoscope', root: () => has('examHome') ? App.routes.examHome({}) : (has('enzymesHome') ? App.routes.enzymesHome({}) : placeholder('Sınav')()) });
  App.registerTab({ id: 'search', title: 'Ara', icon: 'magnifyingglass', root: () => has('searchHome') ? App.routes.searchHome({}) : placeholder('Ara')() });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', App.start);
  else App.start();
})();
