/** API wiring tests: these need no database. They prove JSON parsing, headers, CORS and auth are wired up. */
import request from 'supertest';

let app: any;

beforeAll(() => {
  process.env.DATABASE_URL = 'postgresql://u:p@localhost:5432/x';
  process.env.CORS_ORIGIN = 'https://allowed.example.com';
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app = require('../app').app;
});

describe('API wiring', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('parses JSON bodies: a bad email is reported on the email field, not as a missing body', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'not-an-email', password: 'x' });
    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body.details)).toContain('email');
  });

  it('sends helmet security headers', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('allows a configured CORS origin', async () => {
    const res = await request(app).get('/health').set('Origin', 'https://allowed.example.com');
    expect(res.headers['access-control-allow-origin']).toBe('https://allowed.example.com');
  });

  it('does not grant CORS to an unlisted origin', async () => {
    const res = await request(app).get('/health').set('Origin', 'https://evil.example.com');
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('protected routes reject requests without a token', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(401);
  });
});
