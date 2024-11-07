---
title: "DEVLOG #1"
slug: devlog-1
date: 2024-11-07
author: Shubham Rasal
tags:
  - programming
  - map
  - nextjs
  - supabase
---

I have always wanted to write technical blogs but I was lazy. But then I recently say few indie hackers publishing what they do on a weekly basis. I felt this writing format is something that I can try and hopefully stick to in the long run.

Since this is the first devlog of my currently active projects, it will be a long one.

## 1. ApnaHood

This is a project I had started a couple of months back with my friend [Prathamesh](https://x.com/SirdesaiEXE) and Miheer when we were hanging out at a cool Momo place. We wanted to know cool and hidden spots around a new city which the locals knew. In our case, we knew all the nice and hidden places around our city, Belgaum, but we wanted a way to let others know about it. 

This project is still under active development, since we have taken it up as a learning experience as well. I use it as a testbed for all the new tech that comes along. For example, if you check the recent commits, you will find out that I have added drizzle ORM support just because I want to learn about ORMs and db migrations.

## 2. General Inference Engine

This is a still in stealth mode since we are in the process of developing the pipeline. In the ideal case when it is built, the project can be used for literally any type of media based inference.

## 3. Stock Prediction using News

I know this might sound like a cliche project, but I still ended up learning quite a few interesting things.

The approach I took was to take a bunch of news articles (2018-2021) and performed two major extraction operations on it -

1. **Sentiment Extraction** - This is pretty much a standard approach. I did it using a fine-tuned model called FinBERT that is trained on financial news and can understand that lingo.
2. **LLM based Feature Extraction** - This was a rather interesting experiment. I did some prompt engineering and got the final prompt which was something like this - 
```
"Analyze the following financial news headline: {news}."

    Based on this headline, extract the following structured information as a tuple, choosing each feature from its predefined categories:

    1. **Company**: Identify the primary company mentioned"
    2. **Event**: Identify the main event or action, choosing from: "Merger," "New Product," "Profit/Loss Announcement," "Partnership/Collaboration," "Policy Change."
    3. **Reason**: Identify the reason for the event, choosing from: "Market Demand," "Regulatory Requirement," "Internal Strategy," "External Competition," "Economic Conditions."
    4. **Verdict**: Assess the likely impact on stock, choosing from: "UP," "DOWN," "NEUTRAL."

    NOTE: give categories from the categories provided in the prompt. DO NOT EXPLAIN THE CATEGORIES or output. Also, try to reason out the answer based on the headline see if the news might have any impact on the stock price of the company mentioned in the headline. DO NOT OUTPUT ANYTHING ELSE OTHER THEN THE TUPLE. DO NOT SAY - " Here's the structured information extracted from the headlines:"

    **Return the information in tuple format** only and nothing else using the example format below:

    Example format:
    `("Company", "Event", "Reason", "Verdict")`
```

Using the Gemini free LLM API, I was able to get the features for 887 news articles. This helped in finding the best predictors of stock movement and what magnitude will it move with.

