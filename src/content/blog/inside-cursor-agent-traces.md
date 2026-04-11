---
title: "Inside Cursor's Agent Traces"
slug: inside-cursor-agent-traces
date: 2026-04-11
author: Shubham Rasal
tags:
  - ai
  - reverse-engineering
  - cursor
---

Cursor ships with a surprisingly detailed telemetry system for tracking AI-generated code. It stores everything locally in two SQLite databases - one that logs every code chunk the AI writes, another that holds your entire chat history as JSON blobs. Neither was designed as a training dataset, but together they contain the raw materials for one.

This is a writeup of me sniffing around the `~/.cursor` folder to see whether Cursor records enough data to reconstruct accept/reject preference signals.

Spoiler: there's no explicit signal. But there's enough to reconstruct meaningful ones implicitly.

## The Two Databases

Cursor persists two relevant stores on disk:

```bash
~/.cursor/ai-tracking/ai-code-tracking.db          # code provenance tracking
~/Library/Application Support/Cursor/User/
  globalStorage/state.vscdb                         # chat history + KV store
```

The first is specific to Cursor's AI tracking extension. The second is the standard VSCode global state database - Cursor uses it for chat history on top of the usual IDE state.

### ai-code-tracking.db - Six Tables

The tracking database has six tables, two of which are empty but revealing in their intent:

| Table | Rows | Notes |
|---|---|---|
| `ai_code_hashes` | 86,763 | One row per code chunk written by AI |
| `scored_commits` | 301 | Per-commit AI attribution percentages |
| `ai_deleted_files` | 31 | AI-written files that were later deleted |
| `tracking_state` | 1 | Config row - stores `trackingStartTime` |
| `conversation_summaries` | 0 | **Empty.** Would have been the richest signal. |
| `tracked_file_content` | 0 | **Empty.** Would store full file content per session. |

The `ai_code_hashes` schema is the core of the system. Each row records the chunk content hash, the source (`composer` vs `human`), the file it was written to, the model that generated it, and critically - a `requestId` that links back to the originating chat turn.

### state.vscdb - The Chat Store

The chat history lives in the `cursorDiskKV` table inside VSCode's global state database. Each row is a JSON blob keyed with one of two patterns:

```bash
bubbleId:<conversationId>:<messageId>   # one row per chat message
agentKv:blob:<hash>                     # composer session blobs
```

A "bubble" is Cursor's term for a single message in the chat - either a user turn (`type: 1`) or an AI turn (`type: 2`). The AI turn is actually split across several bubbles: one for the thinking block, one per tool call, one per tool result, and one for the final text response.

## The Foreign Key: requestId

The most important thing I found was a genuine join key between the two databases. The user-prompt bubble stores a `requestId` field in its JSON. The `ai_code_hashes` table stores the same `requestId` on every code chunk written during that request. This is a hard, verifiable link - not an inferred one.

> **Note on conversationId.** It's tempting to join on `conversationId` instead, since it appears in both stores. But the `conversationId` is not stored inside the bubble's JSON - it's only encoded in the key string (`bubbleId:<conversationId>:<messageId>`). The `requestId` field is the actual foreign key.

Coverage isn't perfect. Of 581 distinct `requestId`s in `ai_code_hashes`, 512 (88%) have a matching bubble in `state.vscdb`. The 12% gap is most likely old chat bubbles that were pruned from the rolling retention window while the tracking DB kept its code hashes indefinitely.

## A Complete Trace

Here's a concrete example - a real request reconstructed from the two databases. The conversation ID is `11325bee`, the request is a UI tweak to a loading screen component.

<div class="trace not-prose">
  <div class="trace-header">
    <div class="trace-dot"></div>
    Conversation 11325bee &nbsp;·&nbsp; 2026-03-15 &nbsp;·&nbsp; composer-1.5
  </div>

  <div class="trace-step">
    <div class="trace-time">
      <span class="trace-kind user">user</span>
      08:50:14Z
    </div>
    <div class="trace-body">
      <span class="hi">"the @LoadingScreen.tsx screen text is too light.<br>
      &nbsp;Make it larger, brighter"</span><br>
      <span class="dim">fileSelections: [LoadingScreen.tsx]</span><br>
      <span class="dim">requestId: f8f61054-8500-49ff-b521-140ec847fcc4</span>
    </div>
  </div>

  <div class="trace-step">
    <div class="trace-time">
      <span class="trace-kind thinking">thinking</span>
      08:50:16Z
    </div>
    <div class="trace-body">
      <span class="dim">"Adjusting text styling... increasing font sizes<br>
      &nbsp;and brightness for phase captions, legend items..."</span><br>
      <span class="dim">thinkingDurationMs: 48</span>
    </div>
  </div>

  <div class="trace-step">
    <div class="trace-time">
      <span class="trace-kind tool">tool</span>
      08:50:16Z
    </div>
    <div class="trace-body">
      <span class="em">read_file_v2</span>(<span class="hi">"LoadingScreen.tsx"</span>)<br>
      <span class="dim">→ 647 lines</span>
    </div>
  </div>

  <div class="trace-step">
    <div class="trace-time">
      <span class="trace-kind tool">tool</span>
      08:50:24Z
    </div>
    <div class="trace-body">
      <span class="em">edit_file</span> - <span class="ts">applies diff to LoadingScreen.tsx</span><br>
      <span class="dim">phase captions, legend, eyebrow, title, tagline, button</span>
    </div>
  </div>

  <div class="trace-step">
    <div class="trace-time">
      <span class="trace-kind ai">response</span>
      08:50:26Z
    </div>
    <div class="trace-body">
      Phase captions: <span class="hi">0.52rem → 0.72rem</span>, <span class="ok">rgba(168,144,96,0.55) → rgba(245,217,106,0.92)</span><br>
      Legend items: <span class="hi">0.42rem → 0.58rem</span> + <span class="ok">filter: brightness(1.15)</span><br>
      Title: <span class="hi">clamp(58px,11vw,108px) → clamp(72px,13vw,128px)</span><br>
      <span class="dim">... 6 components updated total</span>
    </div>
  </div>

  <div class="trace-step">
    <div class="trace-time">
      <span class="trace-kind data">hashes</span>
      08:50:21Z
    </div>
    <div class="trace-body">
      <span class="ok">18 chunks</span> written to <span class="em">ai_code_hashes</span><br>
      <span class="dim">requestId: f8f61054-8500-49ff-b521-140ec847fcc4 ✓ matches bubble</span><br>
      <span class="dim">timestamp delta: +7s from user prompt</span>
    </div>
  </div>

  <div class="trace-step">
    <div class="trace-time">
      <span class="trace-kind user">user</span>
      08:51:06Z
    </div>
    <div class="trace-body">
      <span class="hi">"stop the actions of any agent that is not running..."</span><br>
      <span class="dim">→ no revert, no pushback - moved to next task</span><br>
      <span class="ok">implicit acceptance signal (+40s)</span>
    </div>
  </div>
</div>

The timestamps close the loop. The bubble was created at 08:50:14Z. The code chunks in `ai_code_hashes` carry a timestamp of 08:50:21Z - seven seconds later, consistent with the time to read the file and apply the edit. The same `requestId` links them unambiguously.

## The Missing Signal: Accept vs. Reject

I wanted to build a dataset from these traces but the available signals are too weak to be reliable on their own.

| Signal | Source | Quality |
|---|---|---|
| User continues after AI edit | Next bubble timestamp | Weak positive |
| AI-written file later deleted | `ai_deleted_files` | Weak negative |
| High `composerLinesDeleted` in commit | `scored_commits` | Weak negative |
| Low churn - AI lines survive commit | `scored_commits` | Weak positive |
| Explicit thumbs up/down | - | **Not present** |
| Per-suggestion accept/dismiss | - | **Not present** |

The closest usable signal is pairing `ai_deleted_files` and high `composerLinesDeleted` commits as negative examples, and low-churn commits with high `composerLinesAdded` retained as positive ones. It's a stretch.

The two empty tables - `conversation_summaries` and `tracked_file_content` - are the real pity here. The schemas suggest Cursor intended to store full file snapshots and summaries per conversation, which would enable before/after diffs per request. Neither table has ever been populated, at least on this machine. Either the feature was removed, or it was never shipped.

Cursor almost certainly does have explicit accept/dismiss events internally - the tab-completion UI tracks these to report the per-seat acceptance rates that appear on enterprise dashboards. But that data does not surface in either local database.

## The Join Graph

For anyone wanting to build on this, here's the complete chain of joins across the two databases and the filesystem:

```sql
-- Step 1: pull the user prompt from a bubble
cursorDiskKV["bubbleId:<convId>:<msgId>"]
  → json.text          -- the prompt
  → json.requestId     -- the foreign key  ← THIS IS THE JOIN

-- Step 2: find code chunks written during that request
ai_code_hashes WHERE requestId = '<requestId>'
  → fileName, hash, model, timestamp

-- Step 3: infer survival via git (indirect)
scored_commits
  WHERE commitDate ≈ timestamp
  AND   branchName = current branch
  → composerLinesDeleted   -- high = negative signal
  → v2AiPercentage         -- context

-- Step 4: explicit deletion (strongest negative signal)
ai_deleted_files WHERE conversationId = '<convId>'
  → gitPath    -- was this file written then deleted?
```

**Warning:** The `scored_commits` join is not a hard join. There is no `requestId` in `scored_commits` - only git commit hashes. Linking a specific AI request to a specific commit requires matching on file path plus timestamp proximity, which will produce false positives on active repos with many small commits.

## What This Is Actually Good For

Despite not having an explicit reward signal, the database is genuinely useful for a few things that aren't RL training:

**Code attribution auditing.** The `hash` in `ai_code_hashes` is a content hash of each code chunk. Given a file at any point in git history, you can check whether its chunks appear in the tracking DB and recover which model wrote them, when, and in response to which conversation.

**Model comparison.** The database spans multiple models across the same codebase and the same developer workflow. Comparing chunk survival rates per model - how much of what `composer-2` wrote ended up deleted vs. retained versus `claude-sonnet-4-6` - would be a meaningful if noisy quality signal.

**Workflow reconstruction.** The bubble JSON is rich. It stores attached files, terminal selections, tool call sequences, thinking blocks, and the full context window configuration for every turn. Reconstructing the full trajectory of how a feature was built - including the order of AI requests, what context was provided, and how the conversation evolved - is entirely possible from these two databases.

---

*Notes:*

1. All data examined was from a single machine. Database schema and content will vary across Cursor versions and per-user configuration.
2. The 88% requestId coverage figure reflects bubbles available in `state.vscdb` at time of query. Cursor likely prunes old bubbles; the tracking DB does not prune hashes.
3. `ai_code_hashes.hash` is 8 characters, suggesting a truncated SHA or CRC of the chunk content. Not a full SHA-256; collisions are possible at scale.
4. The `agentKv:blob:*` rows in `cursorDiskKV` are binary-encoded protobuf or similar - not examined in this session.
