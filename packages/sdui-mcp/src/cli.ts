#!/usr/bin/env node
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { serveStdio } from '@modelcontextprotocol/server/stdio'

import { createServer } from './server.js'

const packageRoot = path.resolve(fileURLToPath(import.meta.url), '../..') // dist/cli.js -> package root
const knowledgeDir = path.join(packageRoot, 'knowledge')

serveStdio(() => createServer(knowledgeDir))
