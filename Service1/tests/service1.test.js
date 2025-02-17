const request = require('supertest');

/**
 * IMPORTANT NOTE: 
 * Uncomment for local or GitLab
 */
//const app = 'service1:8199';
const app = 'localhost:8197';

//this sets the data for auth header with the pass and username
const authHeader = 'Basic ' + Buffer.from('ridvan:ridvan').toString('base64');

describe('GET /request', () => {

    //This will fail as there is no user logged in
    it('should return a response', async () => {

        const res = await request(app)
            .get('/request');

        expect(res.accepted).toBe(false);
    });

    //This test shows that service1 is accessible and /request endpoint is running
    it('should return a response', async () => {

        const res = await request(app)
            .get('/request')
            .set('Authorization', authHeader);

        expect(res.status).not.toBe();
    });
});