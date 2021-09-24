import React from "react"
import ReactDOM from "react-dom"
import * as d3 from "d3"

const FORCE = (function (nsp) {
  var width = 900,
    height = 720,
    initForce = (nodes, links) => {
      nsp.force = d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-1))
        .force(
          "link",
          d3
            .forceLink(links)
            .distance(1)
            .id((d) => d.id)
        )
        .force(
          "center",
          d3
            .forceCenter()
            .x(nsp.width / 2)
            .y(nsp.height / 2)
        )
        .force("collision", d3.forceCollide().radius(10))
    },
    enterNode = (selection) => {
      const circle = selection
        .select("circle")
        .attr("r", 5)
        .style("fill", (d) => {
          return d.group === "user" ? "#a58afc" : "#5b93f0"
        })
        .style("stroke", "white")
        .style("stroke-width", "1px")

      selection
        .select("text")
        .style("fill", "white")
        .style("font-weight", "600")
        .style("text-transform", "uppercase")
        .style("text-anchor", "middle")
        .style("alignment-baseline", "middle")
        .style("font-size", "10px")
        .style("font-family", "Roboto")
    },
    updateNode = (selection) => {
      selection
        .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
        .attr("cx", function (d) {
          return (d.x = Math.max(30, Math.min(width - 30, d.x)))
        })
        .attr("cy", function (d) {
          return (d.y = Math.max(30, Math.min(height - 30, d.y)))
        })
    },
    enterLink = (selection) => {
      selection.attr("stroke", "#999").attr("stroke-width", 2)
    },
    updateLink = (selection) => {
      selection
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)
    },
    updateGraph = (selection) => {
      selection.selectAll(".node").call(updateNode)
      selection.selectAll(".link").call(updateLink)
    },
    dragStarted = (event, d) => {
      if (!event.active) nsp.force.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    },
    dragging = (event, d) => {
      d.fx = event.x
      d.fy = event.y
    },
    dragEnded = (event, d) => {
      if (!event.active) nsp.force.alphaTarget(0)
      d.fx = null
      d.fy = null
    },
    drag = () =>
      d3
        .selectAll("g.node")
        .call(
          d3
            .drag()
            .on("start", dragStarted)
            .on("drag", dragging)
            .on("end", dragEnded)
        ),
    tick = (that) => {
      that.d3Graph = d3.select(ReactDOM.findDOMNode(that))
      nsp.force.on("tick", () => {
        that.d3Graph.call(updateGraph)
      })
    }

  nsp.width = width
  nsp.height = height
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
