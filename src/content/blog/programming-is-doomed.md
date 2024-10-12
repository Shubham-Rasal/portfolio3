---
title: Programming is doomed
slug: programming-is-doomed
date: 2023-11-10
author: Shubham Rasal
tags: [programming, ai, philosophy]
---
[Shamir's Secret Sharing](https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing) algorithm.
## Introduction

Today I had an assignment in a Data structures and Algorithms Lab to implement integer multiplication using following:

- Recursion
- [karatsuba](https://courses.csail.mit.edu/6.006/spring11/exams/notes3-karatsuba)
- bitwise efficient implementation

The internet was not allowed and I was not on my usual coding setup (vs code).
I couldn't complete the assignment in time. But I realized something about my way of programming. 
## My coding methodology

I use vs code as my primary editor (with vim bindings, yet to become hardcore vi enthusiast) along with GitHub copilot which is a code completion tool. Also I have a lot of language extensions that assist me with awesome autocompletion.

Before 2021, when I started coding, I used to spend a lot of time going through stack overflow, GitHub issues, docs to figure out something that made the computer do what I needed.

After I started using copilot, I stopped losing context while coding. I could focus more on what I really cared that was solving the problem I had. I never leave my editor for checking syntax or finding a way to filter an array. Copilot just works. This made me think what is programming all about. 


## What is programming?

Computer Science is all about -

`Converting ideas into program through some intermediate steps like algorithms, flowcharts and eventually code. It is to write programs, see that they are understandable and maintainable by humans in future.`

According to me, I lack at all the described aspects. I am bad at reading someone else's code (or my own code after 2 weeks), maintaining my own code itself seems like a daunting task. Also, I try to write code that usually works and solves my current problem and I rarely think about it's understandability.

To go back to the goal of Computer Science is to convert ideas into programs that can be executed by an von Neuman machine. Can you see that there is no mention of humans in this definition. Why should human be the only ones to write programs. 

We started with binary (arranging MOSFETS in a certain structure and passing correct signals through it to get a sum of two 8 bit digits, for example), then we built high level constructs like assembly then Pascal, FORTRAN and C. Then we started building higher order construct using these languages like python and JavaScript. If you observe this is all so that human can focus more on the idea expression side of it and less time coding up the instructions for the computer. 

## If AI written code becomes the norm

For now, if we assume that AI written code is as good as an average developer, reviewing it and sending it into production won't be an issue as long as thoroughly reviewed (which can also be assisted by another specialized model).

This might give rise to interesting behavioral  changes in programming. For starters, all the design pattern that are currently abundant in most of the codebases (more so in languages like JAVA) are tailored to human understanding and easy readability. AI written code need not be restricted to such arbitrary patterns as long as the code works. 

Just as we have gotten used to probabilistic answering nature of LLMs where no one yet completely understands it's working but still it's output can more or less be considered on par with most of junior level coders, we will soon get habituated with having code that you understand less and less but have a high level understanding of what is does. 
## Is programming limited to computers?

OpenAI recently launched their new features like pdf chats, custom GPT builder without code (you can just talk with a base model and create a custom GPT) , etc. What really caught my eye was this new Assistant API which can help you develop autonomous agents that can interact with the world with the help of external API and do things for you like booking your tickets deciding you schedule, planning and execution you wedding, figuring out code deployment and al lot more.

This means that the process of programming and scripting will be completely abstracted away and the only thing that remains for humans to do is problem solving and prompting the ideas in an expressive way.

## Wild thought?

Eventually CS as a field will become a niche like every other engineering field with limited applicability. Models will become so powerful that only a simple prompt will be enough for it to do anything you need to get done. 
