// Service1/sumAndTest.js
function sum(a, b) {
  return a + b;
}

// Test for sum function
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

export default sum;
