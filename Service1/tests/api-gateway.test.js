const request = require('supertest');

/**
 * IMPORTANT NOTE: 
 * Uncomment for local or GitLab
 */
//const app = 'service1:8199';
const app = 'localhost:8197'; 

//this sets the data for auth header with the pass and username
const authHeader = 'Basic ' + Buffer.from('ridvan:ridvan').toString('base64');

describe('API Tests', () => {
  describe('PUT /state', () => {
    it('should set state to RUNNING when user first log in', async () => {

      await resetStateToInit();

      const res = await changeState('RUNNING');

      expect(res.status).toBe(200);
      expect(res.text).toBe('RUNNING');
    });

    it('should set state to RUNNING', async () => {
      await resetStateToInit();

      const res = await changeState('RUNNING');

      expect(res.status).toBe(200);
      expect(res.text).toBe('RUNNING');
    });

    it('should set state to PAUSED', async () => {
      await resetStateToInit();
      await changeState('RUNNING');

      const res = await changeState('PAUSED');

      expect(res.status).toBe(200);
      expect(res.text).toBe('PAUSED');
    });

    it('should do nothing if state is the same as previous', async () => {

      await resetStateToInit();
      await changeState('RUNNING');
      await changeState('PAUSED');

      const res = await changeState('PAUSED');

      expect(res.status).toBe(200);
    });

    /*
    Commented out as it will stop the containers when it run
    */

    // it('should set state to SHUTDOWN', async () => { 
    //const res = await changeState('SHUTDOWN');
    //   expect(res.status).toBe(200); 
    //   expect(res.text).toBe('Shutting down performed'); 
    // });
  });

  describe('GET /state', () => {
    it('should return the current status', async () => {

      const res = await request(app)
        .get('/state')// can be run without authentication
        .set('Content-Type', 'text/plain');

      expect(res.status).toBe(200);
      expect(res.text).toBe('PAUSED');

    });
  });

  describe('GET /request', () => {
    it('should return the containers details', async () => {

      const res = await request(app)
        .get('/request')
        .set('Content-Type', 'text/plain');

      expect(res.status).not.toBe();
    });
  });

  describe('GET /run-log', () => {
    it('should return the system states', async () => {

      //As the pervious tests run, there should be already some data

      const res = await request(app)
        .get('/run-log')//Does not need to authorization header (logging in) to run
        .set('Content-Type', 'text/plain');

      expect(res.status).toBe(200);
      expect(res.text).not.toBe('');// make sure it return data and not empty
    });
  });

});

async function resetStateToInit() {
  await request(app)
    .put('/state')
    .set('Authorization', authHeader)
    .set('Content-Type', 'text/plain')
    .send('INIT');
}

async function changeState(state) {
  const res = await request(app)
    .put('/state')
    .set('Authorization', authHeader) // adding the authrization header
    .set('Content-Type', 'text/plain') //Request as a text plain content
    .send(state);

  return res;
}
