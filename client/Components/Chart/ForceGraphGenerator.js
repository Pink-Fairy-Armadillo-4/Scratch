import ReactDOM from "react-dom"
import * as d3 from "d3"

const FORCE = (function (nsp) {
  const chartWidth = 900,
    chartHeight = 720,
    nodeRadius = 20

  // Force simulation
  const initForce = (nodes, links) => {
    nsp.force = d3
      .forceSimulation(nodes)
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(-nodeRadius - 10)
          .distanceMax(100)
      )
      .force(
        "link",
        d3
          .forceLink(links)
          .distance(nodeRadius * 2)
          .id((d) => d.id)
      )
      .force(
        "center",
        d3
          .forceCenter()
          .x(nsp.width / 2)
          .y(nsp.height / 2)
      )
      .force("collision", d3.forceCollide().radius(nodeRadius + 20))
  }

  // Nodes
  const enterNode = (selection) => {
    const circle = selection
      .select("circle")
      .attr("r", nodeRadius)
      .style("fill", (d) => {
        return d.group === "user" ? "#a58afc" : "#5b93f0"
      })
      .style("stroke", "white")
      .style("stroke-width", "1px")
  }

  const updateNode = (selection) => {
    selection
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .attr("cx", function (d) {
        return (d.x = Math.max(30, Math.min(chartWidth - 30, d.x)))
      })
      .attr("cy", function (d) {
        return (d.y = Math.max(30, Math.min(chartHeight - 30, d.y)))
      })
  }

  // Links
  const enterLink = (selection) => {
    selection.attr("stroke", "#999").attr("stroke-width", 2)
  }

  const updateLink = (selection) => {
    selection
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)
  }

  // Overall graph
  const updateGraph = (selection) => {
    selection.selectAll(".node").call(updateNode)
    selection.selectAll(".link").call(updateLink)
  }

  // Drag handlers
  const dragStarted = (event, d) => {
    if (!event.active) nsp.force.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  const dragging = (event, d) => {
    d.fx = event.x
    d.fy = event.y
  }

  const dragEnded = (event, d) => {
    if (!event.active) nsp.force.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  const drag = () =>
    d3
      .selectAll("g.node")
      .call(
        d3
          .drag()
          .on("start", dragStarted)
          .on("drag", dragging)
          .on("end", dragEnded)
      )

  // Tick
  const tick = (that) => {
    that.d3Graph = d3.select(ReactDOM.findDOMNode(that))
    nsp.force.on("tick", () => {
      that.d3Graph.call(updateGraph)
    })
  }

  nsp.width = chartWidth
  nsp.height = chartHeight
  nsp.enterNode = enterNode
  nsp.updateNode = updateNode
  nsp.enterLink = enterLink
  nsp.updateLink = updateLink
  nsp.updateGraph = updateGraph
  nsp.initForce = initForce
  nsp.dragStarted = dragStarted
  nsp.dragging = dragging
  nsp.dragEnded = dragEnded
  nsp.drag = drag
  nsp.tick = tick

  return nsp
})(FORCE || {})

export default FORCE
