---
'@lodado/sdui-document': minor
---

Add event-sourced collaboration core: hybrid logical clock, PatchEnvelope
transport with zod validation, append-only DocumentLog with snapshot replay,
a pure server sequencer with block-granular conflict rejection, and a client
outbox with optimistic apply + rebase (R3). Purely additive — existing patch
engine APIs are unchanged.
