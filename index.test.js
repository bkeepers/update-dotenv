const dotenv = require('dotenv')
const fs = require('fs')
const os = require('os')
const path = require('path')
const updateDotenv = require('.')

const cwd = process.cwd()

describe('update-dotenv', () => {
  beforeEach(async () => {
    process.chdir(fs.mkdtempSync(path.join(os.tmpdir(), 'update-dotenv')))
  })

  afterEach(() => {
    process.chdir(cwd)
  })

  test('creates .env and writes new values', async () => {
    await updateDotenv({ FOO: 'bar' })
    expect(dotenv.config().parsed).toEqual({ FOO: 'bar' })
  })

  test('properly writes multi-line strings', async () => {
    await updateDotenv({ FOO: 'bar\nbaz' })
    expect(fs.readFileSync('.env', 'UTF-8')).toEqual('FOO=bar\\nbaz')
  })

  test('appends new variables to existing variables', async () => {
    await updateDotenv({ FIRST: 'foo' })
    await updateDotenv({ SECOND: 'bar' })
    expect(fs.readFileSync('.env', 'UTF-8')).toEqual('FIRST=foo\nSECOND=bar')
  })
})
