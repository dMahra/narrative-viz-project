(function () {
  const App = window.App || (window.App = {});

  const els = {
    sceneTitle: document.getElementById("scene-title"),
    narration: document.getElementById("narration"),
    chartContainer: document.getElementById("chart-container"),
    legendContainer: document.getElementById("legend-container"),
    prevBtn: document.getElementById("prev-btn"),
    nextBtn: document.getElementById("next-btn"),
    exploreBtn: document.getElementById("explore-btn"),
    progress: document.getElementById("progress"),
    exploreControls: document.getElementById("explore-controls"),
    yearSlider: document.getElementById("year-slider"),
    yearReadout: document.getElementById("year-readout")
  };

  const AVAILABLE_YEARS = [1990, 2000, 2010, 2020, 2022];

  let chart = null;
  let legend = null;
  let tooltip = null;

  function init(data) {
    App.state.data = data;

    chart = App.createChart("#chart-container", data);
    legend = App.createLegend("#legend-container", chart.regions, chart.color, onLegendToggle);
    tooltip = App.createTooltip("#chart-container");

    els.prevBtn.addEventListener("click", function () { goToScene(App.state.sceneIndex - 1); });
    els.nextBtn.addEventListener("click", function () { goToScene(App.state.sceneIndex + 1); });
    els.exploreBtn.addEventListener("click", function () { goToScene(App.scenes.length - 1); });

    els.yearSlider.min = 0;
    els.yearSlider.max = AVAILABLE_YEARS.length - 1;
    els.yearSlider.step = 1;
    els.yearSlider.addEventListener("input", onYearSlide);

    document.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") goToScene(App.state.sceneIndex + 1);
      if (event.key === "ArrowLeft") goToScene(App.state.sceneIndex - 1);
    });

    renderScene(0);
  }

  function goToScene(index) {
    if (index < 0 || index >= App.scenes.length) return;
    renderScene(index);
  }

  function renderScene(index) {
    App.state.sceneIndex = index;
    const scene = App.scenes[index];
    App.state.year = scene.year;
    App.state.regionFilter = null;

    els.sceneTitle.textContent = scene.title;
    els.narration.textContent = scene.narration;

    els.prevBtn.disabled = index === 0;
    els.nextBtn.style.display = scene.interactive ? "none" : "";
    els.nextBtn.disabled = index === App.scenes.length - 1;
    els.exploreBtn.style.display = scene.showExplorePrompt ? "" : "none";
    els.progress.textContent = "Scene " + (index + 1) + " of " + App.scenes.length;

    legend.setInteractive(scene.interactive);
    els.exploreControls.style.display = scene.interactive ? "" : "none";

    if (scene.interactive) {
      const yearIdx = AVAILABLE_YEARS.indexOf(scene.year);
      els.yearSlider.value = yearIdx >= 0 ? yearIdx : AVAILABLE_YEARS.length - 1;
      els.yearReadout.textContent = App.state.year;
    }

    chart.update(App.state.year, {
      regionFilter: App.state.regionFilter,
      onHover: scene.interactive ? onBubbleHover : null,
      onMove: scene.interactive ? onBubbleMove : null,
      onOut: scene.interactive ? onBubbleOut : null
    });

    if (scene.interactive) {
      chart.annotationLayer.selectAll("*").interrupt().remove();
    } else {
      window.setTimeout(function () {
        App.renderAnnotations(chart, scene.annotations);
      }, 60);
      tooltip.hide();
    }
  }

  function onLegendToggle(regionFilter) {
    App.state.regionFilter = regionFilter;
    chart.setFilter(regionFilter);
  }

  function onYearSlide() {
    const year = AVAILABLE_YEARS[+els.yearSlider.value];
    App.state.year = year;
    els.yearReadout.textContent = year;
    chart.update(year, {
      regionFilter: App.state.regionFilter,
      onHover: onBubbleHover,
      onMove: onBubbleMove,
      onOut: onBubbleOut
    });
  }

  function onBubbleHover(event, d) {
    App.state.hoveredCountry = d.countryCode;
    d3.select(this).classed("bubble-hovered", true).raise();
    tooltip.show(event, d);
  }

  function onBubbleMove(event) {
    tooltip.move(event);
  }

  function onBubbleOut() {
    App.state.hoveredCountry = null;
    d3.selectAll(".bubble-hovered").classed("bubble-hovered", false);
    tooltip.hide();
  }

  fetch("data/wdi_growth_emissions.json")
    .then(function (res) { return res.json(); })
    .then(init)
    .catch(function (err) {
      els.narration.textContent = "Could not load data: " + err.message;
    });
})();
