const request = require('supertest'); 
const app ='localhost:8197';


const authHeader = 'Basic ' + Buffer.from('ridvan:ridvan').toString('base64');

describe('API Tests', () => {
  describe('PUT /state', () => { 
    it('should set state to INIT', async () => { 
      const res = await request(app) 
      .put('/state')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain') 
      .send('INIT'); 
      expect(res.status).toBe(200); 
      expect(res.text).toBe('Logged out'); 
    }); 
    
    it('should set state to PAUSED', async () => { 
      const res = await request(app) 
      .put('/state')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain') 
      .send('PAUSED'); 
      expect(res.status).toBe(200); 
      expect(res.text).toBe('PAUSED'); 
    }); 
    
    it('should set state to RUNNING', async () => { 
      const res = await request(app) 
      .put('/state')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain') 
      .send('RUNNING'); 
      expect(res.status).toBe(200); 
      expect(res.text).toBe('RUNNING'); 
    }); 
    
    it('should set state to SHUTDOWN', async () => { 
      const res = await request(app) 
      .put('/state')
      .set('Authorization', authHeader)
      .set('Content-Type', 'text/plain') 
      .send('SHUTDOWN'); 
      expect(res.status).toBe(200); 
      expect(res.text).toBe('Shutting down performed'); 
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
      expect(res.status).toBe(200); 
      expect(res.text).toBe('RUNNING'); 
    }); 
  });


  describe('GET /state', () => { 
    it('should return the current status', async () => { 
      await request(app) 
      .get('/state')
      .set('Content-Type', 'text/plain'); 
    }); 
  });
});