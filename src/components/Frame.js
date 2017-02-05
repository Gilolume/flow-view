import Inferno from 'inferno' // eslint-disable-line no-unused-vars
import Component from 'inferno-component'

import no from 'not-defined'

import DefaultLink from './Link'
import DefaultNode from './Node'
import Selector from './Selector'

import computeNodeWidth from '../utils/computeNodeWidth'
import ignoreEvent from '../utils/ignoreEvent'
import xOfPin from '../utils/xOfPin'

var defaultTheme = require('./theme')

const isShift = (code) => (
  (code === 'ShiftLeft') || (code === 'ShiftRight')
)

class Frame extends Component {
  constructor (props) {
    super(props)

    this.state = {
      dynamicView: { height: null, width: null },
      draggedLinkId: null,
      dragging: false,
      dragMoved: false,
      offset: { x: 0, y: 0 },
      pointer: null,
      scroll: { x: 0, y: 0 },
      showSelector: false,
      selectedItems: [],
      shiftPressed: false
    }
  }

  componentDidMount () {
    const {
      container,
      createInputPin,
      createOutputPin,
      deleteInputPin,
      deleteOutputPin,
      dragItems,
      view
    } = this.props

    const setState = this.setState.bind(this)

    document.addEventListener('keydown', ({ code }) => {
      const { endDragging } = this.props

      const {
        dragMoved,
        selectedItems,
        shiftPressed
      } = this.state

      if (isShift(code)) {
        setState({ shiftPressed: true })
      }

      if (code === 'Escape') {
        setState({ selectedItems: [] })
      }

      const selectedNodes = Object.keys(view.node).filter((id) => selectedItems.indexOf(id) > -1)

      if ((selectedNodes.length > 0) && (code.substring(0, 5) === 'Arrow')) {
        const draggingDelta = { x: 0, y: 0 }
        const unit = shiftPressed ? 1 : 10

        if (code === 'ArrowLeft') draggingDelta.x = -unit
        if (code === 'ArrowRight') draggingDelta.x = unit
        if (code === 'ArrowUp') draggingDelta.y = -unit
        if (code === 'ArrowDown') draggingDelta.y = unit

        dragItems(draggingDelta, selectedNodes)

        if (!dragMoved) { setState({ dragMoved: true }) }

        if (!shiftPressed) {
          endDragging(selectedNodes)

          setState({
            dragMoved: false,
            dragging: false
          })
        }
      }

      if (code === 'KeyI') {
        selectedItems.forEach((id) => {
          if (view.node[id] && view.node[id].ins) {
            if (shiftPressed) {
              deleteInputPin(id)
            } else {
              createInputPin(id)
            }
          }
        })
      }

      if (code === 'KeyO') {
        selectedItems.forEach((id) => {
          if (view.node[id] && view.node[id].outs) {
            if (shiftPressed) {
              deleteOutputPin(id)
            } else {
              createOutputPin(id)
            }
          }
        })
      }

      // Since state or props are not modified it is necessary to force update.
      this.forceUpdate()
    })

    document.addEventListener('keyup', ({ code }) => {
      const { endDragging } = this.props

      const {
        dragMoved,
        selectedItems
      } = this.state

      const selectedNodes = Object.keys(view.node).filter((id) => selectedItems.indexOf(id) > -1)

      if (isShift(code)) {
        setState({ shiftPressed: false })

        if (dragMoved && selectedNodes) {
          endDragging(selectedNodes)

          setState({
            dragging: false,
            dragMoved: false
          })
        }
      }
    })

    window.addEventListener('scroll', () => {
      setState({ scroll: {
        x: window.scrollX,
        y: window.scrollY
      }})
    })

    window.addEventListener('resize', () => {
      const rect = container.getBoundingClientRect()

      setState({ dynamicView: {
        height: rect.height,
        width: rect.width
      }})
    })

    const offset = {
      x: container.offsetLeft,
      y: container.offsetTop
    }

    const scroll = {
      x: window.scrollX,
      y: window.scrollY
    }

    setState({ offset, scroll })
  }

  render () {
    var {
      createInputPin,
      createLink,
      createNode,
      createOutputPin,
      custom,
      deleteInputPin,
      deleteLink,
      deleteNode,
      deleteOutputPin,
      dragItems,
      endDragging,
      model,
      selectLink,
      selectNode,
      updateLink,
      view
    } = this.props

    const {
      draggedLinkId,
      pointer,
      dynamicView,
      selectedItems,
      showSelector
    } = this.state

    var height = dynamicView.height || view.height
    var width = dynamicView.width || view.width

    // Remove border, otherwise also server side SVGx renders
    // miss the bottom and right border.
    const border = 1 // TODO frameBorder is 1px, make it dynamic
    height = height - 2 * border
    width = width - 2 * border

    var defaultUtil = {
      typeOfNode: function () { return 'DefaultNode' }
    }

    if (no(custom)) {
      custom = {
        theme: null,
        link: null,
        node: null,
        nodeList: [],
        util: defaultUtil
      }
    }

    var theme = custom.theme || defaultTheme

    var fontSize = theme.fontSize || defaultTheme.fontSize
    var frameBorder = theme.frameBorder || defaultTheme.frameBorder
    var fontFamily = theme.fontFamily || defaultTheme.fontFamily
    var nodeBodyHeight = theme.nodeBodyHeight || defaultTheme.nodeBodyHeight
    var pinSize = theme.pinSize || defaultTheme.pinSize

    if (no(custom.link)) custom.link = {}
    if (no(custom.link.DefaultLink)) custom.link.DefaultLink = DefaultLink
    var Link = custom.link.DefaultLink

    if (no(custom.node)) custom.node = {}
    if (no(custom.node.DefaultNode)) custom.node.DefaultNode = DefaultNode
    var Node = custom.node.Defaultnode

    var typeOfNode = custom.util.typeOfNode || defaultUtil.typeOfNode

    const setState = this.setState.bind(this)

    const coordinatesOfLink = ({ from, to }) => {
      var x1 = null
      var y1 = null
      var x2 = null
      var y2 = null

      var nodeIds = Object.keys(view.node)
      var idEquals = (x) => (id) => (id === x[0])
      var sourceId = (from ? nodeIds.find(idEquals(from)) : null)
      var targetId = (to ? nodeIds.find(idEquals(to)) : null)

      var computedWidth = null

      if (sourceId) {
        var source = view.node[sourceId]

        if (no(source.outs)) source.outs = {}

        computedWidth = computeNodeWidth({
          bodyHeight: nodeBodyHeight,
          pinSize,
          fontSize,
          node: source
        })

        x1 = source.x + xOfPin(pinSize, computedWidth, source.outs.length, from[1])
        y1 = source.y + pinSize + nodeBodyHeight
      }

      if (targetId) {
        var target = view.node[targetId]

        if (no(target.ins)) target.ins = {}

        computedWidth = computeNodeWidth({
          bodyHeight: nodeBodyHeight,
          pinSize,
          fontSize,
          node: target
        })

        x2 = target.x + xOfPin(pinSize, computedWidth, target.ins.length, to[1])
        y2 = target.y
      } else {
        // FIXME at first, pointer is null. This trick works, but,
        // it should be reviosioned when implementing creating links
        // in the opposite direction.
        x2 = pointer ? (pointer.x - pinSize / 2) : x1
        y2 = pointer ? (pointer.y - pinSize) : y1
      }

      return { x1, y1, x2, y2 }
    }

    const getCoordinates = (e) => {
      const {
        offset,
        scroll
      } = this.state

      return {
        x: e.clientX - offset.x + scroll.x,
        y: e.clientY - offset.y + scroll.y
      }
    }

    const onClick = (e) => {
      e.preventDefault()
      e.stopPropagation()

      setState({ showSelector: false })
    }

    const onCreateLink = (link) => {
      const draggedLinkId = createLink(link)

      setState({ draggedLinkId })
    }

    const onUpdateLink = (id, link) => {
      updateLink(id, link)

      const disconnectingLink = (link.to === null)

      if (disconnectingLink) {
        link.id = id

        setState({ draggedLinkId: id })
      } else {
        setState({ draggedLinkId: null })
      }
    }

    const onDoubleClick = (e) => {
      e.preventDefault()
      e.stopPropagation()

      setState({
        pointer: getCoordinates(e),
        showSelector: true
      })
    }

    const onMouseDown = (e) => {
      e.preventDefault()
      e.stopPropagation()

      // TODO code here to start selectedArea dragging
      setState({
        selectedItems: []
      })
    }

    const onMouseLeave = (e) => {
      e.preventDefault()
      e.stopPropagation()

      const draggedLinkId = this.state.draggedLinkId
      if (draggedLinkId) delete view.link[draggedLinkId]

      setState({
        dragging: false,
        draggedLinkId: null,
        pointer: null,
        showSelector: false
      })
    }

    const onMouseMove = (e) => {
      e.preventDefault()
      e.stopPropagation()

      const {
        dragging,
        dragMoved,
        selectedItems
      } = this.state

      const nextPointer = getCoordinates(e)

      setState({
        pointer: nextPointer
      })

      if (dragging && (selectedItems.length > 0)) {
        const draggingDelta = {
          x: (pointer ? nextPointer.x - pointer.x : 0),
          y: (pointer ? nextPointer.y - pointer.y : 0)
        }

        dragItems(draggingDelta, selectedItems)

        if (!dragMoved) { setState({ dragMoved: true }) }
      }
    }

    const onMouseUp = (e) => {
      e.preventDefault()
      e.stopPropagation()

      const {
        draggedLinkId,
        dragMoved,
        selectedItems
      } = this.state

      if (draggedLinkId) {
        delete view.link[draggedLinkId]

        setState({
          draggedLinkId: null,
          pointer: null
        })
      } else {
        const selectedNodes = Object.keys(view.node).filter((id) => selectedItems.indexOf(id) > -1)

        if (dragMoved) {
          endDragging(selectedNodes)

          setState({
            dragging: false,
            dragMoved: false,
            pointer: null
          })
        } else {
          setState({
            pointer: null
          })
        }
      }
    }

    /**
     * Bring up selected nodes.
     */

    const selectedFirst = (a, b) => {
      // FIXME it works, but it would be nice if the selected
      // items keep being up after deselection.
      const aIsSelected = (selectedItems.indexOf(a) > -1)
      const bIsSelected = (selectedItems.indexOf(b) > -1)

      if (aIsSelected && bIsSelected) return 0

      if (aIsSelected) return 1
      if (bIsSelected) return -1
    }

    const selectItem = (id) => (e) => {
      e.preventDefault()
      e.stopPropagation()

      const {
        draggedLinkId,
        shiftPressed
      } = this.state

      // Do not select items when releasing a dragging link.

      if (draggedLinkId) {
        delete view.link[draggedLinkId]

        setState({ draggedLinkId: null })

        return
      }

      var selectedItems = Object.assign([], this.state.selectedItems)

      const index = selectedItems.indexOf(id)

      const itemAlreadySelected = index > -1

      // Shift key allows multiple selection.

      if (shiftPressed) {
        if (itemAlreadySelected) {
          selectedItems.splice(index, 1)
        } else {
          selectedItems.push(id)
        }
      } else {
        if (!itemAlreadySelected) {
          selectedItems = [id]
        }
      }

      if (!itemAlreadySelected) {
        if (Object.keys(view.node).indexOf(id) > -1) {
          selectNode(id)
        }

        if (Object.keys(view.link).indexOf(id) > -1) {
          selectLink(id)
        }
      }

      setState({
        dragging: true,
        selectedItems
      })
    }

    const startDraggingLinkTarget = (id) => {
      // Remember link source.
      const from = view.link[id].from

      // Delete dragged link so the 'deleteLink' event is triggered.
      deleteLink(id)

      // Create a brand new link, this is the right choice to avoid
      // conflicts, for example the user could start dragging the link
      // target and then drop it again in the same target.
      const draggedLinkId = createLink({ from })
      setState({ draggedLinkId })
    }

    return (
      <svg
        fontFamily={fontFamily}
        fontSize={fontSize}
        height={height}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseDown={onMouseDown}
        onMouseEnter={ignoreEvent}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        textAnchor='start'
        style={{border: frameBorder}}
        width={width}
      >
        {Object.keys(view.node).sort(selectedFirst).map((id, i) => {
          const node = view.node[id]

          const {
            height,
            ins,
            outs,
            text,
            width,
            x,
            y
          } = node

          var nodeType = typeOfNode(node)
          var Node = custom.node[nodeType]

          return (
            <Node key={i}
              createInputPin={createInputPin}
              createOutputPin={createOutputPin}
              draggedLinkId={draggedLinkId}
              deleteInputPin={deleteInputPin}
              deleteNode={deleteNode}
              deleteOutputPin={deleteOutputPin}
              height={height}
              id={id}
              ins={ins}
              model={model}
              multiSelection={(selectedItems.length > 1)}
              onCreateLink={onCreateLink}
              outs={outs}
              pinSize={pinSize}
              selected={(selectedItems.indexOf(id) > -1)}
              selectNode={selectItem(id)}
              theme={theme}
              text={text}
              updateLink={onUpdateLink}
              width={width}
              x={x}
              y={y}
            />
          )
        })}
        {Object.keys(view.link).map((id, i) => {
          const {
            from,
            to
          } = view.link[id]

          const coord = coordinatesOfLink(view.link[id])
          const sourceSelected = from ? (selectedItems.indexOf(from[0]) > -1) : false
          const targetSelected = to ? (selectedItems.indexOf(to[0]) > -1) : false

          return (
            <Link key={i}
              deleteLink={deleteLink}
              from={from}
              id={id}
              onCreateLink={onCreateLink}
              startDraggingLinkTarget={startDraggingLinkTarget}
              pinSize={pinSize}
              selected={(selectedItems.indexOf(id) > -1)}
              selectLink={selectItem(id)}
              sourceSelected={sourceSelected}
              targetSelected={targetSelected}
              theme={theme}
              to={to}
              x1={coord.x1}
              y1={coord.y1}
              x2={coord.x2}
              y2={coord.y2}
            />
          )
        })}
        <Selector
          createNode={(node) => {
            const id = createNode(node)

            setState({
              selectedItems: [id],
              showSelector: false
            })
          }}
          nodeList={custom.nodeList}
          pointer={pointer}
          show={showSelector}
        />
      </svg>
    )
  }
}

export default Frame
