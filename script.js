const margin = { top: 50, right: 100, bottom: 50, left: 120 },
      cellSize = 30;

const vitals = ["Heart Rate", "Temperature", "Respiratory Rate", "Blood Pressure"];
const times = Array.from(new Set(heatmapData.map(d => d.time)));
const width = vitals.length * cellSize + margin.left + margin.right;
const height = times.length * cellSize + margin.top + margin.bottom;

const colorScale = d3.scaleLinear()
  .domain([0, 1, 2, 3])
  .range(["#e0f3db", "#a8ddb5", "#43a2ca", "#d73027"]);

// Tooltip
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

function drawHeatmap(data) {
  d3.select("svg").remove(); // clear old chart

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Draw heatmap cells
  const cells = g.selectAll("rect")
    .data(data)
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
    .on("mouseout", () => tooltip.style("opacity", 0))
    .on("click", (event, d) => {
      d3.selectAll("rect").attr("stroke", null);
      g.selectAll("rect")
        .filter(cell => cell.time === d.time || cell.vital === d.vital)
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    });

  // Column headers
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

  // Row labels (times)
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

  // Color legend
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
}

// Initial draw
drawHeatmap(heatmapData);

// Dropdown filtering
document.getElementById("vitalSelect").addEventListener("change", (e) => {
  const selected = e.target.value;
  const filtered = selected === "All"
    ? heatmapData
    : heatmapData.filter(d => d.vital === selected);
  drawHeatmap(filtered);
});
