// Service1/sum.js
function sum(a, b) {
    return a + b;
  }
  export default sum;
  
  // Service1/tests/sum.test.js
  import sum from '../sum';
  
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
  