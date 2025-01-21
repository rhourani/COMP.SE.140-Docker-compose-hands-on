const request = require('supertest'); 
const app ='service1:8199';
//const app ='localhost:8197';
//const app ='service1_cluster:8198';

//this sets the data for auth header with the pass and username
const authHeader = 'Basic ' + Buffer.from('ridvan:ridvan').toString('base64');

describe('API Tests', () => {
  describe('PUT /state', () => { 
    it('should set state to RUNNING when user first log in', async () => { 
      const res = await request(app) 
      .put('/state')
      .set('Authorization', authHeader)// adding the authrization header
      .set('Content-Type', 'text/plain') //Request as a text plain content
      .send('INIT'); 
      expect(res.status).toBe(201); // returns 201 , REST API response for PUT
      expect(res.text).toBe('RUNNING'); 
    }); 
    
    it('should set state to RUNNING', async () => { 
      //Reset system
      await request(app) 
      .put('/state')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain') 
      .send('INIT'); 

      const res = await request(app) 
      .put('/state')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain') 
      .send('RUNNING'); 
      expect(res.status).toBe(201); 
      expect(res.text).toBe('RUNNING'); 
    }); 

    it('should set state to PAUSED', async () => { 
      const res = await request(app) 
      .put('/state')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain') 
      .send('PAUSED'); 
      expect(res.status).toBe(201); 
      expect(res.text).toBe('PAUSED'); 
    }); 

    it('should do nothing if state is the same as previous', async () => { 
      await request(app) 
      .put('/state')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain') 
      .send('RUNNING'); 
      
      const res = await request(app) 
      .put('/state')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain') 
      .send('RUNNING'); 
      expect(res.status).toBe(201); 
      expect(res.text).toBe('No change done'); 
    }); 
    
    //Commented out as it will stop the containers when it run

    // it('should set state to SHUTDOWN', async () => { 
    //   const res = await request(app) 
    //   .put('/state')
    //   .set('Authorization', authHeader)
    //   .set('Content-Type', 'text/plain') 
    //   .send('SHUTDOWN'); 
    //   expect(res.status).toBe(200); 
    //   expect(res.text).toBe('Shutting down performed'); 
    // });
  });


  describe('GET /state', () => { 
    it('should return the current status', async () => { 

     await request(app) 
      .put('/state')
      .set('Authorization', authHeader)//this adds an authoriazation header
      .set('Content-Type', 'text/plain') 
      .send('INIT'); 

      const res = await request(app) 
      .get('/state')// can be run without authentication
      .set('Content-Type', 'text/plain');

      expect(res.status).toBe(200);
      expect(res.text).toBe('INIT');

    }); 
  });

  describe('GET /request', () => { 
    it('should return the containers details', async () => { 

      const res = await request(app) 
      .get('/request')
      .set('Content-Type', 'text/plain');

      expect(res.status).toBe(500);
    }); 
  });

  describe('GET /run-log', () => { 
    it('should return the system states', async () => { 

      await request(app) 
      .put('/state')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain') 
      .send('INIT'); 

      await request(app) 
      .put('/state')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain') 
      .send('PAUSED'); 

      const res = await request(app) 
      .get('/run-log')//Does not need to authorization header (logging in) to run
      .set('Content-Type', 'text/plain');

      expect(res.status).toBe(200);
      expect(res.text).not.toBe('');// make sure it return data and not empty
    }); 
  });

});