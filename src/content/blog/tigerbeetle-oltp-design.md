---
title: Designing a High-Performance OLTP Database from First Principles
slug: tigerbeetle-oltp-design
date: 2026-01-06
author: Shubham Rasal
tags:
  - systems
---

*A deep dive inspired by TigerBeetle and Viewstamped Replication*

While reading about **Viewstamped Replication (VSR)**, I came across **TigerBeetle**, which uses this replication protocol to achieve extremely high reliability. Little did I know how fascinating the design of such a database would turn out to be.

If you had to design a **highly efficient OLTP database from first principles**, how would you do it?

One strong answer is: *do what TigerBeetle did*.

TigerBeetle builds its system by tightly integrating the four primary dimensions of computer science—**network, storage, memory, and compute**—to arrive at a configuration that is radically more optimal than conventional databases.

---

## Design Goals

The system starts with a set of aggressive but clear goals:

* No horizontal scaling—optimize **orders of magnitude** of ops/sec on a single node
* **1000× performance**
* **10× safety**
* **10× developer and operator experience**

```
                    Design Goals
                         |
        +----------------+----------------+
        |                |                |
    1000× Perf      10× Safety    10× Dev/Ops Exp
        |                |                |
  Orders of mag    Data Integrity    Simplicity
   more ops/sec     & Durability     & Reliability
                         |
              Single Node Optimization
                         |
            No Horizontal Scaling Complexity
```

---

## Rethinking OLTP Workloads

The nature of OLTP workloads has changed drastically over time.

Originally, OLTP systems handled simple debit/credit operations, primarily for financial data. These operations are essentially **database transactions derived from business transactions**.

If we conceptually split OLTP into:

* **OLGP** – general-purpose workloads
* **OLTP** – pure transaction processing

we can target scale far more effectively.

### Inverting Query Amplification

Traditional financial databases often require **~10 database queries per business transaction**.

What if we invert this relationship?

Because OLTP workloads are fundamentally accounting workloads:

> **1 database query = 1000 business transactions**

This inversion fundamentally changes scalability.

```
Traditional Approach:
    1 Business Transaction  →  ~10 Database Queries
    ❌ High overhead, many round trips

Inverted Approach (TigerBeetle):
    1 Database Query  →  ~1000 Business Transactions
    ✅ Massive batching, optimal throughput
```

---

## Exploiting the Four Axes

```
           TigerBeetle Architecture
                    |
    +-------+-------+-------+-------+
    |       |       |       |       |
 Network Storage Memory  Compute
    |       |       |       |
    |       |       |       +-- Viewstamped Replication
    |       |       |       +-- Deterministic Leader Election
    |       |       |
    |       |       +-- Zero-copy
    |       |       +-- Zero-allocation
    |       |       +-- No runtime malloc
    |       |
    |       +-- 1 MiB WAL writes
    |       +-- Direct I/O
    |
    +-- Batching: 8000 txns/batch
```

### Network

With batching:

* One `recv()` call can ingest ~1 MiB of data
* This corresponds to roughly **8000 transactions** per batch

### Storage

* One `write()` call writes a 1 MiB WAL entry
* Low latency via `fsync()` or direct I/O

**Note:**
Direct I/O is now often faster than buffered I/O due to modern storage hardware. The real bottleneck has shifted to **memory**, which must be addressed via:

* Zero-copy
* Zero-allocation
* No `malloc` during runtime

### Compute

Distributed systems must handle **leader election** when the primary node fails—which is inevitable.

Common consensus algorithms include Paxos and Raft. Here, we focus on **Viewstamped Replication (VSR)**, which handles primary failure while preserving operation order and data correctness.

---

## Viewstamped Replication (VSR)

### Key Notes

* Use VSR on a *single-node* system to turn it into a **highly available distributed system**
* Fault tolerance is achieved through **redundancy in space and time**
* Based on **state machine replication**: initial state + replicated operation log → identical final state

TigerBeetle uses VSR instead of Paxos or Raft primarily because **leader election is deterministic**.

```
VSR Protocol Flow:

Client ────Request───> Primary
                         |
                      Prepare
                         |
          +--------------+---------------+
          |                              |
    Prepare Msg                    Prepare Msg
          |                              |
          v                              v
      Replica 1                      Replica 2
          |                              |
     Prepare OK                     Prepare OK
          |                              |
          +--------------+---------------+
                         |
                         v
                      Primary
                         |
                      Commit
                         |
          +--------------+---------------+
          |              |               |
      Response      Commit Msg      Commit Msg
          |              |               |
          v              v               v
       Client        Replica 1       Replica 2
```

---

## The Performance Result

> **4 syscalls, 4 memory copies, 3 network requests → ~8000 TPS**

The biggest win is actually the **reduction of row locks**—from ~16k down to effectively zero.

```
Request Batch → recv syscall → write WAL syscall → send ack syscall → read state syscall
                                                                              |
                                                                         8000 TPS ✅
```

---

## Why Only Four Syscalls?

In a typical processing cycle, the system needs to:

1. **Receive** batched requests from the network
2. **Write** them to the WAL
3. **Send** acknowledgments
4. **Read** state for processing

Instead of issuing a syscall per packet or block, TigerBeetle aggregates all operations.

Using `io_uring`, the application submits a batch of reads and writes and enters the kernel **once**. This allows a **single execution thread** to saturate modern NVMe drives and 100 GbE network links.

---

## Durability Considerations

* More scale demands more durability
* Even **0.5% disk corruption over two years** becomes catastrophic at large scale
* Durability issues grow **exponentially** with workload size

```
Scale
  └─> More Data
       └─> Higher Risk of Corruption
            └─> Exponential Impact
                 └─> Need Cryptographic Guarantees
```

---

## Replication Concerns with Raft

* Raft does not exploit global redundancy
* In a 1-primary, 2-replica setup:

  * One replica missing data
  * One replica corrupted
* If the primary fails, Raft cannot determine a new leader and stalls

TigerBeetle avoids this by using **cryptographic hash chains** for replication integrity.

```
Raft Limitation:
    Replica 1: Missing Data
    Replica 2: Corrupted
    Primary Fails
      └─> Cannot Elect New Leader
           └─> System Stalls ❌

TigerBeetle Solution:
    Cryptographic Hash Chains
      └─> Verify Data Integrity
           └─> Safe Leader Election ✅
```

---

## Codebase Deep Dive

* Written in **Zig**
* Explicit control flow
* Strict, static resource allocation
* Extensive use of *"checksums to check the checksums"*

Every data structure—from protocol headers to on-disk state—is fortified with cryptographic checksums.

### Core Components

* **VSR implementation:** `src/vsr.zig`
* **Replica state machine:** `src/vsr/replica.zig`

  * Acts as the CPU of a TigerBeetle node
  * Transitions state based on VSR messages (Prepare, Commit, ViewChange, etc.)

One interesting finding from [this crash report](https://github.com/tigerbeetle/tigerbeetle/issues/1590)
is how the `quorum_headers` function tallies cluster responses.

Time is measured not in wall-clock seconds, but in **logical ticks**—processed messages via `replica.tick()`.

Because state is a pure function of the log, **state transfer** is as simple as sending snapshots or data files.

```
Replica State Machine:

    [Start]
       |
       v
   ┌────────┐
   │ Normal │<─────────────┐
   └────────┘              |
       |                   |
  Primary Failure          |
       |                   |
       v                   |
   ┌───────────┐           |
   │ ViewChange │          |
   └───────────┘           |
       |                   |
  log_view < view?         |
       |                   |
    +──+──+                |
    |     |                |
   Yes   No                |
    |     |                |
    v     v                |
DoViewChange  StartView    |
    |          |           |
    |          |           |
    +────┬─────+           |
         |                 |
    New Primary Elected    |
         |                 |
         └─────────────────┘
```

---

## Handling Leader Failure

To initiate leader change, a replica transitions from **normal mode** to **participation mode**.

This is handled in `src/vsr/superblock.zig`:

```zig
pub fn view_headers(superblock: *const SuperBlockHeader) vsr.Headers.ViewChangeSlice {
    return vsr.Headers.ViewChangeSlice.init(
        if (superblock.vsr_state.log_view < superblock.vsr_state.view)
           .do_view_change
        else
           .start_view,
        superblock.view_headers_all[0..superblock.view_headers_count],
    );
}
```

If `log_view < view`, the system infers a transition state and executes `do_view_change`.

The critical insight: **view state is persisted in the superblock**, not volatile memory.

---

## Storage as the Anchor of Trust

TigerBeetle does not rely on filesystem guarantees—because they effectively do not exist.

Instead, it implements its own transactional guarantees using a **cryptographic hash chain**, capable of reconstructing a universal state even from partially corrupted replicas.

### SuperBlockHeader

Defined in [src/vsr/superblock.zig](https://github.com/tigerbeetle/tigerbeetle/blob/main/src/vsr/superblock.zig)

Uses Zig's `extern struct` to guarantee precise on-disk layout.

Key fields include:

| Field       | Type       | Description                  |
| ----------- | ---------- | ---------------------------- |
| `checksum`  | `u128`     | Checksum of remaining fields |
| `copy`      | `u16`      | Superblock copy index (0–3)  |
| `sequence`  | `u64`      | Monotonic version counter    |
| `cluster`   | `u128`     | Cluster UUID                 |
| `parent`    | `u128`     | Hash of previous superblock  |
| `vsr_state` | `VSRState` | Embedded consensus state     |

Embedding `VSRState` directly into storage solves **split-brain at the storage layer**. On startup, the node immediately knows its latest consensus state—no log replay needed.

The superblock is physically duplicated **four times on disk**.

```
        SuperBlock
            |
    +-------+-------+-------+
    |       |       |       |
  Copy 0  Copy 1  Copy 2  Copy 3
    |       |       |       |
    +-------+-------+-------+
            |
        Redundancy
            |
   Survives Partial Corruption
```

---

## Journal (WAL) as a Hash Chain

TigerBeetle's WAL—called the *journal*—is not a simple append log.

Each entry contains:

* A sequence number
* A checksum pointing to the previous entry

This forms a hash chain similar to a blockchain.

The function `valid_hash_chain_between` verifies integrity across log ranges. If corruption is detected (e.g., torn writes), the system repairs itself by fetching clean blocks from peers.

```
Journal Hash Chain:

[Entry 1] --checksum--> [Entry 2] --checksum--> [Entry 3] --checksum--> [Entry 4] --checksum--> [Entry 5]

Each entry contains:
  - Sequence number
  - Checksum of previous entry
  - Transaction data

Similar to blockchain structure for integrity verification
```

---

## Storage Data Structures

Instead of a single LSM tree, TigerBeetle uses an **LSM forest**:

* **Object trees** – transfers sorted by timestamp
* **Index trees** – primary and secondary indexes

This improves locality and performance.

```
        LSM Forest
            |
    +-------+-------+
    |               |
Object Trees   Index Trees
    |               |
Transfers by    +---+---+
 Timestamp      |       |
                |       |
            Primary  Secondary
            Indexes  Indexes
                |
                v
         Better Locality
                |
                v
        Higher Performance
```

---

## I/O: Direct I/O and Determinism

TigerBeetle bypasses OS abstractions like page cache to eliminate unpredictability.

From `/src/io/linux.zig`:

```zig
fn fs_supports_direct_io(dir_fd: fd_t)!bool {
    if (!@hasField(posix.O, "DIRECT")) return false;
    //...
}
```

Kernel page cache is dangerous because:

1. `fsync()` may lie about durability
2. Memory pressure causes unpredictable eviction
3. Cached corruption propagates silently

```
Traditional I/O ❌                Direct I/O ✅
      |                                |
 Kernel Page Cache               Bypass Page Cache
      |                                |
  +---+---+                       +----+----+
  |   |   |                       |         |
fsync  Unpredictable        Deterministic  True
may lie  eviction           Behavior     Durability
      |
Silent corruption
```

---

## Static Memory Allocation

Many production crashes happen under load due to allocation failures.

TigerBeetle avoids this entirely:

* Startup: compute maximum memory requirements
* Allocate one large contiguous block
* Runtime: pop and return buffers from a pool

See `src/message_pool.zig` and [this stack trace](https://github.com/tigerbeetle/tigerbeetle/issues/1137)

```
Static Memory Allocation Flow:

Startup
  └─> Calculate Max Memory Requirements
       └─> Allocate One Large Contiguous Block
            └─> Create Buffer Pool
                 └─> Runtime ✅
                      ├─> Pop Buffer
                      ├─> Use Buffer
                      └─> Return Buffer
                           └─> (cycle continues)

Benefits:
  • No allocation failures under load
  • Predictable memory usage
  • No fragmentation
  • Zero runtime malloc overhead
```

---

## A Note on Programming Style

This style of programming is refreshing.

Even without deep familiarity with Zig, the code is easy to follow due to:

* Explicit callbacks
* Clear control flow
* Descriptive struct layouts
* Noun-based naming (`replica.pipeline`, `replica.preparing`)

It is a style that makes correctness obvious—and bugs uncomfortable.

---

**End result:** a database designed from first principles, where performance, safety, and determinism are not trade-offs, but consequences of the architecture.

---

## References

- [TigerBeetle Documentation - Concepts](https://docs.tigerbeetle.com/concepts/)
- [Viewstamped Replication Explained](https://blog.brunobonacci.com/2018/07/15/viewstamped-replication-explained/)
- [InfoQ Presentation: Redesigning OLTP](https://www.infoq.com/presentations/redesign-oltp/)
- [TigerBeetle Codebase on GitHub](https://github.com/tigerbeetle/tigerbeetle)
