---
title: "DEVLOG #2"
slug: devlog-2
date: 2024-11-07
author: Shubham Rasal
tags:
  - programming
  - devlog
  - ai
  - systems
---
Since this is the first devlog of my currently active projects, it will be a long one.
In this edition of devlog, we will be looking at the updates mainly from ApnaHood and my college major project.

## 1. ApnaHood

If you have not read the previous edition of this devlog, ApnaHood as a map-based app where you can leave anonymous messages that can be seen by other users. 

#### User Feedback

One important things happened between the last update and this. We decided to get feedback from the users. This meant that we cannot do what we want to do, but will have to listen to the users.

Our hypothesis for the website was that users will use it for all sorts of things including - marking special and hidden spots, putting some secret messages, etc. But none of this happened.

Among other reasons, the most prominent reason was that the UI was not intuitive. This meant that the user would land on the page and did not instantly know what to do. We tried to bandage this situation by adding a pop-up which explains what actions you can take on the site, but this made us realize that the UX and the user journey is terrible. 

### Plans for Improvement

The idea is to address the user feedback and improving the UX of the site. First thing we changed was to make the map 3D. This makes it much more interesting and appealing. 

Apart from this change, we are planning to add game elements into the app and center the whole concept around it. Starting with "Quests", we will be adding the functionality to add limited period quest that you can complete to get points in the site, redeemable for real cash. 

## 2. Major Project

So me and my team are building a Agriculture focused AI chat-bot that can be used by farmers for resolving all their query. After intensive research, talking to farmers and agriculture specialists, we came up with the following architecture - 

**![Architecture](https://lh7-rt.googleusercontent.com/slidesz/AGV_vUcn-9e3PTvmliycItoJslBepymWquIWlNBjQ8UkO0U47OjFjrmsh719Z486LG7rDhiaaV7_le5VGyDqjomG4o-U2IijWszDsO_XtC0mPum3dIQcrr30uN619YQoIiG3xvYBBBPtbA=s2048?key=sVcrpFVBvwnfG94cy3g3ZRe1)**

Each module is there for a purpose. Which one to choose for a particular query will be the job of the reasoning engine which is just a fancy wrapper term for LLM function calling ;).

#### Chat Module

For now, I am using the OpenAI realtime API for the chat functionality which is surprisingly good at Indian languages. Pairing it up with open-whisper, I am able to get a real-time native language voice interaction. 

#### Schemes Module

Apart from the chat module, I am building a RAG system for schemes and subsidies offered by the government for various types of crops. This information is often place in obscure locations on inaccessible government and state websites.

**![](https://lh7-rt.googleusercontent.com/slidesz/AGV_vUftonqjwQFPdjsgdS-I6l76YCppVhtQUf1s54OupTXGacHA5cGyUVxEdZZ8sdjzxhYLZDkAclKD9CDfa-Qj4QhYpqwaQWsiyKgW8uIXrSivVMj-4_0MpJhox9e_MieXL-FatoJ23w=s2048?key=sVcrpFVBvwnfG94cy3g3ZRe1)**

I am using Supabase for this functionality. I have two edge functions - embed and search. 
embed converts the scheme text into embeddings and stores it in the database with the help of a postgres extension - pg_vector. search is an edge function for semantic search using cosine similarity and returns the top-k matching results for a given query.






