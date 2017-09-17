const test = require('tape')
const validator = require('is-my-json-valid')

const schema = require('../src/schema.json')
const sampleView = require('../examples/render/sample-view.json')

const validate = validator(schema)

test('Validate JSON schema', (t) => {
  t.ok(validate(sampleView), 'sample-view.json')

  t.end()
})

