#!/usr/bin/env zx

// info: https://github.com/google/zx

// install pnpm
await $`npm i pnpm@6 --location=global`

// install dependencies
await $`pnpm i`

// install cypress executable
await $`pnpm cypress install`

// automatically sign commits
await $`git config --global commit.gpgsign true`
