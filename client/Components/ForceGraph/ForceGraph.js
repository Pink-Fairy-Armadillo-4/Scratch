import React, { useState, useEffect } from "react"
import { runForceGraph } from "./forceGraphGenerator"
import styles from "./forceGraph.module.css"
import * as d3 from "d3"

export function ForceGraph({ linksData, nodesData, nodeHoverTooltip }) {
  const containerRef = React.useRef(null)

  useEffect(() => {
    let destroyFn

    d3.select("svg").remove()

    if (containerRef.current) {
      const { destroy } = runForceGraph(
        containerRef.current,
        linksData,
        nodesData,
        nodeHoverTooltip
      )
      destroyFn = destroy
    }

    return destroyFn
  }, [linksData, nodesData])

  return <div ref={containerRef} className={styles.container} />
}
