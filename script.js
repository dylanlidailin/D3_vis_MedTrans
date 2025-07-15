// SETTINGS
const margin = { top: 50, right: 100, bottom: 50, left: 120 },
      cellSize = 30;

const vitals = ["Heart Rate", "Temperature", "Respiratory Rate", "Blood Pressure"];
const times = Array.from(new Set(heatmapData.map(d => d.time)));
const width = vitals.length * cellSize + margin.left + margin.right;
const height = times.length * cellSize + margin.top + margin.bottom;

// SETUP
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// COLOR SCALE
const colorScale = d3.scaleLinear()
  .domain([0, 1, 2, 3])
  .range(["#e0f3db", "#a8ddb5", "#43a2ca", "#d73027"]);

// TOOLTIP
const tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("padding", "6px 12px")
  .style("background", "#fff")
  .style("border", "1px solid #999")
  .style("border-radius", "4px")
  .style("pointer-events", "none")
  .style("font-size", "12px")
  .style("opacity", 0);

// DRAW GRID
const g = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

g.selectAll("rect")
  .data(heatmapData)
  .enter()
  .append("rect")
  .attr("x", d => vitals.indexOf(d.vital) * cellSize)
  .attr("y", d => times.indexOf(d.time) * cellSize)
  .attr("width", cellSize)
  .attr("height", cellSize)
  .attr("fill", d => colorScale(d.severity))
  .on("mouseover", (event, d) => {
    tooltip
      .style("opacity", 1)
      .html(`<strong>${d.vital}</strong><br>Time: ${d.time.slice(11, 16)}<br>Severity: ${d.severity}`)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");
  })
  .on("mouseout", () => tooltip.style("opacity", 0));

// COLUMN LABELS
svg.append("g")
  .selectAll("text")
  .data(vitals)
  .enter()
  .append("text")
  .attr("x", (d, i) => margin.left + i * cellSize + cellSize / 2)
  .attr("y", margin.top - 15)
  .attr("text-anchor", "start")
  .attr("transform", (d, i) => `rotate(-45, ${margin.left + i * cellSize + cellSize / 2}, ${margin.top - 15})`)
  .attr("font-weight", "bold")
  .text(d => d);


// ROW LABELS (TIMES)
svg.append("g")
  .selectAll("text")
  .data(times)
  .enter()
  .append("text")
  .attr("x", margin.left - 10)
  .attr("y", (d, i) => margin.top + i * cellSize + cellSize / 2)
  .attr("text-anchor", "end")
  .attr("alignment-baseline", "middle")
  .attr("font-size", "10px")
  .text(d => d.slice(11, 16));

// LEGEND
const legendX = width - margin.right + 20;
const legendY = margin.top;

const legendData = [0, 1, 2, 3];
const legend = svg.append("g").attr("transform", `translate(${legendX}, ${legendY})`);

legend.selectAll("rect")
  .data(legendData)
  .enter()
  .append("rect")
  .attr("y", (d, i) => i * 25)
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", d => colorScale(d));

legend.selectAll("text")
  .data(legendData)
  .enter()
  .append("text")
  .attr("x", 30)
  .attr("y", (d, i) => i * 25 + 14)
  .text(d => `Severity ${d}`)
  .attr("font-size", "12px");
