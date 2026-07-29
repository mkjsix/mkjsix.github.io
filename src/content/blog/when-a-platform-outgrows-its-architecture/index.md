---
title: "When a Platform Outgrows Its Architecture"
description: "An Italian public sector platform was holding up under tenfold user growth. The infrastructure was not failing. The architecture was approaching limits nobody had measured."
date: 2026-07-29
tags: ["Engineering", "Consulting"]
draft: false
image: "./platform_outgrows_architecture.png"
image_alt: "A diagram showing a platform's architecture and its limits"
---

An Italian public sector body runs a digital platform used, by legal requirement, by hundreds of thousands of businesses. Within a few months the number of active users had grown tenfold, and daily transaction volume had grown with it. The infrastructure was holding up, but nobody could say with confidence for how much longer.

We were asked to answer a question that is easy to phrase and hard to answer honestly: where will this platform break as load keeps growing, and what needs to happen before it does.

## The starting point

The platform was already in production, run by a competent internal team: the systems responded, users worked. The client was aware that nobody internally had a complete picture of the architecture's state across the dimensions that matter once load rises: capacity, scalability, resilience, observability, data management. That awareness is why the client brought in an outside read, before growth turned that visibility gap into an operational problem.

Each internal team had a partial and accurate view of its own domain, by construction: whoever looks after a single application domain every day does not have the same vantage point as someone looking at the whole platform from the outside, without the pressure of resolving this week's incident. Nobody had the overview needed to say which intervention should come first and which one could wait, and closing exactly that gap is why the client brought us in.

The internal team used the tools it knew well, and used them correctly: index tuning, targeted fixes to the slowest queries, a well aimed adjustment whenever an endpoint slowed down. Each of these interventions solved the symptom in front of them. Taken on its own, none of them could show that the architecture as a whole was approaching a structural limit, and that was precisely the kind of signal the client suspected it could not pick up from the inside.

The outside view confirmed, with measured data, the instinct that had prompted the client to seek this review in the first place: a pattern repeating across several dimensions at once, one that signaled how much headroom was left before tactical interventions stopped being enough.

## The method

We ran the analysis on measured data. Application telemetry, database performance counters, query statistics collected over several days of real activity, matched against stress tests in a dedicated environment built to isolate system behavior under rising load.

Comparing these two data sets, real production traffic against isolated stress testing, was the central point of the work. The stress tests showed the database CPU at 75 percent while production stayed under 10 percent. That gap made it possible to separate, early on, a real capacity limit from a data access pattern problem, meaning queries that would keep getting worse as data volume grew regardless of how much CPU or RAM got added.

## What we found

The main bottleneck was not where the team expected it. The application layer was already scaled correctly and showed no saturation in any of the collected metrics. The real constraint sat in the database, in two distinct places.

The first was a technical logging write volume that had passed two billion records and kept growing with no data retention policy in place. The application log, originally meant for occasional troubleshooting, had become by size the single heaviest table in the whole infrastructure and the main source of contention on the database transaction log.

The second was a security check run synchronously on every single request, generating tens of thousands of queries per minute against an ever growing table. A regulatory constraint that looked rigid, once examined closely, turned out to be interpretable in a far cheaper way: it was enough to guarantee uniqueness of the check only within the token's validity window. That single distinction opened the door to an in memory cache that removes almost all database access for that operation.

There was also a less visible but equally concrete issue: a nightly index maintenance job that, moved to a time slot meant to avoid disrupting users, was silently competing with third party automated batches that transmitted data during that exact same window, finding the system in a degraded state.

There was, finally, a signal no further round of tuning could have fixed: on the platform's central table, index size already exceeded data size by nearly four times, a ratio required to support the way users searched the system and not reducible without losing functionality. As volume kept growing over the following months, that ratio was set to get worse in direct proportion, the point past which fine tuning indexes would stop making a difference, requiring a decision about how data was organized and retained.

## What we recommended

The tuning work carried out up to that point, indexes, targeted query fixes, adjustments to application code, had produced real results and kept producing them throughout the engagement. The data collected pointed to a ceiling on that approach, though: an index to data ratio set to keep worsening, a technical log volume growing with no retention policy, a capacity margin that would run out regardless of how many more queries got optimized one at a time.

The main contribution of the work was translating that signal into an operational distinction. Traffic growth would level off once platform adoption was complete, and the horizontal scalability already built into the application could be enough for that. Data volume growth would not level off on its own, and no amount of single query optimization would stop it.

We built a two tier roadmap on that distinction. In the short term, a small number of targeted, low risk interventions, starting with extending a cache already in production to the role it was naturally suited for, sized precisely against measured volumes. In the medium term plan, the choices that called for a decision from the client's technical leadership and could no longer be treated as routine maintenance: separating the technical logging workload from the application database onto a dedicated technology, with concrete alternatives compared against their respective trade offs; infrastructurally isolating the traffic routing layer from the rest of the application; evaluating cloud elasticity for load peaks, given that physical infrastructure procurement times could not respond to sudden growth; planning the evolution of file attachment management toward dedicated storage, separated from the relational database's lifecycle.

For each of these choices we spelled out the blocking technical dependencies, so the client could plan the real sequence of interventions instead of treating them as a list of independent options.

Several of the short term interventions were carried out during the engagement, with concrete results. The most significant was extending Redis, already in production for a narrow task, to a much broader caching role sitting on the critical request path. That took pressure off the database directly and measurably, giving the infrastructure breathing room while the medium term architectural choices were being evaluated and planned.

## The measured result

One of these interventions, extending the Redis cache to the authentication header check, was implemented and verified with a direct comparison between baseline and optimized run, same time window, same simulated load.

| Metric                                 | Before         | After           | Change |
| -------------------------------------- | -------------- | --------------- | ------ |
| Cumulative SQL time at the gateway     | 213 million ms | 12 million ms   | -94%   |
| Query execution count on the database  | 15.6 million   | 2.9 million     | -82%   |
| Query CPU time on the database         | 1.7 million ms | 181 thousand ms | -89%   |
| Average page life expectancy in memory | 1,614 seconds  | 62,910 seconds  | +97%   |

One single caching change eliminated the dominant query on the application database and freed up the capacity needed to absorb months of subsequent growth, concrete proof that tactical work, when driven by measured data, keeps paying for itself even while the more structural choices are being planned.

## Why this work matters

The value in this kind of work lies in doing two things together: carrying out the tactical interventions that give immediate breathing room, like extending the cache, and demonstrating with measured data when that approach on its own will stop being enough, shifting decision makers' attention to the architectural choices that need to go on the plan before growth makes them urgent.

---

_Details in this case history have been generalized to protect client confidentiality._