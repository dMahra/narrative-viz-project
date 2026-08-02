var App = window.App || (window.App = {});

// Free-exploration hover tooltip — deliberately styled distinct from the
// d3-annotation callouts so the shift from "guided narrative" to
// "exploratory hover" reads visually, not just behaviorally.
App.createTooltip = function createTooltip(containerSelector) {
  const el = d3.select(containerSelector)
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  function show(event, d) {
    el.style("opacity", 1);
    el.html(
      "<strong>" + d.countryName + "</strong>" +
      "<div class='tooltip-region'>" + d.region + "</div>" +
      "<div class='tooltip-row'><span>GDP per capita (PPP)</span><span>$" +
        d3.format(",.0f")(d.gdpPerCapita) + "</span></div>" +
      "<div class='tooltip-row'><span>CO₂ per capita</span><span>" +
        d3.format(",.2f")(d.co2PerCapita) + " t</span></div>" +
      "<div class='tooltip-row'><span>Population</span><span>" +
        d3.format(",")(d.population) + "</span></div>"
    );
    move(event);
  }

  function move(event) {
    const container = document.querySelector(containerSelector);
    const bounds = container.getBoundingClientRect();
    const x = event.clientX - bounds.left + 16;
    const y = event.clientY - bounds.top + 16;
    el.style("left", x + "px").style("top", y + "px");
  }

  function hide() {
    el.style("opacity", 0);
  }

  return { show: show, move: move, hide: hide };
};
