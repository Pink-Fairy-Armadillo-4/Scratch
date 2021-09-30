import React from "react"
import ReactDOM from "react-dom"
import * as d3 from "d3"

// Util
import FORCE from "../ForceGraphGenerator"

class Node extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.d3Node = d3
      // eslint-disable-next-line react/no-find-dom-node
      .select(ReactDOM.findDOMNode(this))
      .datum(this.props.data)
      .call(FORCE.enterNode)
  }

  componentDidUpdate() {
    this.d3Node.datum(this.props.data).call(FORCE.updateNode)
  }

  render() {
    const handleClick = () => {
      const data = this.props.data
      this.props.skills.length > 1
        ? this.props.setActiveStyle("text-inactive")
        : this.props.setActiveStyle("text-active")
      data.group === "user" ? this.props.getNodeInfo(data) : console.log(null)
    }

    const handlMouseOut = () => {}

    return (
      <g className="node">
        <circle
          onClick={handleClick}
          onMouseOver={() =>
            this.props.onMouseOverCallback(this.props.hoveredNodeData)
          }
          onMouseOut={() =>
            this.props.onMouseOutCallback(this.props.hoveredNodeData)
          }
        />
      </g>
    )
  }
}

export default Node
