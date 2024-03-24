import {
  beforeEach, describe, it, before, after,
} from 'mocha';
import util from 'node:util';
import { exec } from 'node:child_process';
import assert from 'assert';
import * as api from '../lib/api.mjs';

const execP = util.promisify(exec);

// This isn't necessary because cross-env sets NODE_ENV to
// "test", but we should be extra careful to not run db:rollback
// in a non-test environment.
process.env.NODE_ENV = 'test';

if (process.env.POSTGRES_HOST) {
  console.info('got here');
  process.env.PG_CONNECTION_STRING = `postgresql://${process.env.POSTGRES_HOST}:5432/postgres`;
} else {
  process.env.PG_CONNECTION_STRING = process.env.PG_CONNECTION_STRING ?? 'postgresql://127.0.0.1:5432/happ_test';
}
process.env.SESSION_SECRET = process.env.SESSION_SECRET ?? '31ba3298-5b08-4ef6-8c25-a536b7b46c64';
process.env.REDIS_URL = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';

const UUID_REGEX = /[0-9a-f]{8}-.*/;

describe('api', () => {
  let server;
  const PORT = 9999;
  const SERVER = `http://localhost:${PORT}`;
  before(async () => {
    server = await api.listen(PORT);
  });
  after(async () => {
    await server.close();
  });
  beforeEach(async () => {
    {
      const { stderr } = await execP('npm run db:rollback -- --all');
      if (stderr) {
        throw Error(stderr);
      }
    }
    {
      const { stderr } = await execP('npm run db:up');
      if (stderr) {
        throw Error(stderr);
      }
    }
  });
  describe('POST /habits', () => {
    it('returns 422 status if name not set', async () => {
      /// Mock the session middleware as though there's a logged in user.
      const { id } = (await api.getDatabase()('users').insert({ name: 'fake-bcoe' }, ['id']))[0];
      api.helpers.authenticated = (req, res, next) => {
        req.userId = id;
        return next();
      };
      const resp = await fetch(`${SERVER}/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(resp.status, 422);
    });

    it('creates and returns a new habit if name is set', async () => {
      /// Mock the session middleware as though there's a logged in user.
      const { id } = (await api.getDatabase()('users').insert({ name: 'fake-bcoe' }, ['id']))[0];
      api.helpers.authenticated = (req, res, next) => {
        req.userId = id;
        return next();
      };
      const resp = await fetch(`${SERVER}/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'brush teeth' }),
      });
      assert.strictEqual(resp.status, 201);
      const json = await resp.json();
      assert(UUID_REGEX.test(json.id));
    });
  });
});
