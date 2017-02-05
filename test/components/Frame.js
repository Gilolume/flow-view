import dom from 'cheerio'
import Inferno from 'inferno' // eslint-disable-line no-unused-vars
import InfernoServer from 'inferno-server'
import Frame from 'components/Frame'
import test from 'tape'

const render = InfernoServer.renderToString

test('Frame component', (t) => {
  const height = 100
  const width = 100

  const border = 1
  const expectedHeight = height - 2 * border
  const expectedWidth = width - 2 * border

  const view = {
    height,
    link: {},
    node: {},
    width
  }

  const el = (
    <Frame
      view={view}
    />
  )

  const $ = dom.load(render(el), { xmlMode: true })

  t.equal($('svg').attr('width'), expectedWidth.toString(), 'width prop')
  t.equal($('svg').attr('height'), expectedHeight.toString(), 'height prop')

  t.end()
})
