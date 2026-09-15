---
title: "MQTT and MongoDB"
description: "A new RESTHeart beta module connects MQTT messages to MongoDB, REST services, Server-Sent Events and custom plugins."
date: 2026-09-15
tags: ["Engineering", "MQTT", "MongoDB"]
draft: false
image: "./MQTT_arch.png"
image_alt: "Architecture diagram showing MQTT messages flowing through RESTHeart to MongoDB, REST services, Server-Sent Events and custom plugins"
---

Most MQTT integrations end at the broker connection. The message arrives, a service consumes it, and another component takes care of storage. When the application also needs a REST API, live updates or custom processing, the architecture grows around the original subscription.

I faced this problem in a real project.

The requirement was specific: receive messages from an MQTT broker, store them in MongoDB and make the same data available to application clients. Some consumers needed a live stream. Others needed the latest known value through HTTP. The integration also had to leave room for custom logic.

I could have built a service dedicated to that project. Instead, I decided to bring the capability into RESTHeart.

The result is a new MQTT module, currently available as a beta.

The module connects an MQTT broker directly to RESTHeart's existing application model. Messages can flow through the same router to MongoDB, REST services, Server-Sent Events and custom plugins.

That combination is unusual. I have rarely seen MQTT and MongoDB integrated natively in the same product, with the broker message flowing directly into the database and the surrounding application interfaces.

## One message, different responsibilities

The module gives each consumer its own path.

An SSE client can receive live messages from a topic. A REST client can request the latest cached value. The MongoDB writer can persist the stream in batches. A custom RESTHeart plugin can subscribe through the router and apply application-specific logic.

These consumers do not have the same requirements.

A live dashboard usually needs current data. Holding an old backlog for a disconnected browser has little value. Persistence has a different responsibility. It needs retry behaviour, durable storage and a clear policy for messages that cannot be written.

The MQTT module keeps these decisions separate while allowing the consumers to share the same connection and routing layer.

## MongoDB is part of the message path

MongoDB persistence is built into the module through `mqtt-mongo-writer`.

The writer stores messages in configurable databases and collections. A bounded buffer absorbs traffic peaks and short database interruptions. Messages are drained in batches, with configurable retries and a dead-letter file for batches that still fail.

The broker acknowledgement follows the storage result. With QoS 1 or 2, a persistent MQTT session and a stable client ID, the broker keeps responsibility for a message until the durable consumer has taken it.

This gives the MongoDB path at-least-once delivery.

That guarantee also requires a clear approach to duplicates. A redelivered message may reach the writer again after a restart or reconnect. The default strategy keeps every delivery with a generated identifier. When the publisher includes a stable identifier in the payload, the `payload-field` strategy can use it for an upsert and make redeliveries converge on the same document.

The identity has to come with the message. A timestamp assigned when RESTHeart receives the message changes on every delivery and cannot identify a redelivery reliably.

## REST and live streaming use the same data

The module exposes MQTT data through two HTTP-oriented services.

The **SSE service** keeps a connection open and sends messages as they arrive. It supports topic filters, payload envelopes, MQTT 5 properties and optional processing stages for filtering, mapping, throttling and window aggregation.

The **REST service** reads the last value held in the router cache. This is useful for applications that need the current state of a device or sensor and do not need a continuous stream.

MQTT payloads are bytes. They may contain JSON, protobuf, compressed data or an image. The module preserves this distinction when it exposes data through REST and SSE by identifying whether the payload is text or base64. MQTT 5 publish properties are preserved when the client uses MQTT 5.

These details become important as soon as the message is something more than a UTF-8 string.

## Authorization happens before subscription

Topic authorization is applied at the HTTP boundary.

A client may have permission to use RESTHeart and still have no permission to subscribe to a particular MQTT filter. The topic authorizer checks whether the requested filter is covered by the account's ACL before the request reaches the MQTT service.

The check understands MQTT wildcards and filter containment. A permission for `sensors/+` does not grant access to `sensors/#`, because the latter includes deeper topic levels.

The authorizer fails closed when no matching rule exists. An endpoint without an explicit topic permission remains inaccessible.

## From one project to a product capability

This beta began with one project's requirements. The implementation exposed a broader need: applications increasingly receive operational data through MQTT and need to connect that data to storage, APIs and application logic.

RESTHeart already provides the pieces around those responsibilities. The MQTT module connects them to the broker.

The result is a single product path from MQTT ingestion to MongoDB persistence, REST access, live delivery and custom processing. Each consumer can follow its own delivery policy, while the module keeps the integration visible and configurable.

The MQTT module is available in beta in the RESTHeart repository:

[https://github.com/SoftInstigate/restheart/tree/master/mqtt](https://github.com/SoftInstigate/restheart/tree/master/mqtt)

The repository includes a Docker demo, configuration examples and a tutorial covering live SSE messages, REST polling, MongoDB persistence and custom plugins.
