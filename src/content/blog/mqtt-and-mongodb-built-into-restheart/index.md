---
title: "MQTT and MongoDB"
description: "An experimental RESTHeart module that subscribes to an MQTT broker and sends each message to MongoDB, REST, Server-Sent Events and custom plugins, with a delivery policy chosen per consumer."
date: 2026-09-15
tags: ["Engineering", "MQTT", "MongoDB"]
draft: false
image: "./MQTT_arch.png"
image_alt: "Architecture diagram showing MQTT messages flowing through RESTHeart to MongoDB, REST services, Server-Sent Events and custom plugins"
---

A client project needed data from an MQTT broker in three places. A dashboard showed sensor values as they arrived, other clients asked for the latest value over HTTP, and every message had to be stored in MongoDB.

The usual answer is a small service that subscribes to the broker, writes to the database and exposes an endpoint. When someone later asks for a live stream, a second service connects to the same broker, with its own authentication and its own way of decoding payloads.

RESTHeart already provides authentication, ACLs, the MongoDB API, SSE and a plugin model. The missing piece was the broker connection, so I added it as a RESTHeart module. It is now available as an experimental beta.

## Two kinds of consumer

The design question that came back most often was how each consumer should behave when something goes wrong.

A browser connected over SSE wants the current value. If it falls behind, sending it the backlog is useless. On the live paths the module drops messages and counts every drop: a global rate limit on live listeners, a bounded queue per SSE connection, and an optional throttle stage.

The MongoDB writer needs the opposite. A lost message is a hole in the stored data, and it usually surfaces only when someone queries that period. This path needs backpressure, retries and a dead-letter file.

Both read from the same broker connection through a router that assigns the delivery policy per listener. A plugin registers a live listener with `subscribe` or a durable one with `subscribeDurable`. The rate limit applies to live listeners only, so a value chosen to protect a dashboard has no effect on what reaches MongoDB.

## The first version lost messages

In the first design the client acknowledged each message to the broker as soon as it received it. That discarded the broker's redelivery guarantee before anything had been stored, and a crash between receipt and write lost the message whatever QoS was configured. The module was at-most-once.

The current version acknowledges a message only after the writer has stored it in MongoDB or written it to the dead-letter file. With QoS 1 or 2, `clean-session: false` and a stable client ID, a message that was never stored is still owed by the broker and is redelivered to the next connection that resumes the session. The client ID defaults to a value derived from the RESTHeart instance name, which stays the same across restarts.

Startup order mattered as well. A broker redelivers what a resumed session owes as soon as it accepts the connection, and a consumer registered a moment later misses those messages. A dedicated `mqtt-connector` component opens the broker connection only after every consumer, the MongoDB writer included, is registered.

## Duplicates and identity

At-least-once delivery trades lost messages for duplicates. After a crash or a reconnection the same reading can reach the writer twice.

The default `auto` strategy stores each delivery as a new document. The `payload-field` strategy reads an identifier from the payload and uses it for an upsert, so a redelivery updates the document written the first time. The same applies when several RESTHeart nodes receive the same message, which on MQTT 3.1.1 happens to every node.

An earlier version offered a third strategy that hashed the topic together with the reception timestamp. The timestamp changes at every delivery, the hash changed with it, and the strategy could never recognise a redelivery. I removed it: an option that looks like deduplication and does not deduplicate is worse than no option. A stable identity has to come from the publisher.

## A slow database must not stop the stream

The writer's buffer applies backpressure by default: when it is full, the incoming message waits for space. The first implementation had no limit on that wait, and that created a coupling that was hard to see.

A waiting message has not been acknowledged. When enough of them accumulate, the broker's in-flight window fills and the broker stops delivering to this client, including the messages meant for SSE clients that never touch MongoDB. A database problem became a dashboard outage.

The wait is now bounded by `buffer.max-wait-ms`, 30 seconds by default. Past that, the message is dropped, counted in `mqtt_buffer_dropped` and acknowledged. The buffer absorbs a MongoDB restart of a few seconds. A longer outage needs a correctly sized replica set, and a bigger queue in memory would only postpone the loss. Setting the value to 0 restores the unbounded wait for anyone who accepts the coupling.

## Details that appear with real payloads

MQTT payloads are bytes. Both HTTP services report whether a payload is text or base64, and MongoDB stores it as a string or as binary data. On MQTT 5 the publish properties are kept, with user properties as an ordered list, since MQTT 5 allows repeated names.

A few fields showed their real meaning only during tests against Mosquitto. The `retain` flag on a delivered message means the broker sent it because the subscription was new, so a retained value published days earlier arrives with the current reception time. The message expiry interval arrives already decremented by the broker: 120 seconds at publish time came back as 99 after a 20-second wait. The writer stores the value as received and adds an `expiresAt` date computed from it.

Broker subscriptions needed the same kind of check. Mosquitto delivers one copy per matching subscription, so a router subscription on `sensors/#` plus an SSE client on `sensors/temp` produced two copies of every message and two MongoDB documents. The router now subscribes on the broker only to filters that no other registered filter already covers.

## Topic permissions

A user authenticated in RESTHeart may still have no right to read a given topic. The topic authorizer checks the requested filter against the account's ACL before the request reaches the MQTT services, and denies it when no rule matches.

The check is based on filter containment. A permission on `sensors/+` covers `sensors/room1` and leaves out `sensors/#`, which also matches `sensors/room1/temperature`.

The authorizer is enabled by default, while the HTTP endpoints stay off until configured. The first endpoint an operator turns on is already protected.

## Trying it

The module is installed separately from RESTHeart. It depends on the HiveMQ MQTT client, which brings RxJava and several Netty modules with it, and I preferred to keep those libraries out of installations that never use MQTT. It requires a RESTHeart build from `master`, because per-topic authorization on the SSE endpoint depends on a core change that no release includes yet. Configuration keys and the stored document format may still change, so it is not meant for production use.

[https://github.com/SoftInstigate/restheart/tree/master/mqtt](https://github.com/SoftInstigate/restheart/tree/master/mqtt)

The README documents every configuration key and the traps we found while testing. The tutorial walks through a Docker environment in four parts: a live SSE stream, REST polling, MongoDB persistence with the database stopped on purpose, and a custom plugin. Feedback at this stage can still change the design, so issues on GitHub are welcome.