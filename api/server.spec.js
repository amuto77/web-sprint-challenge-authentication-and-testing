const request = require('supertest');
const server = require('./server');
const db = require('../database/dbConfig.js');
const { truncate } = require('../database/dbConfig.js');
const mockUser = {username: 'lol', password: 'lolson'}

describe('server.js', () => {
    describe('Get request with jokes', () => {
        it('should return a status 400 if unlogged', async () => {
            const res = await request(server).get('/api/jokes')
        expect(res.status).toBe(400);
        });
        it('should return json data', async() => {
            const res = await request(server).get('/api/jokes');
            expect(res.type).toBe('application/json')
        });
    });
    describe("registering user", () => {
        it('should return a  201 with new user', async () => {
            await db('users').truncate()
            const res = await request(server)
            .post('/api/auth/register')
            .send(mockUser);
            expect(res.status).toBe(201)
        });
        it('should return a status code of 500 with an invalid user', async () => {
            const res = await request(server)
            .post('/api/auth/register')
            .send({user: "lol", pass: "lmaoson" });
            expect(res.status).toBe(500);
        });
    });
    describe("user login", ()=> {
        it('should return 200 with mock user', async () => {
            const res = await request(server)
            .post('/api/auth/login')
            .send(mockUser);
            expect(res.status).toBe(200)
        })
        it('should return 401 if wrong user', async () => {
            const res = await request(server)
            .post('/api/auth/login')
            .send({ username: 'does not exist', password: 'never entered' })
            expect(res.status).toBe(401)
        })
    });
}); 