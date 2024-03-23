import {beforeEach, describe, it, before, after} from 'mocha';
import util from 'node:util';
import {exec} from 'node:child_process';
import {listen} from '../lib/api.mjs';
import assert from 'assert';
const execP = util.promisify(exec);

// This isn't necessary because cross-env sets NODE_ENV to
// "test", but we should be extra careful to not run db:rollback
// in a non-test environment.
process.env.NODE_ENV = 'test';
// Avoid using .env in a test environment (as real endpoints, passwords, etc.,
// are likely to end up in a .env file.
process.env.PG_CONNECTION_STRING='postgresql://127.0.0.1:5432/postgres';

describe('api', () => {
  let server;
  const PORT = 9999;
  const SERVER = `http://localhost:${PORT}`;
  before(async function () {
    server = await listen(PORT);
  });
  after(async function () {
    await server.close();
  });
  beforeEach(async function () {
    {
      const { stdout, stderr } = await execP('npm run db:rollback -- --all');
      if (stderr) {
        throw Error(stderr);
      }
      // console.info(stdout);
    }
    {
      const { stdout, stderr } = await execP('npm run db:up');
      if (stderr) {
        throw Error(stderr);
      }
      // console.info(stdout);
    }
  });
  it('has a test', async function () {
    const res = await fetch(`${SERVER}/me`);
    assert.strictEqual(res.status, 200);
  })
  it('has another test', async function () {
    const res = await fetch(`${SERVER}/`);
    assert.strictEqual(res.status, 200);
  })
  it('has a third test', async function () {
    const res = await fetch(`${SERVER}/foo`);
    assert.strictEqual(res.status, 404);
  })
})
