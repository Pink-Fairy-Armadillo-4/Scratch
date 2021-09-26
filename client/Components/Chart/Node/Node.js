import React from "react"
import ReactDOM from "react-dom"
import * as d3 from "d3"

// Util
import FORCE from "../ForceGraphGenerator"

class Node extends React.Component {
  constructor(props) {
    super(props)
    console.log("Node props", props)
  }

  componentDidMount() {
    this.d3Node = d3
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
      console.log(data)
      data.group === "user" ? this.props.getNodeInfo(data) : console.log(null)
    }

    const handlMouseOut = () => {}

    return (
      <g className="node">
        <circle
          onClick={handleClick}
          onMouseOver={this.props.onMouseOverCallback}
          onMouseOut={this.props.onMouseOutCallback}
        />
      </g>
    )
  }
}

export default Node