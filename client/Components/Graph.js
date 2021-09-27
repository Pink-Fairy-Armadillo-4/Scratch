import React from 'react';
import * as d3 from 'd3';

// Components
import Link from './Link';
import Node from './Node';
import Tooltip from './Tooltip';

// Util
import FORCE from '../utils/force';
//import data from '../utils/data';

// Styles
import '../index.scss';

class Graph extends React.Component {
  constructor(props) {
    super(props);
    console.log('classprops', this.props);

    this.xScale = d3.scaleLinear();
    this.yScale = d3.scaleLinear();
    this.state = {
      data: this.props.graphData,
      hoveredNode: null,
    };
    console.log('thisstate', this.state);
  }

  componentDidMount() {
    const data = this.state.data;
    FORCE.initForce(data.nodes, data.links);
    FORCE.tick(this);
    FORCE.drag();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.nodes !== this.state.data.nodes ||
      prevState.links !== this.state.data.links
    ) {
      const data = this.state.data;
      FORCE.initForce(data.nodes, data.links);
      FORCE.tick(this);
      FORCE.drag();
    }
  }

  render() {
    const links = this.state.data.links.map((link) => {
      return <Link key={link.id} data={link} />;
    });
    const nodes = this.state.data.nodes.map((node) => {
      return (
        <Node
          data={node}
          name={node.name}
          key={node.id}
          getNodeInfo={this.props.getNodeInfo}
          onMouseOverCallback={(datum) => this.setState({ hoveredNode: datum })}
          onMouseOutCallback={() => this.setState({ hoveredNode: null })}
        />
      );
    });
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
    );
  }
}

export default Graph;
