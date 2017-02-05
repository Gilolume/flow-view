import Inferno from 'inferno' // eslint-disable-line no-unused-vars
import Component from 'inferno-component'
import ignoreEvent from '../utils/ignoreEvent'

class Link extends Component {
  render () {
    const {
      id,
      deleteLink,
      from,
      onCreateLink,
      startDraggingLinkTarget,
      selected,
      selectLink,
      sourceSelected,
      targetSelected,
      theme,
      to,
      x1,
      y1,
      x2,
      y2
    } = this.props

    const {
      darkPrimaryColor,
      primaryColor,
      linkColor,
      lineWidth,
      pinSize
    } = theme

    const onSourceMouseDown = (e) => {
      e.preventDefault()
      e.stopPropagation()

      onCreateLink({ from, to: null })
    }

    const onTargetMouseDown = (e) => {
      e.preventDefault()
      e.stopPropagation()

      startDraggingLinkTarget(id)
    }

    const startX = x1 + pinSize / 2
    const startY = y1 + pinSize / 2
    const endX = x2 + pinSize / 2
    const endY = y2 + pinSize / 2

    const midPointY = (startY + endY) / 2

    const controlPointX1 = startX
    const controlPointY1 = to ? midPointY : startY
    const controlPointX2 = endX
    const controlPointY2 = to ? midPointY : endY

    return (
      <g
        onClick={ignoreEvent}
        onDoubleClick={ignoreEvent}
      >
        <path
          d={`M ${startX} ${startY} C ${controlPointX1} ${controlPointY1}, ${controlPointX2} ${controlPointY2} ,${endX} ${endY}`}
          fill='transparent'
          onMouseDown={() => {
            if (selected) deleteLink(id)
          }}
          onMouseUp={selectLink}
          stroke={selected ? primaryColor : linkColor}
          strokeWidth={lineWidth}
        />
        <rect
          fill={(selected || sourceSelected) ? darkPrimaryColor : linkColor}
          height={pinSize}
          onMouseDown={onSourceMouseDown}
          width={pinSize}
          x={x1}
          y={y1}
        />
        {to ? (
          <rect
            fill={(selected || targetSelected) ? darkPrimaryColor : linkColor}
            height={pinSize}
            onMouseDown={onTargetMouseDown}
            width={pinSize}
            x={x2}
            y={y2}
          />
        ) : null}
      </g>
    )
  }
}

export default Link
