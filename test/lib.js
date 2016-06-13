import rewire from 'rewire'
const should = require('chai').should()

describe('lib', () => {
  const lib = rewire('../lib')

  it('should exist', () => should.exist(lib.default))
  it('should be a function', () => lib.should.be.a('function'))
})
