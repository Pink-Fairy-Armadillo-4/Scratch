import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

// Util
import FORCE from '../utils/force';

class Link extends React.Component {
  componentDidMount() {
    this.d3Link = d3
      .select(ReactDOM.findDOMNode(this))
      .datum(this.props.data)
      .call(FORCE.enterLink);
  }

  componentDidUpdate() {
    this.d3Link.datum(this.props.data).call(FORCE.updateLink);
  }

  render() {
    return <line className="link" />;
  }
}

export default Link;
