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
      hoveredNodeData: { name: "", email: "", x: 0, y: 0 },
    }

    this.handleOnMouseOver = this.handleOnMouseOver.bind(this)
    this.handleOnMouseOut = this.handleOnMouseOut.bind(this)
  }

  handleOnMouseOver(data) {
    this.setState((state, props) => {
      state.hoveredNode = true
      state.hoveredNodeData = {
        name: data.name,
        email: data.email,
        x: data.x,
        y: data.y,
      }
      console.log("Node data from hover ", data)
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
    const data = this.state.data;
    FORCE.initForce(data.nodes, data.links);
    FORCE.tick(this);
    FORCE.drag();
  }

  componentDidUpdate(prevProps, prevState) {

    if (prevProps.graphData !== this.props.graphData) {
      const newState = {...this.state, data: this.props.graphData};
      const data = newState.data;
      FORCE.initForce(data.nodes, data.links);
      FORCE.tick({...this, state: {...this.state, data: data}});
      this.setState(newState);
      console.log('updated state');
    } else if (prevState.data.skills != this.state.data.skills) {
      FORCE.drag();
      console.log('init drag');
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
          hoveredNodeData={node}
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
            data={this.state.hoveredNodeData}
            hoveredNode={this.state.hoveredNode}
            xPosition={this.state.hoveredNodeData.x}
            yPosition={this.state.hoveredNodeData.y}
          />
        ) : null}
      </div>
    )
  }
}

export default ForceGraph
