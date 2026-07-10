---
title: "Relational vs Document Databases: a Domain-Driven Perspective"
description: "The debate between relational and document databases is often treated as a technology choice. Underneath, it is a modeling choice. What is the natural shape of the domain?"
date: 2026-07-10
tags: ["Databases"]
draft: false
image: "./relational_document.png"
image_alt: "A diagram showing the difference between a relational model and a document model"
---

Over the last decade, MongoDB has been my default database. That default shaped a strong point of view: a large share of application domains can be modeled directly with documents, in a simple way, without an ORM.

The debate between relational and document databases gets treated as a technology choice: SQL versus NoSQL, MongoDB versus PostgreSQL. Underneath, it is a modeling choice.

> **What is the natural shape of the domain?**

## The natural shape of most application domains

My view is that the natural representation of most application domains is hierarchical rather than relational.

When we look at modern software systems, the unit that applications manipulate is almost always an aggregate.

An order is a single object: customer information, shipping details, order lines, payments, totals.

A customer carries addresses, preferences, contacts and settings as one unit.

The same applies to projects, invoices, users, tickets, medical records, product catalogs, conversations, IoT devices and configuration objects.

Modern APIs expose these concepts exactly this way.

```
GET /orders/123
```

returns

```json
{
  "customer": { ... },
  "shippingAddress": { ... },
  "lines": [ ... ],
  "payments": [ ... ]
}
```

Nobody expects an API to return ten normalized tables.

This observation is independent from the database technology. The application itself already thinks in terms of documents.

## Why relational databases became dominant

Relational databases were designed in a very different technological context.

- Disk space was expensive.
- Memory was scarce.
- Network communication was negligible.
- Duplicating data had a real economic cost.

Normalization was an excellent solution to minimize redundancy while preserving consistency. Those design principles are still mathematically elegant.

Modern systems operate under almost opposite constraints.

- Storage is inexpensive.
- CPU resources are abundant.
- Network latency is often more expensive than disk space.
- Applications exchange JSON documents.

The trade-offs around normalization have shifted. Today, duplicating a few kilobytes is often significantly cheaper than reconstructing an aggregate through multiple joins, ORM mappings and network round trips.

## The hidden cost of relational systems

Relational databases are often combined with an ORM.

1. The domain is modeled as an object graph.
2. Persistence is modeled as normalized tables.

The ORM becomes responsible for translating between the two.

Combining an ORM with a relational database adds an additional modeling dimension. The development team designs the business domain and, alongside it, an efficient mapping between two fundamentally different representations.

As systems evolve, this mapping frequently becomes the most fragile part of the architecture.

Developers start fighting:

* N+1 queries
* lazy versus eager loading
* fetch graphs
* projection DTOs
* cache invalidation
* query optimization

Eventually many teams bypass the ORM and write SQL manually for critical queries. The object model and the relational model have drifted apart.

## The document model removes an entire layer

A document database approaches the problem differently.

The persistence model is intentionally designed to resemble the application model.

The aggregate that the application manipulates is the same aggregate stored in the database. There is no need to reconstruct it through joins, no object-relational impedance mismatch, and usually no need for a sophisticated ORM.

The analysis remains almost entirely focused on the business domain.

Relational modeling starts from a persistence question:

> How should these tables be joined?

Document modeling starts from a domain question:

> What belongs to the same consistency boundary?

## Aggregates and the impedance mismatch

Domain-Driven Design gives this idea a name: the aggregate, a cluster of objects treated as a single unit for data changes, with one object acting as the aggregate root and enforcing the invariants of the whole. The order example above is a textbook aggregate: the root is the order, and the shipping address, lines and payments only make sense as part of it.

The mismatch between the object model and the relational model also has a name: **the object-relational impedance mismatch**. Objects form graphs with identity and behavior. Relational tables form sets of rows connected by foreign keys. An ORM exists to translate between the two, and every cost described earlier, N+1 queries, fetch graphs, cache invalidation, follows from that translation.

The aggregate is a domain concept, independent from any specific database. What a document database offers is a boundary in the persistence layer that lines up with the boundary already defined by the aggregate.

## Complexity does not disappear

It is important not to oversimplify.

Document databases shift where complexity lives, into:

* aggregate boundaries
* embedding versus references
* controlled duplication
* schema evolution

These decisions are usually expressed in the language of the business domain. The relational approach adds a second analysis concerned with persistence itself.

## Two different cognitive models

This distinction is often underestimated.

With a document database the designer mainly reasons about one dimension:

> What does the business concept look like?

With a relational database plus an ORM the designer reasons simultaneously about two dimensions:

* what the business concept looks like
* how that concept should be decomposed into normalized relations

Maintaining both representations over time introduces additional cognitive overhead.

## When joins represent the domain

Joins can express genuine relationships, or simply reconstruct an aggregate that has been artificially fragmented.

Suppose every request for an order requires joining:

* Orders
* OrderLines
* ShippingAddress
* BillingAddress
* Payments
* Taxes

One may reasonably ask: are these truly independent entities, or are we rebuilding the object that the business already considers a single order?

In many applications, joins reconstruct what the persistence model has fragmented.

## When joins are the natural solution

There are, however, domains where joins express the domain itself.

Imagine an analytical system where a user asks:

> Show all customers who purchased products supplied by vendors that also serve customers in another region during the last three years.

This query has no obvious aggregate root. It combines independent entities in ways that may never have been anticipated during system design.

The relational model allows independent datasets to remain independent while enabling arbitrary composition later. This is precisely what the relational model was designed to do.

## The real strength of relational databases

In my opinion, the relational model is at its best when the application is composed of genuinely independent entities whose future combinations cannot be predicted.

The value of the system lies in discovering relationships between independent entities.

Typical examples include:

* business intelligence
* operational analytics
* reporting platforms
* data exploration
* systems serving many independent consumers with different questions

These systems optimize for queries nobody has written yet.

## The real strength of document databases

Document databases excel in a different scenario.

The domain already has stable aggregates. The application repeatedly loads and updates those aggregates as a whole. The persistence model naturally follows the business model.

Examples include:

* SaaS applications
* REST APIs
* product catalogs
* content management systems
* configuration platforms
* workflow systems
* user profiles
* IoT device management
* conversational applications

In these systems the document is the domain itself.

## A practical rule

The technology question, MongoDB or PostgreSQL, is secondary. The useful question is:

> Is my domain primarily aggregate-centric or relation-centric?

If the application mostly manipulates well-defined aggregates, a document model often provides a simpler and more direct architecture.

If the application's value comes from combining independent entities through unpredictable relationships, the relational model remains the better fit.

Each approach optimizes for a different kind of complexity.

The mistake is assuming that every business domain is naturally relational simply because relational databases have dominated software engineering for the last forty years. Most operational applications are naturally hierarchical.

Relational databases dominated because storage was expensive and networks were unreliable. That history explains the choice more than the nature of the domains it was applied to.
