---
title: "Stop Fixing the Codebase. Fix the Agent."
date: 2026-10-13
tags:
  - ai
  - agents
  - engineering
---

Most of the work going forward will be done through harnesses with different levels of control.

Some harnesses run autonomously, like personal agents you assign tasks to. They use memory and tools in the background and return with completed work.

Other harnesses are fully hands-on. They give you tighter control and a faster feedback loop for ambiguous, judgment-heavy tasks.

There are also task-specific harnesses that currently outperform generic ones in narrow domains. If you believe in the Bitter Lesson, even these eventually converge into stronger general agents.

## The harness landscape

```text
                +---------------------------+
                |        Your Work          |
                +-------------+-------------+
                              |
         +--------------------+--------------------+
         |                                         |
+--------v--------+                       +--------v--------+
| Autonomous      |                       | Hands-on        |
| harnesses       |                       | harnesses       |
| (background)    |                       | (tight loop)    |
+--------+--------+                       +--------+--------+
         |                                         |
         +--------------------+--------------------+
                              |
                    +---------v---------+
                    | Task-specific     |
                    | harnesses (niche) |
                    +-------------------+
```

## Code review will be dead soon

Code review is a relic of the human-written-code era.

We cared deeply about abstractions, OOP patterns, and comments because future humans had to maintain the system. In an agentic era where AI writes most code, human review does not scale the same way.

The better path is to build verification systems, evals, and guardrails that make failures hard to ship. Give agents strong observability so they can diagnose and fix their own mistakes.

Part of current quality gaps is alignment. The closer the agent gets to complete context, the fewer mistakes it makes.

## Dune and architecting for agents

I watched poteto's talk and initially assumed it was another high-volume AI PR machine. After checking the work and background, the opposite was true: serious engineering, including React Compiler core contributions.

The key idea behind Dune is straightforward: structure codebases so agents can work with less context hunting.

Patterns that feel elegant for humans (deep abstractions spread across many files) can be expensive for agents because every missing piece costs tool calls and context budget.

Constraints in the codebase can be freeing for both humans and agents.

## Use an eval loop on your own codebase

Try this exercise:

1. Build something purely by prompting an agent.
2. Watch where it fails or stalls.
3. Fix that part of the codebase.
4. Run the same prompt again.

That loop reveals where your codebase is not agent-ready.

## Lean harnesses, fat skills

Keep harnesses thin and replaceable. The ecosystem moves too fast to overfit your workflow to one harness implementation.

Instead, encode your knowledge into:

- Skill files (including tiny preferences)
- Tools that reduce repetitive context work
- Task-specific automation interfaces

A narrow tool for pulling logs from a platform can be far better than forcing an agent to hand-roll the same steps repeatedly in-context.

```text
+---------------------+     +--------------------+     +----------------------+
| Thin harness        | --> | Fat skills & tools | --> | Reliable agent output |
| (replaceable shell) |     | (durable leverage) |     | at higher throughput  |
+---------------------+     +--------------------+     +----------------------+
```

## Compounding is the core advantage

The payoff is rarely immediate, which is why people underestimate it.

- Agent-native architecture compounds over time.
- Evals and observable dev environments compound confidence.
- Skills and tools compound your effective leverage.
- Better models amplify all of the above.

## Ascend the trust graph

In a traditional org, junior engineers implement and senior engineers direct.

In an agent-first org, you need to move one level up, but only after building trust infrastructure. You cannot skip the trust-building phase.

Architecture, lint rules, tests, and guardrails are how you convert repeat corrections into reliable execution.

```text
+---------------------------+
| Business goals / strategy |
+-------------+-------------+
              |
+-------------v-------------+
| Plans / prompts / specs   |
+-------------+-------------+
              |
+-------------v-------------+
| Agents executing tasks    |
+-------------+-------------+
              |
+-------------v-------------+
| Guardrails: evals/tests   |
| + observability + tools   |
+---------------------------+
```

## The real job shift

If I had to compress this into one line:

Your job is no longer to write every line of code. Your job is to build an agent system that can do your job repeatedly, reliably, and at scale.

That shift is uncomfortable because it demands systems thinking and stronger judgment. But it is where the leverage is.
