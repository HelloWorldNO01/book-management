import { spawn } from 'node:child_process'

const run = (command, args) =>
  spawn(command, args, {
    stdio: 'inherit',
    shell: true
  })

const server = run('npm', ['run', 'dev:server'])
const client = run('npm', ['run', 'dev:client'])

const stopAll = () => {
  server.kill()
  client.kill()
}

process.on('SIGINT', stopAll)
process.on('SIGTERM', stopAll)
