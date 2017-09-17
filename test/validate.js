const test = require('tape')
const jsonschema = require('jsonschema')

const schema = require('../src/schema.json')
const sampleView = require('../examples/render/sample-view.json')

const validator = new jsonschema.Validator()

test('Validate JSON schema', (t) => {
  t.ok(validator.validate(sampleView, schema), 'sample-view.json')

  t.end()
})

