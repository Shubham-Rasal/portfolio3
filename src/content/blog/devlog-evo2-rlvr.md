---
title: "DEVLOG: Fine-tuning Evo2 with RLVR for Regulatory DNA Design"
slug: devlog-evo2-rlvr
date: 2026-04-24
author: Shubham Rasal
tags:
  - devlog
  - biology
  - rl
  - ml
---

This is a planning devlog for a project I've been thinking about for a while — using reinforcement learning with verifiable rewards (RLVR) to fine-tune Evo2 for targeted regulatory DNA design.

## The Problem

Designing regulatory DNA sequences that activate in a specific cell type is hard. Current generative models — including Evo2, which I've worked with before — can produce plausible sequences, but they're not steered toward any particular functional objective. You get diversity, not specificity.

The standard approach is to train a supervised model on MPRA (Massively Parallel Reporter Assay) data and hope it generalizes. But MPRA datasets now have 150M+ labeled sequences with measured regulatory activity across cell types. That's enough signal to build a reward model — and if you have a reward model, you can do RL.

## The Idea

The core loop is straightforward:

1. **Evo2 generates** candidate regulatory sequences
2. **A reward model** trained on MPRA data scores each sequence for actual regulatory activity in a target cell type
3. **RLVR updates** Evo2 toward sequences that score high

The reward is grounded in real experimental measurements, not another model's predictions. That's what makes it "verifiable" in the RLVR sense — similar to how math RL uses a checker rather than a judge.

Top candidates from the RL loop get validated against Borzoi as a secondary oracle (a sequence-to-activity model trained on ENCODE data, Nature Genetics 2024).

This is inspired by the recent [RL for Crystal Relaxation](https://x.com/JorgeMe87234182) work — same philosophy: use a physically grounded reward instead of a learned proxy.

## Why This Hasn't Been Done

I looked through the literature and nobody has combined Evo2-scale generation (~7B parameters, trained on 2.7M genomes) with MPRA-grounded reward models under RLVR. A few reasons this gap exists:

- Evo2 only dropped in early 2025
- MPRA datasets at this scale are very recent (the 150M+ collection is from March 2025)
- Most bio ML work still treats sequence design as a supervised problem

The pieces are all available now. The RLVR framework from Prime Intellect's verifiers library maps cleanly onto this — you just swap out the math verifier for an MPRA-trained reward model.

## Prior Work I'm Building On

- [Evo2 paper (Nature 2026)](https://www.nature.com/articles/s41586-026-10176-5) — the base model and weights
- [RL for regulatory DNA design](https://arxiv.org/abs/2503.07981) — closest prior work, but uses a weaker base model and synthetic rewards
- [MPRA Dataset Collection](https://www.biorxiv.org/content/10.1101/2025.03.11.642630v1) — 150M+ labeled sequences, the reward model training data
- [Borzoi](https://www.nature.com/articles/s41588-024-02053-6) — secondary oracle for validation

I've already shipped one application on top of Evo1, so I have a practical sense of where generative DNA models fail on functional sequence design. That experience is what made this problem obvious to me.

## Compute Plan

Rough estimate: **100–150 H100 hours** total.

- Reward model training on MPRA data: ~30–50 hours
- RLVR fine-tuning of Evo2-7B: ~50–80 hours
- Borzoi validation passes: ~10–20 hours

Starting with Evo2-7B. If the reward signal is strong, scaling up to larger checkpoints is the obvious next step.

## Next Steps

- [ ] Set up MPRA data pipeline and train initial reward model
- [ ] Implement RLVR training loop using Prime Intellect's verifiers framework
- [ ] Baseline: compare RLVR outputs vs. pure Evo2 generation on target cell type activity
- [ ] Validate top-K sequences against Borzoi

Will post updates as I make progress.
