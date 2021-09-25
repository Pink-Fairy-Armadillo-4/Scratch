import React from "react"
import ReactDOM from "react-dom"
import * as d3 from "d3"

// Util
import FORCE from "../utils/force"

class Node extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hoveredNode: null,
    }
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
      data.group === "user" ? console.log({ id: data.id }) : console.log(null)
    }

    return (
      <g className="node">
        <circle
          onClick={handleClick}
          onMouseOver={() => this.props.onMouseOverCallback(this.props.data)}
          onMouseOut={() => this.props.onMouseOutCallback(null)}
        />
      </g>
    )
  }
}

export default Node
