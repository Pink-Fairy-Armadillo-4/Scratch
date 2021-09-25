import React from "react"

// Styles
import "../index.scss"

const Tooltip = ({ hoveredNode, scales }) => {
  // const { xScale, yScale } = scales
  const styles = {
    left: "100px", //`${xScale(100) - 30}px`,
    top: "100px", //`${yScale(100)}px`,
  }

  return (
    <div className="Tooltip" style={styles}>
      <table>
        <thead>
          <tr>
            <th colSpan="2">Test Heading</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="1">id</td>
            <td colSpan="1">{hoveredNode.id}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Tooltip
