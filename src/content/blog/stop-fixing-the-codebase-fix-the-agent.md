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

<div aria-hidden="true" style="margin:0.75rem 0 1.1rem; color: inherit; opacity: 0.62;">
  <svg viewBox="0 0 720 170" role="img" style="width:100%;height:auto;display:block;">
    <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="34" y="26" width="180" height="34" rx="10"></rect>
      <text x="124" y="47" text-anchor="middle" fill="currentColor" font-size="13" stroke="none">Autonomous</text>
      <rect x="270" y="26" width="180" height="34" rx="10"></rect>
      <text x="360" y="47" text-anchor="middle" fill="currentColor" font-size="13" stroke="none">Hands-on</text>
      <rect x="506" y="26" width="180" height="34" rx="10"></rect>
      <text x="596" y="47" text-anchor="middle" fill="currentColor" font-size="13" stroke="none">Task-specific</text>
      <path d="M124 60 L124 93 L360 93 L360 60"></path>
      <path d="M596 60 L596 93 L360 93"></path>
      <rect x="276" y="104" width="168" height="34" rx="10"></rect>
      <text x="360" y="125" text-anchor="middle" fill="currentColor" font-size="13" stroke="none">General agents</text>
    </g>
  </svg>
</div>

The funnel shape captures the flow from broad work intake to focused execution paths across autonomous, hands-on, and niche harnesses.

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

<div aria-hidden="true" style="margin:0.75rem 0 1.1rem; color: inherit; opacity: 0.62;">
  <svg viewBox="0 0 720 150" role="img" style="width:100%;height:auto;display:block;">
    <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="26" y="42" width="170" height="30" rx="9"></rect>
      <text x="111" y="61" text-anchor="middle" fill="currentColor" font-size="13" stroke="none">Thin harness</text>
      <path d="M206 57 L296 57"></path>
      <path d="M289 52 L296 57 L289 62"></path>
      <rect x="306" y="30" width="170" height="54" rx="10"></rect>
      <text x="391" y="52" text-anchor="middle" fill="currentColor" font-size="13" stroke="none">Skills + tools</text>
      <text x="391" y="68" text-anchor="middle" fill="currentColor" font-size="12" stroke="none">encoded preferences</text>
      <path d="M486 57 L576 57"></path>
      <path d="M569 52 L576 57 L569 62"></path>
      <rect x="586" y="42" width="108" height="30" rx="9"></rect>
      <text x="640" y="61" text-anchor="middle" fill="currentColor" font-size="13" stroke="none">Output</text>
    </g>
  </svg>
</div>

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

<div aria-hidden="true" style="margin:0.75rem 0 1.1rem; color: inherit; opacity: 0.62;">
  <svg viewBox="0 0 720 180" role="img" style="width:100%;height:auto;display:block;">
    <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="272" y="18" width="176" height="30" rx="9"></rect>
      <text x="360" y="37" text-anchor="middle" fill="currentColor" font-size="13" stroke="none">Business goals</text>
      <path d="M360 48 L360 72"></path>
      <rect x="254" y="72" width="212" height="30" rx="9"></rect>
      <text x="360" y="91" text-anchor="middle" fill="currentColor" font-size="13" stroke="none">Plans / prompts / specs</text>
      <path d="M360 102 L360 126"></path>
      <rect x="268" y="126" width="184" height="30" rx="9"></rect>
      <text x="360" y="145" text-anchor="middle" fill="currentColor" font-size="13" stroke="none">Agent execution</text>
      <path d="M268 141 L194 141"></path>
      <path d="M452 141 L526 141"></path>
      <rect x="48" y="126" width="136" height="30" rx="9"></rect>
      <text x="116" y="145" text-anchor="middle" fill="currentColor" font-size="12.5" stroke="none">Tests / evals</text>
      <rect x="536" y="126" width="136" height="30" rx="9"></rect>
      <text x="604" y="145" text-anchor="middle" fill="currentColor" font-size="12.5" stroke="none">Observability</text>
    </g>
  </svg>
</div>

## The real job shift

If I had to compress this into one line:

Your job is no longer to write every line of code. Your job is to build an agent system that can do your job repeatedly, reliably, and at scale.

That shift is uncomfortable because it demands systems thinking and stronger judgment. But it is where the leverage is.
