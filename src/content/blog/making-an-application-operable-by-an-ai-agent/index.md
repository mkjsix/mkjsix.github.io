---
title: "Making an application operable by an AI agent"
description: "How RESTHeart can expose an application's existing APIs, schemas, permissions and business rules to an AI agent without a separate integration for every feature."
date: 2026-09-03
tags: ["AI", "AI Agent", "MongoDB", "API", "MCP"]
draft: false
image: "./cover_image.webp"
image_alt: "An AI agent operating an application through RESTHeart"
---

A company that wants an AI agent to operate its own application, an inventory and billing system with warehouse, orders and invoices, runs into a cost that grows with every new feature: someone has to decide what the agent can read, what it can write, under what constraints, and build a dedicated integration to tell it.

The cost is not writing the first integration. It is maintaining one for every endpoint, every time the application changes.

Issues [#615](https://github.com/SoftInstigate/restheart/issues/615) and [#616](https://github.com/SoftInstigate/restheart/issues/616) in the RESTHeart repository address this problem at the root: any application built on RESTHeart becomes operable by an agent automatically, as long as its resources are described using tools RESTHeart already provides, including JSON Schema, aggregations and ACLs. There is no dedicated AI integration to write for each feature.

## The advantage for developers

A plugin becomes visible to an agent by implementing a single interface, `McpAware`. There is no need to build AI-specific endpoints or keep them in sync with the real API. The description an agent receives is derived from the same schema, the same configuration and the same permissions already in use for the application.

When the API changes, the description the agent sees changes with it, since it comes from the same source.

The same applies to business logic already written. A rule like “warehouse shortage risk”, stock below the level of orders received in a comparable period, remains a MongoDB aggregation curated by whoever understands the domain. The agent discovers it, reads exactly what it computes and invokes it with the right parameters. Nobody rewrites that logic to make it understandable to a language model.

## The advantage for the business

Security is not a layer added for the AI. It is the one already configured.

Filtering what an agent can see and do by user runs through the same authorizers and the same ACLs that already govern human access to the application. There is no parallel policy to define, test and keep aligned with the real one.

An agent's write is never executed blind. Before a write request reaches the database, it is validated against the same JSON Schema the application already applies to any other client. A malformed value proposed by the agent gets flagged before it happens, before it can corrupt a document.

The practical result is an application with clean schemas and well-encapsulated business rules that becomes operable by an agent through the conventions RESTHeart already follows, with no additional investment in AI integration.

## How it works in detail

The MCP server introduced in [#615](https://github.com/SoftInstigate/restheart/issues/615) exposes exactly two tools: `list_apis` to discover available resources and `how_to_call` to compose a request against a specific resource.

A catalog with one tool per collection or aggregation degrades an agent's ability to pick the right tool and burns context for no reason. The tool count stays fixed at two regardless of how many resources a deployment exposes. The catalog returned by `list_apis` is filterable with `query`, `kind` and paging from the first version.

`how_to_call` validates arguments and body against the resource's declarations, parameters and JSON Schema before returning the request descriptor: transport, URL, headers and body. It composes the request, it does not execute it. The agent picks whichever HTTP or WebSocket client fits its own environment.

`McpAware` has only default methods. A plugin can implement it without overriding anything and still get a working description, built from a code-baked default merged with the operator's configuration. Plugins with dynamic resources, like `MongoService` or `GraphQLService`, override `describeMcp()` to compute resources at runtime, filtered by the authenticated principal.

Issue [#616](https://github.com/SoftInstigate/restheart/issues/616) applies this same framework to MongoDB and GraphQL. Collections, aggregations, change streams and GraphQL apps become MCP resources by reading an `mcp` block that lives in collection metadata documents, in the `aggrs` and `streams` arrays, and in `gql-apps` documents.

`$var` references inside an aggregation pipeline are extracted automatically. The operator only declares parameter types. Which actions, query, create, update, delete and show up in the catalog reflects the principal's actual permissions on that collection.

The mechanism has been verified end to end on a real case, `/ping` via MCP. Issue #616 is still needed to extend that verification to a real application domain with actual MongoDB collections, but the architecture, schema-driven with pre-flight validation, is already written and tested in the base framework.
