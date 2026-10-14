---
title: "A 401 from Maven Central"
description: "A Maven 3.10 credential-origin change caused an unchanged RESTHeart snapshot deploy to fail with 401. The warning in the log explained why."
date: 2026-10-14
tags: ["Engineering", "Maven"]
draft: false
image: "./error_deploy_maven.png"
image_alt: "Maven Central snapshot deployment failing with HTTP 401"
---

[RESTHeart](https://restheart.org) is the open source Java backend we maintain, which exposes MongoDB through REST, GraphQL and WebSocket APIs. Every change to it is built and published as a snapshot to Maven Central by a GitHub Actions workflow, so that other developers can try it before the next release.

On 12 October that snapshot deploy started failing. The workflow had run unchanged for years, the last green run was nine days earlier, and the log ended with one line:

```
Could not transfer artifact org.restheart:restheart-security:pom.asc:9.10.1-20261012.203934-1
from/to central (https://central.sonatype.com/repository/maven-snapshots/): HTTP Status: 401
```

A 401 on a deploy points at credentials. I asked GitHub Copilot to help diagnose it, and its initial direction reinforced that instinct: its first answer pointed at the GPG key name and the secrets. That sent me toward checks that did not explain the 401.

## What I ruled out

- **The token.** The Central Portal listed it as active, with no expiry and unlimited scope.
- **The secrets.** I re-entered `CENTRAL_USERNAME` and `CENTRAL_PASSWORD` with the same token. Same 401.
- **The GPG key.** The failing file was a `.asc` signature, which suggested signing. But `gpg:sign` had already produced every signature in the log, and the key and passphrase had not changed since 2023.
- **Central itself.** A manual `PUT` with the token to the exact snapshot path returned 201. A temporary step in the CI job, running the same `curl` with the credentials injected by GitHub, returned 400, which means authenticated and then rejected for the probe path. The deploy step of the same job, a minute and a half later, failed with 401.

`curl` and the Maven plugin ran in the same job with the same credentials. `curl` was accepted and the plugin was refused. It did not fit the diagnosis I had been following.

## The warning in the log

After providing Opus 5 with the complete log in debug mode, I was pointed back to a line near the top of the first module's publish step, which I had scrolled past several times:

```
[WARNING] Not using credentials of server 'central' for repository
https://central.sonatype.com/repository/maven-snapshots/: the origins declared
for this id are [https://repo.maven.apache.org]. Add 'https://central.sonatype.com'
to <repositoryOrigins> of that server in settings if these credentials belong
there, or set maven.repository.credentialScope=id to restore legacy id-only
credential matching.
```

Maven 3.10 binds the credentials of a `<server>` to the origins of the repositories declared with the same id. Our `settings.xml` names the server `central`, and `central` is also the id Maven uses for Maven Central itself, whose origin is `repo.maven.apache.org`. The credentials were therefore never sent to `central.sonatype.com`, and `central-publishing-maven-plugin` uploaded without authentication. `curl` does not go through Maven's credential matching and succeeded with the same token.

The change reached us through a GitHub runner image update. Nothing in our repository had changed between the green run and the red one.

## The fix

Two changes, either of which is enough on its own.

The quick one is a property on the deploy command, which restores matching by id only:

```
mvn -B deploy -Pdeploy ... -Dmaven.repository.credentialScope=id
```

The durable one declares the origin in `settings.xml`, inside the `central` server:

```xml
<server>
    <id>central</id>
    <username>${CENTRAL_USERNAME}</username>
    <password>${CENTRAL_PASSWORD}</password>
    <repositoryOrigins>
        <repositoryOrigin>https://central.sonatype.com</repositoryOrigin>
    </repositoryOrigins>
</server>
```

The value is an origin in the form `scheme://host`, without a path. Maven adds it to the origins it already knows. The Central team confirmed this is the supported approach and pointed to the [Maven 3.10.0 settings reference](https://maven.apache.org/ref/3.10.0/maven-settings/settings.html#class_server).

I deployed with the property first, since it was a one-line change that unblocked both active branches. After the Central team's reply I removed it and kept the declared origin.

Two details for anyone applying the same change. Maven 3.9 does not know the element and prints `Unrecognised tag: 'repositoryOrigins'`, then ignores it, so local builds keep working. And the settings XSDs published on maven.apache.org (1.0.0, 1.1.0, 1.2.0 and 2.0.0) do not list the element yet, so an editor that validates against them will flag it.

## What I would do differently

The warning was in the log from the first failing run. GitHub Copilot's initial guidance sent me toward the GPG key name and the secrets. Those were reasonable suspects for a 401, but the checks showed they were not the problem.

The breakthrough came from giving Opus 5 the complete log in debug mode. It drew my attention to Maven's warning, which explained why the plugin was not sending credentials at all. Comparing `curl` and Maven in the same job then confirmed the difference: the credentials worked, but Maven's repository-origin matching kept them from reaching the publishing endpoint.

An AI diagnosis is a hypothesis. I checked this one against the complete log and against two requests with the same token: `curl` got a 201, the Maven plugin got a 401. When a request succeeds by hand and fails in the build tool, compare what each client actually sends. And read the warnings the tool printed before deciding what to investigate next.
