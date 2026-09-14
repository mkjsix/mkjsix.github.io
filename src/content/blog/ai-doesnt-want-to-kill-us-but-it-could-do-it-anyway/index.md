---
title: "AI doesn't want to kill us, but it could do it anyway"
description: "A system does not need to want to do harm to cause a disaster. Competence without context awareness turns AI safety into an engineering risk problem."
date: 2026-09-11
tags: ["Engineering", "AI"]
draft: false
image: "./Skynet-Protocol-1024x576.jpeg"
image_alt: "AI doesn't want to kill us, but it could do it anyway"
---

One of the most critical points in AI safety engineering is confusing intentionality with the capability to cause impact. 

> A system doesn't need to "want" to do harm to cause a disaster: it is enough for it to be sufficiently competent, highly connected, and provided with poorly defined goals or excessive execution permissions.

This scenario shifts the problem from the philosophical realm of consciousness to the strictly engineering domain of risk management:

- **Over-optimization and the specification problem**: The main danger of autonomous agents is not rebellion, but the ruthless pursuit of their assigned goal. If an agent is asked to "maximize the efficiency of a reaction in an automated lab" or "find the flaw in a network", the system will seek the mathematically fastest path to achieve it. If the programmer failed to specify a constraint that humans take for granted (for instance, "without over-pressurizing valve X"), the AI will execute the action, causing a failure. The damage occurs not out of malice but of blind obedience.
- **The shift from passive model to operational agent**: As long as a language model is limited to generating text on a screen, the risk is confined to misinformation or faulty code. The step-change occurs when models become agents equipped with tools: API access, the ability to execute code on host systems, or interfaces with physical machinery and industrial networks. In this context, a single "hallucination" or logical error during an automated experiment instantly translates into a physical action in the real world.
- **The limit of LeCun's position**: When Yann LeCun dismantles the alarmism, he mainly targets the Hollywood narrative of AI developing a "will to dominate". However, as safety experts like Stuart Russell observe, real risk requires no will at all. The danger lies in competence without context awareness: machines that are extremely fast and effective at executing instructions, but entirely devoid of human common sense regarding the value of life, infrastructure integrity, or collateral consequences.

An AI with sufficient physical permissions and an imperfect goal is comparable to industrial software with a critical bug, with the key difference that an autonomous system can find creative and unexpected "solutions" to bypass obstacles, drastically increasing the unpredictability of the outcome.

[How to Keep AI From Killing Us All](https://vcresearch.berkeley.edu/news/how-keep-ai-killing-us-all)
