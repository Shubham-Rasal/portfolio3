---
title: "DEVLOG #6"
slug: devlog-6
date: 2026-05-22
author: Shubham Rasal
tags:
  - ai
  - devlog
  - genomics
---

Spent the afternoon benchmarking Carbon, a new family of genomic foundation models from HuggingFace trained on 1 trillion tokens of DNA sequences.

### What is Carbon

Carbon is a causal language model for DNA. It uses a hybrid tokenizer that switches between BPE for text and 6-mer encoding for DNA sequences, triggered by a `<dna>` tag. The family has three sizes: 500M, 3B, and 8B. The 500M model is explicitly designed as a draft model for speculative decoding with the 3B.

### Throughput on T4 GPU

I ran inference benchmarks for Carbon-500M on a Colab T4 GPU. The model is 512M parameters in bfloat16 precision.

| Config | Prompt | Generated | Throughput |
|---|---|---|---|
| 128bp context | 23 tokens | 64 tokens | 27.2 tok/s |
| 128bp context | 23 tokens | 256 tokens | 25.0 tok/s |
| 512bp context | 87 tokens | 64 tokens | 26.6 tok/s |
| 512bp context | 256 tokens | 256 tokens | 26.3 tok/s |

The throughput is remarkably flat across prompt lengths, which makes sense given the model size. No attention bottleneck at these context lengths on T4.

### Speculative Decoding

Since Carbon-500M is designed as a draft for Carbon-3B, I tested speculative decoding using HuggingFace's built-in `assistant_model` flag. Both models together use about 8 GB of VRAM on the T4.

| Config | 3B standalone | 3B with spec decoding | Speedup |
|---|---|---|---|
| 128bp, 64 tokens | 22.3 tok/s | 19.4 tok/s | 0.87x |
| 128bp, 256 tokens | 22.3 tok/s | 20.1 tok/s | 0.90x |
| 512bp, 64 tokens | 21.4 tok/s | 18.6 tok/s | 0.87x |
| 512bp, 256 tokens | 22.0 tok/s | 19.7 tok/s | 0.89x |

Speculative decoding is about 10 to 13 percent slower than running 3B alone. This is not surprising on T4 for a few reasons.

First, the T4 is memory bandwidth bound, not compute bound. Loading weights for two models per round costs more than the verification saves. Second, HuggingFace's naive `assistant_model` implementation is not the optimized parallel speculative decoding used in production systems like vLLM. It runs draft tokens one at a time without batching the verification step. Third, speculative decoding gains are larger on A100 or H100 class hardware where the verifier is compute bound and the parallel draft verification comes essentially for free.

The design intention still makes sense though. A proper implementation with vLLM's speculative decoding backend on an A100 should show meaningful speedup. The 6x size ratio between draft and verifier, plus the shared tokenizer and training data, are all ideal conditions for high draft acceptance rates, which is where the actual wall clock improvement comes from.

### What is next

Want to test Carbon on actual biology tasks rather than synthetic ATCG repeats. The evaluation suite includes variant effect prediction and sequence recovery tasks which would give a better picture of where the model actually stands relative to Evo2 and GENERator.
