import React from "react"
import * as d3 from "d3"

// Components
import Link from "./Link/Link"
import Node from "./Node/Node"
import Tooltip from "./Tooltip/Tooltip"

// Util
import FORCE from "./ForceGraphGenerator"
// import data from '../utils/data';

// Styles
import "./graph.scss"

class ForceGraph extends React.Component {
  constructor(props) {
    super(props)
    this.xScale = d3.scaleLinear()
    this.yScale = d3.scaleLinear()
    this.state = {
      data: this.props.graphData,
      hoveredNode: null,
    }

    this.handleOnMouseOver = this.handleOnMouseOver.bind(this)
    this.handleOnMouseOut = this.handleOnMouseOut.bind(this)
  }

  handleOnMouseOver() {
    this.setState((state) => {
      state.hoveredNode = true
      return state
    })
  }

  handleOnMouseOut() {
    this.setState((state) => {
      state.hoveredNode = null
      return state
    })
  }

  componentDidMount() {
    const data = this.state.data
    FORCE.initForce(data.nodes, data.links)
    FORCE.tick(this)
    FORCE.drag()
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.nodes !== this.state.data.nodes ||
      prevState.links !== this.state.data.links
    ) {
      const data = this.state.data
      FORCE.initForce(data.nodes, data.links)
      FORCE.tick(this)
      FORCE.drag()
    }
  }

  render() {
    const links = this.state.data.links.map((link) => {
      return (
        <Link
          key={JSON.stringify(link.source) + JSON.stringify(link.target)}
          data={link}
        />
      )
    })
    const nodes = this.state.data.nodes.map((node) => {
      return (
        <Node
          data={node}
          name={node.name}
          key={node.id}
          getNodeInfo={this.props.getNodeInfo}
          onMouseOverCallback={this.handleOnMouseOver}
          onMouseOutCallback={this.handleOnMouseOut}
        />
      )
    })
    return (
      <div className="graph__container">
        <svg className="graph" width={FORCE.width} height={FORCE.height}>
          <g>{links}</g>
          <g>{nodes}</g>
        </svg>
        {this.state.hoveredNode ? (
          <Tooltip
            hoveredNode={this.state.hoveredNode}
            // scales={{ xScale, yScale }}
          />
        ) : null}
      </div>
    )
  }
}

export default ForceGraph