import React from "react"
import ReactDOM from "react-dom"
import * as d3 from "d3"

// Components
import Link from "./Link"
import Node from "./Node"

// Util
import FORCE from "../utils/force"

class Graph extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addLinkArray: [],
      name: "",
      nodes: [
        { name: "fruit", id: 0 },
        { name: "apple", id: 1 },
        { name: "orange", id: 2 },
        { name: "banana", id: 3 },
        { name: "peanut butter", id: 4 },
      ],
      links: [
        { source: 0, target: 1, id: 0 },
        { source: 0, target: 2, id: 1 },
        { source: 3, target: 4, id: 2 },
      ],
    }
    this.handleAddNode = this.handleAddNode.bind(this)
    this.addNode = this.addNode.bind(this)
  }

  componentDidMount() {
    const data = this.state
    FORCE.initForce(data.nodes, data.links)
    FORCE.tick(this)
    FORCE.drag()
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.nodes !== this.state.nodes ||
      prevState.links !== this.state.links
    ) {
      const data = this.state
      FORCE.initForce(data.nodes, data.links)
      FORCE.tick(this)
      FORCE.drag()
    }
  }

  handleAddNode(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  addNode(e) {
    e.preventDefault()
    this.setState((prevState) => ({
      nodes: [
        ...prevState.nodes,
        { name: this.state.name, id: prevState.nodes.length + 1 },
      ],
      name: "",
    }))
  }

  render() {
    var links = this.state.links.map((link) => {
      return <Link key={link.id} data={link} />
    })
    var nodes = this.state.nodes.map((node) => {
      return <Node data={node} name={node.name} key={node.id} />
    })
    return (
      <div className="graph__container">
        <form className="form-addSystem" onSubmit={this.addNode.bind(this)}>
          <h4 className="form-addSystem__header">New Node</h4>
          <div className="form-addSystem__group">
            <input
              value={this.state.name}
              onChange={this.handleAddNode.bind(this)}
              name="name"
              className="form-addSystem__input"
              id="name"
              placeholder="Name"
            />
            <label className="form-addSystem__label" htmlFor="title">
              Name
            </label>
          </div>
          <div className="form-addSystem__group">
            <input className="btnn" type="submit" value="add node" />
          </div>
        </form>
        <svg className="graph" width={FORCE.width} height={FORCE.height}>
          <g>{links}</g>
          <g>{nodes}</g>
        </svg>
      </div>
    )
  }
}

export default Graph
