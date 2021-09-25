import React from 'react';

// Components
import Link from './Link';
import Node from './Node';

// Util
import FORCE from '../utils/force';
import data from '../utils/data';

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = data;
  }

  componentDidMount() {
    const data = this.state;
    FORCE.initForce(data.nodes, data.links);
    FORCE.tick(this);
    FORCE.drag();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.nodes !== this.state.nodes ||
      prevState.links !== this.state.links
    ) {
      const data = this.state;
      FORCE.initForce(data.nodes, data.links);
      FORCE.tick(this);
      FORCE.drag();
    }
  }

  render() {
    const links = this.state.links.map((link) => {
      return <Link key={link.id} data={link} />;
    });
    const nodes = this.state.nodes.map((node) => {
      return <Node data={node} name={node.name} key={node.id} />;
    });
    return (
      <div className="graph__container">
        <svg className="graph" width={FORCE.width} height={FORCE.height}>
          <g>{links}</g>
          <g>{nodes}</g>
        </svg>
      </div>
    );
  }
}

export default Graph;
