const test = require('tape')

const Canvas = require('flow-view').Canvas

test('Server side Canvas', (t) => {
  const canvas = new Canvas('drawing')

  t.equal(null, canvas.container, 'container')

  t.end()
})
