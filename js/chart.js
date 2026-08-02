var App = window.App || (window.App = {});

App.REGION_COLORS = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
  "#008300",
  "#4a3aa7"
];

// CO2/capita domain is capped below the true data max on purpose: a few small
// oil/shipping-hub economies (e.g. Palau, Qatar) hit 70-140 t/capita due to
// bunker-fuel accounting, and letting the axis stretch to fit them would
// compress every other country into an unreadable band at the bottom.
App.CO2_DOMAIN_MAX = 22;

App.createChart = function createChart(selector, allData) {
  const margin = { top: 36, right: 32, bottom: 56, left: 64 };
  const width = 760;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select(selector)
    .append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("class", "chart-svg")
    .attr("role", "img")
    .attr("aria-label", "Bubble chart of GDP per capita versus CO2 emissions per capita by country");

  const g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const gx = g.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", "translate(0," + innerHeight + ")");

  const gy = g.append("g")
    .attr("class", "axis axis-y");

  g.append("text")
    .attr("class", "axis-label")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 44)
    .attr("text-anchor", "middle")
    .text("GDP per capita, PPP (constant 2021 intl $) — log scale");

  g.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -48)
    .attr("text-anchor", "middle")
    .text("CO₂ emissions per capita (tonnes)");

  const yearLabel = g.append("text")
    .attr("class", "year-label")
    .attr("x", innerWidth)
    .attr("y", -12)
    .attr("text-anchor", "end")
    .text("");

  const bubbleLayer = g.append("g").attr("class", "bubble-layer");
  const annotationLayer = g.append("g").attr("class", "annotation-layer");

  const gdpExtent = d3.extent(allData, function (d) { return d.gdpPerCapita; });
  const popMax = d3.max(allData, function (d) { return d.population; });

  const x = d3.scaleLog()
    .domain([Math.max(150, gdpExtent[0] * 0.8), gdpExtent[1] * 1.2])
    .range([0, innerWidth])
    .clamp(true);

  const y = d3.scaleLinear()
    .domain([0, App.CO2_DOMAIN_MAX])
    .range([innerHeight, 0])
    .clamp(true);

  const r = d3.scaleSqrt()
    .domain([0, popMax])
    .range([3, 42]);

  const regions = Array.from(new Set(allData.map(function (d) { return d.region; }))).sort();
  const color = d3.scaleOrdinal().domain(regions).range(App.REGION_COLORS);

  gx.call(d3.axisBottom(x).ticks(6, "~s"));
  gy.call(d3.axisLeft(y).ticks(6));

  let currentYearData = [];

  function update(year, opts) {
    opts = opts || {};
    const regionFilter = opts.regionFilter || null;
    const yearData = allData.filter(function (d) { return d.year === year; });
    currentYearData = yearData;
    yearLabel.text(year);

    const sel = bubbleLayer.selectAll("circle.bubble")
      .data(yearData, function (d) { return d.countryCode; });

    sel.exit()
      .transition().duration(500)
      .attr("r", 0)
      .style("opacity", 0)
      .remove();

    const entered = sel.enter().append("circle")
      .attr("class", "bubble")
      .attr("cx", function (d) { return x(d.gdpPerCapita); })
      .attr("cy", function (d) { return y(d.co2PerCapita); })
      .attr("r", 0)
      .style("opacity", 0)
      .attr("fill", function (d) { return color(d.region); });

    const merged = entered.merge(sel);

    merged
      .on("mouseover", opts.onHover || null)
      .on("mousemove", opts.onMove || null)
      .on("mouseout", opts.onOut || null);

    merged
      .transition().duration(750).ease(d3.easeCubicInOut)
      .attr("cx", function (d) { return x(d.gdpPerCapita); })
      .attr("cy", function (d) { return y(d.co2PerCapita); })
      .attr("r", function (d) { return r(d.population); })
      .style("opacity", function (d) {
        return regionFilter && !regionFilter.has(d.region) ? 0.10 : 0.82;
      })
      .attr("fill", function (d) { return color(d.region); });
  }

  function setFilter(regionFilter) {
    bubbleLayer.selectAll("circle.bubble")
      .transition().duration(300)
      .style("opacity", function (d) {
        return regionFilter && !regionFilter.has(d.region) ? 0.10 : 0.82;
      });
  }

  return {
    svg: svg,
    g: g,
    x: x,
    y: y,
    r: r,
    color: color,
    regions: regions,
    update: update,
    setFilter: setFilter,
    innerWidth: innerWidth,
    innerHeight: innerHeight,
    annotationLayer: annotationLayer,
    bubbleLayer: bubbleLayer,
    getYearData: function () { return currentYearData; }
  };
};

App.createLegend = function createLegend(selector, regions, color, onToggle) {
  const wrap = d3.select(selector).append("div").attr("class", "legend");

  const items = wrap.selectAll(".legend-item")
    .data(regions)
    .enter()
    .append("button")
    .attr("class", "legend-item")
    .attr("type", "button")
    .attr("aria-pressed", "true");

  items.append("span")
    .attr("class", "legend-swatch")
    .style("background-color", function (d) { return color(d); });

  items.append("span")
    .attr("class", "legend-label")
    .text(function (d) { return d; });

  const activeSet = new Set(regions);

  items.on("click", function (event, d) {
    if (!onToggle) return;
    if (activeSet.has(d)) {
      activeSet.delete(d);
    } else {
      activeSet.add(d);
    }
    d3.select(this).attr("aria-pressed", activeSet.has(d) ? "true" : "false")
      .classed("legend-item-inactive", !activeSet.has(d));
    const filter = activeSet.size === regions.length ? null : activeSet;
    onToggle(filter);
  });

  function setInteractive(isInteractive) {
    items.classed("legend-item-static", !isInteractive);
    if (!isInteractive) {
      activeSet.clear();
      regions.forEach(function (r) { activeSet.add(r); });
      items.attr("aria-pressed", "true").classed("legend-item-inactive", false);
    }
  }

  return { setInteractive: setInteractive };
};
