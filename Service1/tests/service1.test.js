const request = require('supertest'); 
const app ='http://localhost:8197'; // Use environment variable or default to localhost


describe('API Tests', () => {
  describe('PUT /state', () => { 
    it('should set state to INIT', async () => { 
      const res = await request(app) 
      .put('/state') 
      .send({ state: 'INIT' }); 
      expect(res.status).toBe(200); 
      expect(res.text).toBe('State changed to INIT'); 
    }); 
    
    it('should set state to PAUSED', async () => { 
      const res = await request(app) 
      .put('/state') 
      .send({ state: 'PAUSED' }); 
      expect(res.status).toBe(200); 
      expect(res.text).toBe('State changed to PAUSED'); 
    }); 
    
    it('should set state to RUNNING', async () => { 
      const res = await request(app) 
      .put('/state') 
      .send({ state: 'RUNNING' }); 
      expect(res.status).toBe(200); 
      expect(res.text).toBe('State changed to RUNNING'); 
    }); 
    
    it('should set state to SHUTDOWN', async () => { 
      const res = await request(app) 
      .put('/state') 
      .send({ state: 'SHUTDOWN' }); 
      expect(res.status).toBe(200); 
      expect(res.text).toBe('State changed to SHUTDOWN'); 
    }); 
    
    it('should do nothing if state is the same as previous', async () => { 
      await request(app) 
      .put('/state') 
      .send({ state: 'RUNNING' }); 
      
      const res = await request(app) 
      .put('/state') 
      .send({ state: 'RUNNING' }); 
      expect(res.status).toBe(200); 
      expect(res.text).toBe('State unchanged'); 
    }); 
  });
});