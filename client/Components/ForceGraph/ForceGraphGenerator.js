import * as d3 from 'd3';
import styles from './forceGraph.module.css';

export function runForceGraph(
  container,
  linksData,
  nodesData,
  skillsData,
  nodeHoverTooltip,
  getNodeInfo,
  setActiveStyle,
  activeStyle,
  setRecipient,
) {
  // D3 requires an array of links and nodes for the force graph.
  const links = linksData.map((d) => Object.assign({}, d));
  const nodes = nodesData.map((d) => Object.assign({}, d));

  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;

  // The drag function is configured here and eventually bound to the nodes
  const drag = (simulation) => {
    const dragstarted = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const dragended = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
  };

  // Add the tooltip element to the DOM
  const tooltip = document.querySelector('#graph-tooltip');
  if (!tooltip) {
    const tooltipDiv = document.createElement('div');
    tooltipDiv.classList.add(styles.tooltip);
    tooltipDiv.style.opacity = '0';
    tooltipDiv.id = 'graph-tooltip';
    document.body.appendChild(tooltipDiv);
  }
  const div = d3.select('#graph-tooltip');

  // Style and position the tooltip on hover
  const addTooltip = (hoverTooltip, d, x, y) => {
    div.transition().duration(200).style('opacity', 0.9);
    div
      .html(hoverTooltip(d))
      .style('left', `${x}px`)
      .style('top', `${y - 28}px`);
  };

  // Only show the message contain when a single skill is selected
  const showMessageContainer = (getNodeInfo, d) => {
    if (skillsData.length > 1) {
      setActiveStyle('text-inactive');
    } else {
      setActiveStyle('text-active');
    }
    if (d.group === 'user') {
      getNodeInfo(d);
    }
  };

  const removeTooltip = () => {
    div.transition().duration(200).style('opacity', 0);
  };

  // The simulation will be call for every tick and drag event
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      'link',
      d3.forceLink(links).id((d) => d.id),
    )
    .force('charge', d3.forceManyBody().strength(-150))
    .force('x', d3.forceX())
    .force('y', d3.forceY());

  // Bind an SVG to the container
  const svg = d3
    .select(container)
    .append('svg')
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    .call(
      d3.zoom().on('zoom', function () {
        svg.attr('transform', d3.event.transform);
      }),
    );

  // Append a group and line for each elem of the links array to the svg
  const link = svg
    .append('g')
    .selectAll('line')
    .append('line')
    .data(links, (d) => d)
    .join('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', (d) => Math.sqrt(d.value));

  // Append a group and circle for each elem of the nodes array to the svg
  const node = svg
    .append('g')
    .selectAll('circle')
    .append('circle')
    .data(nodes, (d) => d)
    .join('circle')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .attr('r', (d) => {
      return d.radius;
    })
    .attr('fill', (d) => {
      return d.group === 'user' ? '#a58afc' : '#5b93f0';
    })
    .call(drag(simulation));

  // const label = svg
  //   .append("g")
  //   .attr("class", "labels")
  //   .selectAll("text")
  //   .data(nodes)
  //   .enter()
  //   .append("text")
  //   .attr("text-anchor", "middle")
  //   .attr("dominant-baseline", "central")
  //   .text((d) => d.group)
  //   .call(drag(simulation))

  // Create the event listeners to the nodes
  node
    .on('mouseover', (d) => {
      addTooltip(nodeHoverTooltip, d, d3.event.pageX, d3.event.pageY);
    })
    .on('mouseout', () => {
      removeTooltip();
    })
    .on('click', (d) => {
      // TODO: Update recipr ... d.email === clicked node
      console.log('d??', d);
      setRecipient(d);
      showMessageContainer(getNodeInfo, d);
    });

  simulation.on('tick', () => {
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

    // update label positions
    // label
    //   .attr("x", (d) => {
    //     return d.x
    //   })
    //   .attr("y", (d) => {
    //     return d.y
    //   })
  });

  // Return the view box and ability to stop the simulation
  return {
    destroy: () => {
      simulation.stop();
    },
    nodes: () => {
      return svg.node();
    },
  };
}
