const width = 800, height = 400;
const margin = { top: 20, right: 30, bottom: 30, left: 40 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const x = d3.scaleTime()
  .domain(d3.extent(data, d => d.time))
  .range([0, innerWidth]);

const y = d3.scaleLinear()
  .domain(d3.extent(data, d => d.temperature))
  .nice()
  .range([innerHeight, 0]);

const line = d3.line()
  .x(d => x(d.time))
  .y(d => y(d.temperature));

const g = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

g.append("g").call(d3.axisLeft(y));
g.append("g")
  .attr("transform", `translate(0,${innerHeight})`)
  .call(d3.axisBottom(x));

g.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2)
  .attr("d", line);
