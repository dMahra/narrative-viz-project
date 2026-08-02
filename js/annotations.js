var App = window.App || (window.App = {});

// Renders scripted, embedded annotations for a guided scene — appears
// immediately on scene render, never behind a mouseover.
App.renderAnnotations = function renderAnnotations(chart, sceneAnnotations) {
  chart.annotationLayer.selectAll("*").interrupt().remove();
  if (!sceneAnnotations || !sceneAnnotations.length) return;

  const yearData = chart.getYearData();

  const items = sceneAnnotations.map(function (a) {
    const d = yearData.find(function (row) { return row.countryCode === a.countryCode; });
    if (!d) return null;
    return {
      note: {
        title: a.title,
        label: a.label,
        wrap: 200
      },
      x: chart.x(d.gdpPerCapita),
      y: chart.y(d.co2PerCapita),
      dx: a.dx,
      dy: a.dy,
      connector: { end: "arrow" },
      className: "narrative-annotation"
    };
  }).filter(Boolean);

  if (!items.length) return;

  const makeAnnotations = d3.annotation()
    .type(d3.annotationCalloutCircle)
    .annotations(items);

  chart.annotationLayer
    .style("opacity", 0)
    .call(makeAnnotations);

  chart.annotationLayer
    .transition().duration(400).delay(500)
    .style("opacity", 1);
};
