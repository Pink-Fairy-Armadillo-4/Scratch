import React from "react"

// Styles
import "./tooltip.scss"

const Tooltip = ({ data, xPosition, yPosition, scales }) => {
  // const { xScale, yScale } = scales
  const styles = {
    left: `${xPosition}px`, //`${xScale(100) - 30}px`,
    top: `${yPosition}px`, //`${yScale(100)}px`,
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
            <td colSpan="1">name</td>
            <td colSpan="1">{data.name}</td>
          </tr>
          <tr>
            <td colSpan="1">email</td>
            <td colSpan="1">{data.email}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Tooltip
