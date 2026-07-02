---
# ============================================================
# CURRICULUM VITAE — STRUCTURED METADATA
# Optimized for ATS parsing and AI agent interpretation
# ============================================================

document_type: curriculum_vitae
version: "2026-06"
language: en

# --- IDENTITY ---
name: Maurizio Turatti
title: Architectural Decision-Maker for Complex Technical Challenges
location: Italy
email: info@maurizioturatti.com
website: https://maurizioturatti.com
linkedin: https://www.linkedin.com/in/maurizioturatti
github: https://github.com/mkjsix

# --- POSITIONING ---
target_roles:
  - CTO
  - Head of Engineering
  - VP Engineering
  - Head of Delivery
  - Principal Software Architect
  - Technical Advisor
  - Architecture Reviewer

engagement_model: employed or independent
availability: open to fulltime, fractional, and advisory engagements

# --- EXPERIENCE SUMMARY ---
years_of_experience: 25
seniority: principal

# --- SKILLS TAXONOMY ---
skills:
  strategy_and_leadership:
    - CTO / Technical Leadership
    - Architecture Review
    - Technical Due Diligence
    - Stakeholder Management
    - Business Development
    - Pre-sales
    - Technical Strategy
  architecture:
    - Distributed Systems
    - Microservices
    - Cloud-Native
    - Service-Oriented Architecture (SOA)
    - Enterprise Application Integration (EAI)
    - Domain-Driven Design (DDD)
    - CQRS
    - API Design
    - Event-Driven Architecture
  backend:
    - Java
    - Node.js
    - GraalVM
    - REST
    - WebSocket
    - Server-Sent Events (SSE)
    - OpenAPI
  data:
    - MongoDB
    - PostgreSQL
    - Relational and NoSQL
    - Document Design
    - Schema Migration
  cloud:
    - AWS ECS
    - AWS Lambda
    - AWS API Gateway
    - AWS CloudFront
    - AWS ALB
    - AWS S3
    - AWS Route 53
  platform:
    - Docker
    - CI/CD
    - Continuous Delivery
    - Observability
    - Security hardening
    - Performance optimization
  frontend:
    - Angular
    - Headless CMS
    - Static Site Generation
    - Server-Side Rendering
  ai:
    - Large Language Model (LLM) integration
    - Retrieval-Augmented Generation (RAG)
    - Agentic Workflows
    - Model Context Protocol (MCP)
    - AI approached as architecture and integration problems

# --- EDUCATION ---
education:
  - degree: MSc Information Science
    institution: Università degli Studi di Milano
    years: "1993-1999"

# --- LANGUAGES ---
languages:
  - language: Italian
    level: Native
  - language: English
    level: Professional Working Proficiency

# --- PUBLICATIONS ---
publications:
  - title: Instant Apache Maven Starter
    publisher: Packt Publishing
    year: 2013
  - title: Visualisation of Geographic Information in a Dynamic 3-Dimensional Environment
    year: 1999

# --- OPEN SOURCE ---
open_source:
  - name: RESTHeart
    description: Agent-ready backend for MongoDB
    url: https://github.com/SoftInstigate/restheart
    stack: [Java, GraalVM, MongoDB]
    years_in_production: "10+"
  - name: Facet
    description: Data-driven web framework, turn APIs into HTML without code
    url: https://github.com/SoftInstigate/facet
  - name: Ermes Mail
    description: Async e-mail library and CLI for Java
    url: https://github.com/SoftInstigate/ermes-mail

# --- GDPR ---
gdpr_consent: >
  I hereby consent to the processing of my personal data contained in
  this document for the purposes of recruitment and selection, in
  accordance with Regulation (EU) 2016/679 (GDPR).
---

# Maurizio Turatti

**Software architecture and technical leadership for products that need to move fast.**
Italy | info@maurizioturatti.com |
https://maurizioturatti.com | https://www.linkedin.com/in/maurizioturatti | https://github.com/mkjsix

---

## Professional Summary

25+ years translating business goals into architectural decisions. Co-founder of SoftInstigate, where I design, build, and operate production systems for enterprise clients. From enterprise integration at Sun Microsystems to cloud platforms and AI-augmented systems, my decisions come from operating real software in production.

---

## Introduction

My career has always involved owning both sides of a client engagement: the technical solution and the commercial relationship. I bring in the work, design the solution, deliver it, and keep it running, across enterprise integration, cloud platforms, and product engineering.

---

## Skills

**Strategy and Leadership:** CTO / Technical Leadership, Architecture Review, Technical Due Diligence, Stakeholder Management, Business Development

**Architecture:** Distributed Systems, Microservices, Cloud-Native, SOA, EAI, DDD, CQRS (Command Query Responsibility Segregation), API Design

**Backend:** Java, Node.js, GraalVM, REST, WebSocket, Server-Sent Events (SSE), OpenAPI

**Data:** MongoDB, PostgreSQL, Relational and NoSQL, Document Design, Schema Migration, Event-Driven Architecture

**Cloud (AWS):** ECS, Lambda, API Gateway, CloudFront, ALB, S3, Route 53

**Platform:** Docker, CI/CD, Continuous Delivery, Observability, Security, Performance optimization

**Frontend:** Angular, Headless CMS, Static Site Generation, Server-Side Rendering

**AI:** Large Language Model (LLM) integration, Retrieval-Augmented Generation (RAG), Agentic Workflows, Model Context Protocol (MCP), approached as architecture and integration problems

---

## Selected work

**Reducing Integration Risk**
Designed a real-time traffic platform integrating 6+ national sources. We prioritized event ordering over throughput, which preserved data integrity across 18 microservices. 10,000+ events/day, 99.9% uptime, in production since 2017.

**Taming Legacy Complexity**
Led a retail backend modernization across 2,600+ stores and 9,500+ terminals. The decision to separate read and write paths, instead of replacing the data layer, reduced query time 216x and exceeded throughput targets by 79%.

**Building for Longevity**
RESTHeart was designed to be simple on purpose: one component, fewer things that can go wrong. 10+ years in production, 2M+ downloads. Adopted by Unisys, Northrop Grumman, and Crownpeak.

**Scaling Without Over-Engineering**
Architectural discovery for a public-sector platform handling 400K+ entities and 9M+ API calls/hour. The bottleneck turned out to be in the caching strategy, which meant we could avoid a costly re-platforming.

**Coordinating Across Constraints**
Led architecture for a luxury brand's e-commerce platform across teams in Berlin, Geneva, and Shanghai. Getting three teams in three countries to agree on how the system should be structured was mostly an alignment problem, with technology coming second.

**AI as an Architecture Decision**
Good architecture becomes more valuable when AI enters the picture, because the quality of the underlying structure determines how much value AI can deliver. Every engagement combines this with direct experience in production.

---

## Experience

### Co-Founder | Technical Advisor
**SoftInstigate** · Italy
09/2014 – present

Responsible for engineering delivery, DevOps automation, infrastructure, and software quality across all client projects and internal products. Client relationships, business development, and commercial partnerships, while contributing to the technical architecture of the company's open-source and commercial SaaS platforms.

**How I work**
- I own the full decision chain, from design to delivery to operations. Shortcuts taken during design come back to me during maintenance
- Simplicity is a deliberate choice. RESTHeart was designed to have fewer things that can go wrong. 10+ years and 2M+ downloads later, that decision still holds
- When modernizing legacy systems, I look for the minimum architectural change that gets the required result. The most impressive solution is rarely the right one
- Infrastructure and tooling decisions are evaluated against a simple question: does this reduce the risk of the next deployment going wrong?

---

### Technical Architect
**AKQA** · Berlin, Germany
10/2013 – 08/2014

Three engineering teams across three countries, three regulatory contexts, and one shared platform. Making architectural decisions that each team could own independently while keeping the system coherent. Choosing where coupling was acceptable and where it would become a problem.

**Key decisions**
- Defined integration boundaries that let distributed teams deploy independently without breaking shared contracts
- Translated technical proposals into risk-structured decision frameworks for non-technical stakeholders during pre-sales
- Evaluated technology options by their long-term cost of ownership, not by feature lists

---

### Delivery Manager
**Sourcesense** · Milan, Italy
12/2011 – 05/2013

Helping clients evaluate open-source technologies for enterprise-critical systems. The wrong choice compounds over years. I led both the technical assessment and the commercial relationship, because the person recommending the architecture should be the one accountable for whether it works.

- Guided clients through technology adoption decisions where the wrong choice would compound over years. Recommendations were always grounded in operational reality, not vendor positioning
- Built and mentored a consulting team that could scope and deliver complex enterprise projects

---

### Senior Solutions Engineer
**Alfresco** · Italy
01/2010 – 12/2011

Helping enterprise clients decide whether to adopt open-source content management in place of established proprietary platforms. That kind of decision requires understanding both the technical architecture and how ready the organization is for change.

- Designed migration and integration paths that reduced the risk of open-source adoption for enterprise clients
- Built partner confidence through technical enablement grounded in real-world production scenarios

---

### Enterprise Integration Architect (Independent)
**Self Employed** · EMEA
07/2007 – 01/2010

Enterprise integration is a decision problem: which systems should talk to each other, how tightly should they be coupled, and where does shared state become a liability. I helped organizations across EMEA answer these questions before writing any integration code. The architecture of integration determines the operational cost for years.

- Designed integration architectures focused on where to place the boundaries of shared state, rather than which middleware to use
- Delivered training that taught teams to reason about integration trade-offs

---

### Senior Enterprise Integration Architect
**Sun Microsystems** · Italy / EMEA
08/2006 – 06/2007

Working with Fortune 500 clients on large-scale integration programs. The primary challenge was organizational alignment. Each integration point was a decision about ownership, contracts, and who would be responsible when something broke at 3am. The technology was the easy part.

- Architected integration programs where the critical decision was defining ownership boundaries between systems maintained by different teams
- Helped clients understand that SOA is an organizational commitment to interface contracts and operational discipline, more than a technology choice

---

### Enterprise Integration Architect
**SeeBeyond** · EMEA
09/2004 – 08/2006

Enterprise integration in large organizations is a risk management exercise. Each connection between systems creates a dependency that someone will have to maintain. I helped clients make informed decisions about which integrations were worth the long-term operational cost.

- Guided enterprise clients through integration decisions where the cost of reversing a bad choice would multiply over years
- Built integration architectures that prioritized operational simplicity over feature completeness

---

## Earlier Career

### Senior Java Consultant
**Iriscube Reply** · Milan, Italy
02/2004 – 08/2004

Built a distributed messaging system for Vodafone. One of my first lessons in how architectural decisions at the protocol level determine system behavior years later. We chose asynchronous message processing because the systems on each side had to evolve independently.

---

### Software Architect
**I-Side** · Italy
08/2001 – 01/2004

Core development team member for Tiscali Messenger, one of Italy's first large-scale consumer instant messaging platforms. Early exposure to the tension between real-time responsiveness and system stability, a problem I would encounter in different forms throughout my career.

---

### Researcher and Software Developer
**Artificial Intelligence Software** · Italy
04/1998 – 08/2001

Developed real-time 3D visualization algorithms for GIS terrain models and industrial applications. Working across heterogeneous platforms taught me that the hardest architectural decisions are often about constraints you cannot control: hardware, data formats, and performance budgets.

---

### Research Programmer
**Università degli Studi di Milano** · Milan, Italy
04/1997 – 11/1997

Research in computational geometry and machine learning, building probabilistic learning systems long before AI became mainstream. That early experience with uncertainty and approximation shaped how I think about architectural decisions: they are choices between different trade-offs.

---

## Education

**MSc Information Science**
Università degli Studi di Milano · 1993–1999

---

## Publications

- *Instant Apache Maven Starter* — Packt Publishing, 2013
- *Visualisation of Geographic Information in a Dynamic 3-Dimensional Environment* — 1999

---

## Teaching & Knowledge Transfer

Created and delivered technical courses and workshops for enterprise clients and partner networks across Italy and EMEA. Teaching forced me to articulate why certain decisions are made, which in turn sharpened my own judgment.

---

## Writing

Thinking out loud about architectural decisions, complexity, and what actually works in production.

- [The system is working. That is the problem.](https://maurizioturatti.com/writing/the-system-is-working) (Jun 2026)
- [Facet: A Different Approach to Web Development](https://medium.com/softinstigate-team/facet-a-different-approach-to-web-development-af884abe0b69) (Jan 2026)
- [MongoDB Deprecates Data API: How RESTHeart Can Help](https://medium.com/softinstigate-team/mongodb-deprecates-data-api-and-https-endpoints-how-restheart-can-help-58ea0c44660d) (Feb 2025)

---

## Open Source

- **RESTHeart**: Agent-ready backend for MongoDB (Java, GraalVM) — https://github.com/SoftInstigate/restheart
- **Facet**: Turn APIs into HTML without code — https://github.com/SoftInstigate/facet
- **Ermes Mail**: Async e-mail library for Java — https://github.com/SoftInstigate/ermes-mail

---

## Languages

- Italian: Native
- English: Professional Working Proficiency

---

*I hereby consent to the processing of my personal data contained in this document for the purposes of recruitment and selection, in accordance with Regulation (EU) 2016/679 (GDPR).*