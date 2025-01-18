const request = require('supertest'); 
const app ='Service1:8197';


describe('API Tests', () => {
  describe('PUT /state', () => { 
    it('should set state to INIT', async () => { 
      const res = await request(app) 
      .put('/state') 
      .send({ state: 'INIT' }); 
      expect(res.status).toBe(200); 
      expect(res.text).toBe('INIT'); 
    }); 
    
    it('should set state to PAUSED', async () => { 
      const res = await request(app) 
      .put('/state') 
      .send({ state: 'PAUSED' }); 
      expect(res.status).toBe(200); 
      expect(res.text).toBe('PAUSED'); 
    }); 
    
    it('should set state to RUNNING', async () => { 
      const res = await request(app) 
      .put('/state') 
      .send({ state: 'RUNNING' }); 
      expect(res.status).toBe(200); 
      expect(res.text).toBe('RUNNING'); 
    }); 
    
    it('should set state to SHUTDOWN', async () => { 
      const res = await request(app) 
      .put('/state') 
      .send({ state: 'SHUTDOWN' }); 
      expect(res.status).toBe(200); 
      expect(res.text).toBe('SHUTDOWN'); 
    }); 
    
    it('should do nothing if state is the same as previous', async () => { 
      await request(app) 
      .put('/state') 
      .send({ state: 'RUNNING' }); 
      
      const res = await request(app) 
      .put('/state') 
      .send({ state: 'RUNNING' }); 
      expect(res.status).toBe(200); 
      expect(res.text).toBe('RUNNING'); 
    }); 
  });
});