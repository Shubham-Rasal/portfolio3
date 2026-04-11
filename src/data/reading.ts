export type ReadingLinkKind =
  | "paper"
  | "blog"
  | "wiki"
  | "web"
  | "pdf"
  | "docs"
  | "huggingface"
  | "default";

export interface ReadingLink {
  href: string;
  label: string;
  kind: ReadingLinkKind;
}

export interface ReadingItem {
  title: string;
  /** One line on why this is worth the click */
  hook: string;
  links: ReadingLink[];
}

export type CategoryIcon =
  | "sigma"
  | "layers"
  | "zap"
  | "rocket"
  | "infinity"
  | "book"
  | "flask"
  | "database"
  | "gauge"
  | "sparkles"
  | "history";

export interface ReadingCategory {
  id: string;
  title: string;
  subtitle?: string;
  icon: CategoryIcon;
  items: ReadingItem[];
}

export const readingIntro =
  "Papers and posts I’m circling.";

export const readingCategories: ReadingCategory[] = [
  {
    id: "delta-grokking",
    icon: "sigma",
    title: "Deep Delta / Residual Geometry / Grokking",
    subtitle: "How networks learn, and when generalization “clicks.”",
    items: [
      {
        title: "Deep Delta Learning",
        hook: "Reframes learning dynamics through a delta lens—if you like optimization geometry, start here.",
        links: [
          {
            href: "https://arxiv.org/abs/2601.00417",
            label: "arXiv",
            kind: "paper",
          },
        ],
      },
      {
        title: "The Delta Rule (Background)",
        hook: "The classic update rule behind a lot of what follows—quick Wikipedia grounding.",
        links: [
          {
            href: "https://en.wikipedia.org/wiki/Delta_rule",
            label: "Wikipedia",
            kind: "wiki",
          },
        ],
      },
      {
        title: "Grokking: Generalization Beyond Overfitting",
        hook: "The paper that named the phenomenon: memorization first, generalization later.",
        links: [
          {
            href: "https://arxiv.org/abs/2201.02177",
            label: "arXiv",
            kind: "paper",
          },
        ],
      },
      {
        title: "Why Neural Networks Suddenly Start Generalizing",
        hook: "OpenAI’s readable take on the grokking story—good intuition before the heavy proofs.",
        links: [
          {
            href: "https://openai.com/research/grokking",
            label: "OpenAI Research",
            kind: "blog",
          },
        ],
      },
    ],
  },
  {
    id: "nested-meta",
    icon: "layers",
    title: "Nested / Multi-Timescale / Meta Learning",
    subtitle: "Learning to learn, and systems that update at more than one clock speed.",
    items: [
      {
        title: "Introducing Nested Learning – Google Research Blog",
        hook: "Google’s framing of nested optimization—useful mental model for continual learning.",
        links: [
          {
            href: "https://research.google/blog/introducing-nested-learning-a-new-ml-paradigm-for-continual-learning/",
            label: "Google Research",
            kind: "blog",
          },
        ],
      },
      {
        title: "Learning to Learn by Gradient Descent by Gradient Descent",
        hook: "Meta-learning classic: an optimizer learned by gradient descent—still cited everywhere.",
        links: [
          {
            href: "https://arxiv.org/abs/1606.04474",
            label: "arXiv",
            kind: "paper",
          },
        ],
      },
      {
        title: "Meta-Learning in Neural Networks: A Survey",
        hook: "Wide-angle map of the field if you want references more than a single trick.",
        links: [
          {
            href: "https://arxiv.org/abs/1810.03548",
            label: "arXiv",
            kind: "paper",
          },
        ],
      },
    ],
  },
  {
    id: "spec-decode",
    icon: "zap",
    title: "Speculative Decoding / Draft Models",
    subtitle: "Faster generation by guessing ahead—core ideas behind modern fast inference.",
    items: [
      {
        title: "Accelerating Large Language Model Decoding with Speculative Sampling",
        hook: "Foundational speculative sampling paper—how a small draft model speeds up a large one.",
        links: [
          {
            href: "https://arxiv.org/abs/2211.17192",
            label: "arXiv",
            kind: "paper",
          },
        ],
      },
      {
        title: "Speculative Decoding with Draft Models (Original Paper)",
        hook: "Pairs draft and target models explicitly—read after the sampling paper above.",
        links: [
          {
            href: "https://arxiv.org/abs/2302.01318",
            label: "arXiv",
            kind: "paper",
          },
        ],
      },
      {
        title: "SpecExtend: Scaling Speculative Decoding to Long Contexts",
        hook: "Pushes speculative ideas into long-context regimes where latency really hurts.",
        links: [
          {
            href: "https://arxiv.org/abs/2505.20776",
            label: "arXiv",
            kind: "paper",
          },
        ],
      },
      {
        title: "Dynamic Depth Decoding for Efficient LLM Inference",
        hook: "Adaptive depth during decoding—another lever beyond pure draft models.",
        links: [
          {
            href: "https://arxiv.org/abs/2409.00142",
            label: "arXiv",
            kind: "paper",
          },
        ],
      },
    ],
  },
  {
    id: "eagle",
    icon: "rocket",
    title: "EAGLE / Advanced Speculative Heads",
    subtitle: "Learned drafting and bringing research into production stacks.",
    items: [
      {
        title: "EAGLE-3: Efficient Accelerated Generation via Learned Drafting",
        hook: "State-of-the-art learned drafting—dense, but the figures repay the time.",
        links: [
          {
            href: "https://arxiv.org/abs/2503.01840",
            label: "arXiv",
            kind: "paper",
          },
        ],
      },
      {
        title: "From Research to Production: Accelerate OSS LLMs with EAGLE-3 on Vertex AI",
        hook: "How Google ships these ideas—good if you care about serving, not just theory.",
        links: [
          {
            href: "https://cloud.google.com/vertex-ai/docs/blog/posts/from-research-to-production-accelerate-oss-llm-with-eagle-3-on-vertex",
            label: "Google Cloud Blog",
            kind: "blog",
          },
        ],
      },
    ],
  },
  {
    id: "long-context",
    icon: "infinity",
    title: "Long Context / Memory / RLM-Style Ideas",
    subtitle: "When attention windows need to stretch beyond the usual.",
    items: [
      {
        title: "Transformer-XL: Attentive Language Models Beyond a Fixed-Length Context",
        hook: "Segment-level recurrence for longer dependencies—still a useful baseline to know.",
        links: [
          {
            href: "https://arxiv.org/abs/1901.02860",
            label: "arXiv",
            kind: "paper",
          },
        ],
      },
      {
        title: "LongNet: Scaling Transformers to 1M Tokens",
        hook: "Dilated attention at extreme lengths—skim the method, stare at the scaling plots.",
        links: [
          {
            href: "https://arxiv.org/abs/2307.02486",
            label: "arXiv",
            kind: "paper",
          },
        ],
      },
    ],
  },
  {
    id: "ngram-deepseek",
    icon: "book",
    title: "N-grams / DeepSeek / Classical Foundations",
    subtitle: "From count-based LMs to modern reasoning-focused training.",
    items: [
      {
        title: "A Tutorial on N-gram Language Models",
        hook: "Jurafsky & Martin’s PDF—if you only read one classical LM chapter, make it this.",
        links: [
          {
            href: "https://web.stanford.edu/~jurafsky/slp3/3.pdf",
            label: "Stanford PDF",
            kind: "pdf",
          },
        ],
      },
      {
        title: "DeepSeek-R1: Incentivizing Reasoning Capability via Reinforcement Learning",
        hook: "How RL shaped a model people actually talk about—worth it for the training story.",
        links: [
          {
            href: "https://arxiv.org/abs/2501.12948",
            label: "arXiv",
            kind: "paper",
          },
        ],
      },
    ],
  },
  {
    id: "optimizers",
    icon: "flask",
    title: "Optimizer Discovery / RL for Training Rules",
    subtitle: "When the optimizer itself becomes the learned artifact.",
    items: [
      {
        title: "Learning to Optimize",
        hook: "Learns optimization algorithms as policies—foundational for “optimizer as network” work.",
        links: [
          {
            href: "https://arxiv.org/abs/1606.01885",
            label: "arXiv",
            kind: "paper",
          },
        ],
      },
      {
        title: "Discovering Optimization Algorithms via Reinforcement Learning",
        hook: "RL search over update rules—wild to see hand-designed optimizers emerge from scratch.",
        links: [
          {
            href: "https://arxiv.org/abs/1709.07417",
            label: "arXiv",
            kind: "paper",
          },
        ],
      },
    ],
  },
  {
    id: "data",
    icon: "database",
    title: "Data / Datasets / Web Corpora",
    subtitle: "What goes into large models before the architecture even shows up.",
    items: [
      {
        title: "FineWeb: A New Large-Scale Web Dataset",
        hook: "High-quality web data at scale—useful context for “what’s in the pile.”",
        links: [
          {
            href: "https://huggingface.co/datasets/HuggingFaceFW/fineweb",
            label: "Hugging Face",
            kind: "huggingface",
          },
        ],
      },
      {
        title: "The Common Crawl Dataset",
        hook: "The raw web snapshot pipeline everyone builds on—skim for scope, not polish.",
        links: [
          {
            href: "https://commoncrawl.org",
            label: "Common Crawl",
            kind: "web",
          },
        ],
      },
      {
        title: "The Pile: An 800GB Dataset of Diverse Text",
        hook: "Landmark heterogeneous text dump—still a reference for data diversity arguments.",
        links: [
          {
            href: "https://arxiv.org/abs/2101.00027",
            label: "arXiv",
            kind: "paper",
          },
        ],
      },
      {
        title: "NVIDIA NeMo Data Curation Overview",
        hook: "Practical curation patterns from NVIDIA—good when you’re building pipelines, not papers.",
        links: [
          {
            href: "https://docs.nvidia.com/nemo-framework/user-guide/latest/nlp/data.html",
            label: "NVIDIA Docs",
            kind: "docs",
          },
        ],
      },
    ],
  },
  {
    id: "systems",
    icon: "gauge",
    title: "Flash / Systems / Acceleration",
    subtitle: "When decoding speed is the product feature.",
    items: [
      {
        title: "dFlash: Fast and Accurate LLM Decoding",
        hook: "Z-Lab’s project page—tight write-up if you’re chasing latency wins.",
        links: [
          {
            href: "https://z-lab.ai/projects/dflash/",
            label: "Z-Lab",
            kind: "blog",
          },
        ],
      },
    ],
  },
  {
    id: "archive",
    icon: "sparkles",
    title: "Articles from the archive you won’t regret reading",
    subtitle: "Non-ML essays that stuck—agency, luck, and how people grow.",
    items: [
      {
        title: "How to Time Travel",
        hook: "Brian Chesky on learning from the future—short, memorable, oddly practical.",
        links: [
          {
            href: "https://medium.com/@bchesky/how-to-time-travel-b604096d5ed0",
            label: "Medium",
            kind: "blog",
          },
        ],
      },
      {
        title: "High Agency",
        hook: "George Mack’s lens on people who bend reality—pair with any career essay.",
        links: [
          {
            href: "https://highagency.com",
            label: "Website",
            kind: "web",
          },
        ],
      },
      {
        title: "How to Get Lucky",
        hook: "Taylor Pearson on increasing surface area for luck—better than another hustle thread.",
        links: [
          {
            href: "https://taylorpearson.me/luck/",
            label: "Blog",
            kind: "blog",
          },
        ],
      },
      {
        title: "Childhoods of Exceptional People",
        hook: "Henrik Karlsson’s deep dive—slow read, big payoff if you like biographical patterns.",
        links: [
          {
            href: "https://www.henrikkarlsson.xyz/p/childhoods",
            label: "Substack",
            kind: "blog",
          },
        ],
      },
    ],
  },
  {
    id: "earlier",
    icon: "history",
    title: "Earlier readings",
    subtitle: "Old favorites still on the stack.",
    items: [
      {
        title: "Attention is all you need",
        hook: "The transformer paper—still the right place to start if you’ve only used the API.",
        links: [
          {
            href: "https://arxiv.org/abs/1706.03762",
            label: "arXiv",
            kind: "paper",
          },
        ],
      },
      {
        title: "The Curse of Dimensionality",
        hook: "Hinton’s IJCNN piece—short PDF if you want classical intuition for high-D geometry.",
        links: [
          {
            href: "https://www.cs.toronto.edu/~hinton/absps/ijcnn91.pdf",
            label: "PDF",
            kind: "pdf",
          },
        ],
      },
    ],
  },
];
