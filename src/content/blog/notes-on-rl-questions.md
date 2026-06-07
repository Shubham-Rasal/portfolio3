---
title: "Notes on RL Questions"
slug: notes-on-rl-questions
date: 2026-06-07
author: Shubham Rasal
tags:
  - rl
  - ml
  - notes
---

35 questions covering LLM RL algorithms and infrastructure. Compiled as a personal reference — answers are deliberately brief and can be extended much further with follow-ups.

Sources: arXiv preprints, official GitHub repos, [Lilian Weng's blog](https://lilianweng.github.io). Based on Xiuyu Li (@sheriyuo).

---

## Algorithm (Q1–Q19)

### Q1. Why use Actor-Critic instead of a pure Critic approach?

Pure critic (value-only) methods like DQN require discretizing the action space or expensive optimization at every step. Actor-Critic separates policy (actor) from value estimation (critic), enabling continuous action spaces and lower-variance gradient estimates via the baseline. The actor directly parameterizes the policy, which is more sample-efficient in high-dimensional or continuous spaces.

### Q2. What is the relationship between KL divergence, cross entropy, and MLE?

`KL(P||Q) = H(P,Q) − H(P)`. Minimizing cross entropy H(P,Q) (as in MLE on data distribution P) is equivalent to minimizing KL(P||Q) when H(P) is constant. In RL, KL from the reference policy acts as a regularizer equivalent to a log-ratio penalty.

### Q3. How should rewards be designed in different RL scenarios?

- **Sparse:** outcome-only (pass/fail). Simple but high-variance.
- **Dense:** shaped per-step rewards. Faster learning but risks reward hacking.
- **PRM (Process Reward Model):** reward per reasoning step — useful for math/code.
- **ORM (Outcome Reward Model):** reward only the final answer.
- For LLMs: format rewards + verifiable outcome rewards (exact match, code execution) preferred to avoid hacking.

### Q4. How do importance sampling, rejection sampling, and other Monte Carlo methods fit into RL?

- **Importance sampling (IS):** reweights off-policy samples; used in PPO's surrogate ratio `π_θ/π_old`.
- **Rejection sampling:** accept/reject samples from a proposal; used in RLHF data filtering and best-of-N selection.
- **Monte Carlo rollouts:** estimate returns by full-trajectory sampling; high variance but unbiased.

### Q5. How is advantage computed in PPO and GRPO? Why subtract a baseline? Is std normalization necessary?

- **PPO (GAE):** `A_t = Σ (γλ)^k δ_{t+k}` where `δ_t = r_t + γV(s_{t+1}) − V(s_t)`.
- **GRPO:** group-relative — `A_i = (r_i − mean(group)) / std(group)`, no value network needed.
- **Baseline:** subtracting a baseline reduces variance without introducing bias (REINFORCE theorem).
- **Std normalization:** empirically stabilizes training but theoretically optional; DAPO and Dr.GRPO question its necessity.

### Q6. How do RL training and test-time scaling perform exploration differently?

- **Training:** exploration via stochastic sampling (temperature, entropy bonus, ε-greedy). The policy is updated to reinforce rewarded trajectories.
- **Test-time scaling:** best-of-N, beam search, MCTS, or repeated sampling with a verifier — no gradient updates. Exploration is over the fixed policy's distribution.

### Q7. How does PPO clipping work? Why take the minimum? What happens without clipping? How does CISPO differ?

PPO clips the IS ratio: `L = min(r·A, clip(r, 1−ε, 1+ε)·A)`. Taking the `min` is a pessimistic bound — it only updates when the clipped and unclipped objectives agree on direction.

- **Without clipping:** the policy can take excessively large steps, destabilizing training (the original TRPO problem).
- **CISPO:** replaces clipping with importance-weighted SFT on accepted samples — smoother optimization, avoids the discontinuity in PPO's gradient.

### Q8. Why does GRPO include a KL penalty? How is KL computed? Why do DAPO and GSPO remove it?

- KL penalty prevents the policy from drifting too far from the reference (SFT model), acting as a regularizer against reward hacking.
- Computed as token-level KL: `KL(π_θ || π_ref) = Σ_t log(π_θ(a_t)/π_ref(a_t))`.
- **DAPO:** removes KL because token-level KL is an imprecise constraint and interferes with entropy-driven exploration.
- **GSPO:** uses sequence-level KL instead of token-level, arguing it better aligns with the RL objective.

### Q9. During LLM training, what happens if loss is accidentally All Reduced multiple times?

All Reduce averages gradients across ranks. Doing it multiple times effectively divides the gradient by `world_size` each extra time — the effective learning rate shrinks exponentially. Can silently cause training to stall or converge to suboptimal solutions. Hard to detect without gradient norm logging.

### Q10. What is the reward function in DPO? Can reward hacking occur? How can it be mitigated?

- DPO implicitly defines reward: `r(x,y) = β log(π_θ(y|x)/π_ref(y|x))`.
- **Reward hacking:** the model can exploit distribution shift from π_ref without improving actual quality.
- **Mitigations:** IPO (identity transform), cDPO (conservative), iterative DPO with updated reference, or hybrid DPO+RM.

### Q11. What methods address train-inference mismatch in MoE models, and how do they work?

- **Expert choice routing** at train vs. **token choice** at inference causes load imbalance.
- **Auxiliary load-balancing loss:** penalizes uneven expert utilization.
- **DeepSeek MoE:** uses fine-grained expert splitting and shared experts.
- **OPD / Expert-parallel fine-tuning:** aligns routing distributions between train and serving.

### Q12. How should group size, learning rate, PPO epochs, and generation length be selected during RL training?

- **Group size (G):** larger G reduces variance of advantage estimate but increases memory; 8–64 typical.
- **LR:** typically 1e-6 to 5e-6 for LLM RL; lower than SFT to avoid policy collapse.
- **PPO epochs:** 1–4; more epochs risk over-optimization on old data.
- **Generation length:** should match target task; too short truncates reasoning, too long wastes compute. Cap with length penalty if needed.

### Q13. Compared with GRPO, how do Dr.GRPO, DAPO, GSPO, CISPO, SAPO, DPPO, MaxRL, and SimKO improve training?

| Method | Key Improvement | Limitation |
|--------|----------------|------------|
| **Dr.GRPO** | Removes length bias; per-token normalization | Minor gain over GRPO |
| **DAPO** | No KL, clip-higher, token-level loss | Careful entropy tuning needed |
| **GSPO** | Sequence-level KL constraint | More complex reference computation |
| **CISPO** | Replaces clip with IS-weighted SFT | Requires careful accept threshold |
| **SAPO** | Separates actor/critic updates; better stability | Extra hyperparameters |
| **DPPO** | Distributed PPO with async rollout | Staleness risk |
| **MaxRL** | Reward maximization with explicit diversity | Experimental |
| **SimKO** | Simplified KL objective, no reference model | Weaker regularization |

### Q14. How do TRPO, DPPO, and AReaL enforce trust-region constraints?

- **TRPO:** hard KL constraint via conjugate gradient + line search. Computationally expensive.
- **DPPO:** separates rollout workers from training, enforces trust region via clipping asynchronously.
- **AReaL:** uses partially stale rollouts with bounded staleness as an implicit trust region; monitors KL drift to trigger rollout refresh.

### Q15. Can RL fundamentally expand the capability frontier of LLMs?

Debated. RL can unlock latent capabilities (e.g., step-by-step reasoning in R1) and improve reliability on verifiable tasks. However, it likely cannot introduce genuinely new knowledge — it redistributes probability mass over already-learned behaviors. Capability frontier expansion requires the base model to have learned the skill implicitly during pre-training.

### Q16. Based on ProRL, how should we think about scaling RL training?

ProRL shows that prolonged RL training (>1000 steps) with curriculum and diverse task mixing continues to improve — contradicting early saturation beliefs. Key findings: task diversity prevents forgetting, reward signal quality matters more than quantity, and entropy maintenance is critical for sustained improvement.

### Q17. What improvements does OPD introduce over traditional RL and SFT?

OPD (Online Preference Distillation) combines online rollouts with preference-based distillation from a stronger teacher. It avoids the cold-start problem of pure RL and overcomes SFT's distribution shift by continuously generating on-policy data. Applications: math reasoning, code generation with execution feedback.

### Q18. At which stage of training does reasoning ability emerge in LLMs?

Evidence suggests reasoning emerges during **pre-training** at scale (chain-of-thought is latent in the base model). RL (e.g., R1-Zero) can surface and amplify it without SFT cold-start. However, the *reliability* and *length* of reasoning chains are shaped by post-training.

### Q19. From DeepSeek R1 to V3.2 and future V4, what RL-related improvements have been introduced?

- **R1:** GRPO-based RL on math/code with sparse verifiable rewards; "aha moment" self-reflection.
- **V3:** MoE base + multi-token prediction + RL alignment pipeline.
- **V3.2 / V4 (speculative):** longer context RL, improved MoE routing stability, process reward models, agentic RL with tool use. MoE adds expert load-balancing loss during RL.

---

## Infrastructure (Q20–Q35)

### Q20. Ignoring CPU offload, how many model copies exist in memory during GRPO training?

At minimum: **reference model** (frozen π_ref) + **actor** (π_θ) + **optimizer states** (Adam: 2× params in fp32). For GRPO without a value network: ~2 model copies (actor + reference) + optimizer states ≈ **3–4× parameter memory** in practice. With a critic: add another copy.

### Q21. Distributed inference: KV cache transfer optimization and multi-GPU communication strategies.

- **Prefill-decode disaggregation:** separate GPU pools for prefill vs. decode; KV cache transferred over NVLink/RDMA.
- **Chunked prefill:** interleaves prefill chunks with decode steps to reduce head-of-line blocking.
- **Paged KV cache (vLLM):** non-contiguous memory blocks, reduces fragmentation.
- **Communication:** NCCL all-reduce for TP; P2P send/recv for PP; RDMA for cross-node KV transfer.

### Q22. INT8 versus FP8. What are the tradeoffs? Which precisions are preferred for training and inference?

- **INT8:** simpler quantization, well-supported, but limited dynamic range for activations.
- **FP8 (E4M3/E5M2):** better dynamic range than INT8, natively supported on H100. E4M3 for weights/activations, E5M2 for gradients.
- **Training:** FP8 master weights risky; typically BF16 weights + FP8 compute (Transformer Engine).
- **Inference:** FP8 or INT8 (W8A8) for throughput; INT4 for memory-bound generation.

### Q23. What is the long-tail problem in RL rollouts, and how can it be addressed?

Some prompts generate much longer sequences than others, causing GPU idle time while waiting for the longest sequence in a batch. Solutions:

- **Sequence packing:** bin-pack sequences to fill fixed-length buffers.
- **Dynamic batching:** group by similar length.
- **Async rollout:** decouple generation from training; discard or requeue long stragglers.
- **Length penalty in reward:** discourage excessively long outputs.

### Q24. What issues does continuous batching introduce in RL training? How do vLLM and SGLang differ?

Continuous batching mixes sequences at different stages — problematic for RL because you need complete trajectories before computing rewards. Solutions: track per-request state, flush complete sequences.

- **vLLM:** PagedAttention, flexible scheduling, chunked prefill; rollout API via `AsyncLLMEngine`.
- **SGLang:** RadixAttention for prefix caching, faster TTFT, optimized for structured generation (multi-turn, tool calls).

### Q25. How do you measure utilization in vLLM and SGLang? How do you evaluate KV cache utilization during training?

- **GPU utilization:** `nvidia-smi`, but MFU (model FLOP utilization) is more meaningful.
- **vLLM metrics:** `/metrics` endpoint exposes `gpu_cache_usage_perc`, `num_running_requests`, `num_waiting_requests`.
- **SGLang:** similar Prometheus metrics endpoint.
- **Training KV cache:** monitor cache hit rate (prefix reuse) and eviction rate; high eviction → increase cache budget or reduce batch size.

### Q26. How is backpropagation implemented in large-scale multi-node RL training?

- **Tensor Parallelism (TP):** split weight matrices across GPUs; all-reduce after each layer.
- **Pipeline Parallelism (PP):** micro-batches flow through stages; gradient accumulation across micro-batches.
- **FSDP / ZeRO-3:** shard optimizer states, gradients, and params across DP ranks; all-gather before forward, reduce-scatter after backward.
- RL-specific: actor backward pass only on accepted tokens; reference model kept frozen (no backward).

### Q27. What asynchronous RL frameworks exist, and what synchronization bottlenecks do they solve?

- **IMPALA:** async actor-learner; solves GPU idle from slow environment steps.
- **DPPO / RLHF async:** decouples rollout workers from training; solves the generation bottleneck (~3–10× slower than training step).
- **AReaL:** partially async — rollouts from slightly stale policy, bounded by KL; solves the sync barrier between inference and training clusters.
- **slime:** fully async with Megatron backend; uses shared memory ring buffers for data flow.

### Q28. In AReaL or other partially rollout frameworks, are KV caches from previous policies preserved?

No, in general. When policy weights update, the KV cache computed under the old policy is stale and would produce incorrect attention outputs. AReaL refreshes the inference engine (or restarts vLLM workers) after weight sync. Some systems use speculative decoding-style checks, but recomputation is the safe default.

### Q29. How does Expert Parallelism affect MoE throughput?

Expert Parallelism (EP) shards experts across GPUs — each GPU holds a subset of experts. For a token routed to expert *i*, it must be sent to the GPU holding that expert via All-to-All communication. This adds latency proportional to `message_size × num_experts / bandwidth`. High EP degree → lower memory per GPU but higher communication overhead. Optimal EP degree balances compute vs. network saturation.

### Q30. In long-context training, how should compute-communication overlap be designed? How do Megatron and FSDP differ in parallelism strategies?

- **Overlap strategy:** pipeline communication behind computation using CUDA streams; prefetch next micro-batch while computing current.
- **Megatron:** interleaved 1F1B pipeline schedule with virtual stages; sequence parallelism (layernorm/dropout split across TP ranks); explicit all-gather/compute overlap.
- **FSDP:** lazy all-gather via forward hooks; `forward_prefetch` and `backward_prefetch` options. Less efficient for long context due to larger all-gather buckets.

### Q31. How do you enable deterministic execution? What is batch invariance? What causes it? Is atomic add involved?

- **Deterministic execution:** `torch.use_deterministic_algorithms(True)`, set seeds, disable TF32.
- **Batch invariance:** result should not change depending on how data is batched (e.g., same sequences in one batch vs. split across two). Violated by operations depending on batch statistics or non-deterministic reductions.
- **Cause:** `atomicAdd` in CUDA reductions is non-deterministic across thread orderings. Flash attention, softmax, and layer norm are common culprits.
- **Mitigation:** deterministic CUDA kernels (`CUBLAS_WORKSPACE_CONFIG=:4096:8`) or avoid atomic reductions in critical paths. Atomic add alone cannot solve batch invariance — it addresses within-kernel ordering, not cross-sample dependencies.

### Q32. How do AReaL and slime differ in their understanding of the RL rollout bottleneck?

- **AReaL:** bottleneck is the synchronization barrier between rollout and training. Solution: allow bounded-stale rollouts so training never waits for generation to finish.
- **slime:** bottleneck is KV cache memory and inference engine throughput under RL workload (variable lengths, frequent weight updates). Solution: tight Megatron integration with shared memory, avoiding vLLM restart overhead on weight sync.

### Q33. How should we think about staleness in fully asynchronous RL training? What are typical values in practice?

Staleness = number of gradient updates between when a rollout was generated and when it's used for training. High staleness → IS ratio `π_θ/π_old` drifts → clipping becomes too aggressive or too permissive. Typical practice: track staleness per sample, discard or reweight samples beyond a threshold (e.g., 2–4 updates stale). AReaL monitors per-sample KL to bound staleness implicitly. In practice, staleness of 1–3 steps is generally acceptable for LLM RL workloads.

### Q34. How does data flow through slime? How is it integrated with Megatron? How is the loss computed?

- **Data flow:** Megatron handles training; slime manages rollout workers (vLLM-based). After each training step, updated weights are broadcast to rollout workers via shared memory or NCCL. Rollout workers generate trajectories, queued in a ring buffer and consumed by the Megatron training loop.
- **Megatron integration:** slime hooks into Megatron's training loop via a custom data iterator that pulls from the rollout queue instead of a static dataset.
- **Loss:** standard PPO/GRPO loss computed over log-probs from Megatron's forward pass; reference log-probs either recomputed or stored during rollout.

### Q35. If you had to choose among VeRL, TRL, Unsloth, AReaL, and slime, which one would you use and why?

| Framework | Best For |
|-----------|----------|
| **TRL** | Rapid prototyping, small models, research experiments |
| **Unsloth** | Single-GPU fine-tuning, memory efficiency (QLoRA), low-budget |
| **VeRL** | Production LLM RL at scale, Ray-based, good vLLM integration |
| **AReaL** | Async RL research, studying staleness, academic scale |
| **slime** | Megatron-native shops, largest-scale training, MoE models |

**Recommendation:** VeRL for most industry use cases (mature, well-documented, Ray ecosystem). slime if you're training >100B parameter MoE models with Megatron already in your stack.
