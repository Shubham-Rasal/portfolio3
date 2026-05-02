---
title: "Chasing 1.18 BPB: Parameter Golf in 10 Minutes"
slug: parameter-golf
date: 2026-04-30
author: Shubham Rasal
tags:
  - ml
  - devlog
---

OpenAI dropped a challenge in mid-March: train the best language model that fits in 16MB and runs in under 10 minutes on 8×H100s. Scored by bits-per-byte on FineWeb. Lower is better.

The baseline scores 1.2244 BPB. The current record is 1.1194. That gap looks small. It is not small.

## What I Found Reading the Leaderboard

The repo has a records/ directory where every submission explains exactly what they did. Weirdly generous for a live competition.

Some things are basically free — LeakyReLU², orthogonal init, EMA on the weights. EMA surprised me because the gain isn't just better generalization — the averaged weights quantize more cleanly to int8. It's doing two jobs.

Then there's SmearGate. 512 parameters total. A single learned gate per embedding dim that blends the current token with the previous one. The BPB per parameter ratio is absurd.

The real unlock is int6 quantization. Pack weights into 6 bits, compress with zstd at level 22. This shrinks the model ~25% more than int8+zlib, which is what lets you run 3× wider MLPs while still fitting under 16MB. The wider MLP is apparently the single biggest contributor to score improvements.

## Day 2 and 3: Implementation

Started with the MLX version locally. SmearGate and BigramHash went in cleanly. 200-step smoke test: val BPB dropped from 4.1 to 1.92. Just warmup, but promising.

Porting to CUDA was mostly mechanical. Then came RunPod.

SCP doesn't work through their SSH proxy — fails silently. You need `runpodctl send/receive`. Spot instances got terminated three times mid-run. The Docker image has almost nothing installed, so every new pod needs a git clone, 8GB of shard downloads, and a pip install before you can do anything. When you have 15 minutes of H100 credits, this stings.

Lesson: always `nohup ... &` your training run. Learned this the hard way.

## The Run That Counted

Eventually a stable 8×H100 run finished.

```
step:8268/20000 val_bpb:1.2173 train_time:600058ms stopping_early: wallclock_cap
pre_quant_sliding val_bpb:1.1823
Total submission size int8+zlib: 16362289 bytes
```

1.1823 pre-quant BPB. Better than 12 of the 19 leaderboard entries.

The problem: 16.36MB. The limit is 16MB. 360KB over.

The fix was clear — switch to zstd or int6. I added zstd support. The run that would have used it got terminated by another spot eviction.

## Where This Lands

1.1823 would rank around 10th if it had fit. Not a record, but a real result built from scratch.

The thing that surprised me most was how much co-design matters. Every architectural decision — MLP width, layers, embedding size — has to be evaluated through "does this fit after compression?" The best submissions are designing the model and the compression scheme together.

The int6 path is clear. No good reason 1.1194 should be the floor.
