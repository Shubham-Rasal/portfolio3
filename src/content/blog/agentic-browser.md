---
title: "An Agentic Browser: What It Needs To Be"
slug: working-hard
date: 2025-05-31
author: Shubham Rasal
tags:
  - ai
  - agents
  - idea
---

I was scrolling X, as you do, and thinking: **How do you _really_ build an AI-native agentic browser?**

Browsers are our main window to the internet. Many companies are adding AI to them. But it doesn't feel right. I found this blogpost by a YC GP on how AI native applications should feel like - https://koomen.dev/essays/horseless-carriages/

For me to use a new one, it needs to hit a few marks:

- **All my current browser stuff (like Chrome) must work.** No missing features.
- **It needs to be private.** Using local LLMs is key here.

That's it for the basics. I'm okay with new ways of doing things, even if it means changing habits.

---

### Some featured I would like

Here are some features that would make a browser incrementally agentic:

#### Auto Tab Grouping

Browsers already group tabs. I want it **supercharged**. A small, local LLM could group tabs based on what I'm reading or doing. It would just know.

#### Learn Mode

This is like RLHF (Reinforcement Learning with Human Feedback). It's how models like ChatGPT got so good. This should be built into the browser. It would learn from my repetitive tasks.

Think about these scenarios:

- **Researching a company** and its people.
- Going down **Hackernews rabbitholes** to find comments or resources.

#### Fast, Unified Memory

My bookmarks and history need a better system. I want **fast, unified memory** for them.

---

### How To Build These Features

Now, how would these smart features actually work?

#### For Auto Tab Grouping: A Local Brain for Your Tabs

Imagine a mini-AI, a small LLM, right inside your browser. This "local brain" would constantly look at the stuff on your open tabs: the words, the titles, even the website addresses. It would learn what kinds of things you work on together. For example, if you open three tabs about "new running shoes," it would see they're similar and put them in a "shopping" group for you. It gets smarter over time, learning your own way of organizing.

#### For Learn Mode: Watching and Getting Feedback

This is trickier. The browser would "watch" what you do. Not in a creepy way, but like a smart helper. When you do something over and over, like always opening a specific set of websites to research a company, the browser notices that pattern.

Then, the next time, it might pop up and ask, "Hey, are you researching a company again? Want me to open those usual sites for you?" If you say "yes," it gets a good mark. If you say "no," it learns not to do it that way next time. This feedback (your "yes" or "no") helps it get better at helping you with your tasks, making it super personalized.

#### For Fast, Unified Memory: An AI Library for Everything You've Seen

Think of your browser's history and bookmarks like a giant library. Right now, it's a bit messy. With a **fast, unified memory**, when you visit a website or save a bookmark, the browser's "brain" (the LLM) would read and understand what that page is about. It stores this understanding, not just the link.

Later, when you need to find something, you don't just search for a keyword. You could ask, "Find that article about running shoe reviews from last week," even if you don't remember the exact website. The AI would use its understanding of all the pages you've seen to find exactly what you're looking for, super fast. It's like having a perfect memory for everything you've ever browsed.

---

Implementing these features with current tech is **non-trivial**. The current way is often using agents with an LLM.

The goal is a browser that truly understands and helps you. It's about moving from just a tool to something with digital intuition.