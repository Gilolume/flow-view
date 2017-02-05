import Inferno from 'inferno' // eslint-disable-line no-unused-vars

import EventEmitter from 'events'
import no from 'not-defined'

import Frame from './components/Frame'

var randomString = require('./utils/randomString')(3)

class Canvas extends EventEmitter {
  constructor (containerId, options) {
    super()

    this.container = null

    // Check that containerId is a string.
    if (typeof containerId !== 'string') {
      throw new TypeError('containerId must be a string', containerId)
    }

    // If we are in browser context, get the document element containing
    // the canvas or create it.
    if (typeof document !== 'undefined') {
      let container = document.getElementById(containerId)

      if (container === null) {
        container = document.createElement('div')
        container.id = containerId

        container.setAttribute('style', 'display: inline-block; height: 400px; width: 100%;')

        document.body.appendChild(container)
      }

      this.container = container

      this.options = options
    }
  }

  /**
   * Render to SVG.
   *
   * @param {Object} view
   * @param {Object} [model]
   * @param {Function} [callback] run server side
   */

  render (view, model, callback) {
    const container = this.container

    const custom = this.options

    let height
    let width

    // Get height and width from container, if any.
    if (container) {
      const border = 1 // TODO could be configurable in style prop
      const rect = container.getBoundingClientRect()

      height = rect.height - 2 * border
      width = rect.width - 2 * border
    }

    view = Object.assign({}, {
      height,
      link: {},
      node: {},
      width
    }, view)

    const createInputPin = (nodeId, pin) => {
      var ins = view.node[nodeId].ins

      if (no(ins)) view.node[nodeId].ins = ins = []

      const position = ins.length

      if (no(pin)) pin = `in${position}`

      this.emit('createInputPin', nodeId, position, pin)

      view.node[nodeId].ins.push(pin)
    }

    const createOutputPin = (nodeId, pin) => {
      var outs = view.node[nodeId].outs

      if (no(outs)) view.node[nodeId].outs = outs = []

      const position = outs.length

      if (no(pin)) pin = `out${position}`

      this.emit('createOutputPin', nodeId, position, pin)

      view.node[nodeId].outs.push(pin)
    }

    const selectLink = (id) => {
      this.emit('selectLink', id)
    }

    const selectNode = (id) => {
      this.emit('selectNode', id)
    }

    function generateId () {
      const id = randomString()

      return (view.link[id] || view.node[id]) ? generateId() : id
    }

    const createLink = (link) => {
      const from = link.from
      const to = link.to

      const id = generateId()

      // Do not fire createLink event if it is a dragging link.
      if (no(to)) {
        view.link[id] = { from }
      } else {
        view.link[id] = { from, to }

        this.emit('createLink', { from, to }, id)
      }

      return id
    }

    const createNode = (node) => {
      const id = generateId()

      view.node[id] = node

      this.emit('createNode', node, id)

      return id
    }

    const deleteLink = (id) => {
      this.emit('deleteLink', id)

      delete view.link[id]
    }

    const deleteNode = (id) => {
      // delete links connected to given node.
      Object.keys(view.link).forEach((linkId) => {
        const from = view.link[linkId].from
        const to = view.link[linkId].to

        if (from && from[0] === id) {
          deleteLink(linkId)
        }

        if (to && to[0] === id) {
          deleteLink(linkId)
        }
      })

      delete view.node[id]

      this.emit('deleteNode', id)
    }

    const dragItems = (dragginDelta, draggedItems) => {
      Object.keys(view.node)
      .filter((id) => (draggedItems.indexOf(id) > -1))
      .forEach((id) => {
        view.node[id].x += dragginDelta.x
        view.node[id].y += dragginDelta.y
      })
    }

    const deleteInputPin = (nodeId, position) => {
      const ins = view.node[nodeId].ins

      if (no(ins)) return
      if (ins.length === 0) return

      if (no(position)) position = ins.length - 1

      // Look for connected links and delete them.

      Object.keys(view.link).forEach((id) => {
        const to = view.link[id].to

        if (no(to)) return

        if ((to[0] === nodeId) && (to[1] === position)) {
          deleteLink(id)
        }
      })

      this.emit('deleteInputPin', nodeId, position)

      view.node[nodeId].ins.splice(position, 1)
    }

    const endDragging = (selectNodes) => {
      let nodesCoordinates = {}

      selectNodes.forEach((id) => {
        nodesCoordinates.id = {}
        nodesCoordinates.id.x = view.node[id].x
        nodesCoordinates.id.y = view.node[id].y
      })

      this.emit('endDragging', nodesCoordinates)
    }

    const deleteOutputPin = (nodeId, position) => {
      const outs = view.node[nodeId].outs

      if (no(outs)) return
      if (outs.length === 0) return

      if (no(position)) position = outs.length - 1

      // Look for connected links and delete them.

      Object.keys(view.link).forEach((id) => {
        const from = view.link[id].from

        if (no(from)) return

        if ((from[0] === nodeId) && (from[1] === position)) {
          deleteLink(id)
        }
      })

      this.emit('deleteOutputPin', nodeId, position)

      view.node[nodeId].outs.splice(position, 1)
    }

    // TODO this is not used buy now.
    const renameNode = (nodeId, text) => {
      view.node[nodeId].text = text
    }

    const updateLink = (id, link) => {
      const to = link.to
      const from = link.from

      // Trigger a createLink event if it is a connected link.
      if (no(from)) {
        view.link[id].to = to

        this.emit('createLink', view.link[id], id)
      }
    }

    const component = (
      <Frame
        container={container}
        createInputPin={createInputPin}
        createOutputPin={createOutputPin}
        createLink={createLink}
        createNode={createNode}
        custom={custom}
        deleteLink={deleteLink}
        deleteInputPin={deleteInputPin}
        deleteNode={deleteNode}
        deleteOutputPin={deleteOutputPin}
        dragItems={dragItems}
        endDragging={endDragging}
        model={model}
        renameNode={renameNode}
        selectLink={selectLink}
        selectNode={selectNode}
        updateLink={updateLink}
        view={view}
      />
    )

    if (container) {
      // Client side rendering.
      Inferno.render(component, container)
    } else {
      // Server side rendering.
      var jsx = (
        <Frame
          custom={custom}
          view={view}
        />
      )

      var outputSVG = require('svgx')(require('inferno-server').renderToString)(jsx, { doctype: true, xmlns: true })

      if (typeof callback === 'function') {
        callback(null, outputSVG)
      }
    }
  }
}

export default Canvas
