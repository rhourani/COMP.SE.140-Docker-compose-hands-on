// Service1/sum.js
function sum(a, b) {
    return a + b;
  }
  module.exports = sum;
  
  // Service1/tests/sum.test.js
  const sum = require('../sum');
  
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
  