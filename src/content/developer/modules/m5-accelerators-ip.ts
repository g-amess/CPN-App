import type { BuildModule } from '../../types'

export const m5: BuildModule = {
  id: 'm5',
  title: "Accelerators & IP Contribution",
  blurb: "Package reusable accelerators, contribute verifiable assets, map requirements and lifecycle, choose deployment platforms, version what ships, and mark trust boundaries.",
  lessons: [

                {
                  id: 'packaging-reuse',
                  moduleId: 'm5',
                  title: "Packaging for Reuse",
                  summary: "Turn a working build into an accelerator the next engagement can start from.",
                  body: `You finished the prior modules with a build that runs: an agent loop, a configured MCP server, an eval that proves that the prompt works. The most time-consuming and expensive thing on a team is the engineering time that gets spent rebuilding the same thing for the next customer. What an accelerator does: keep the reusable parts and separate out the rest An accelerator is a solution packaged so future engagements start from a working foundation rather than from a blank repository. In blueprint terms, this is packaging for reuse: separating engagement-specific code from the reusable core and parameterizing the rest. Take a working build, separate the parts that are customer-specific, and expose them as parameters with documented defaults. The asset then configures rather than gets entirely rewritten. Packaging for reuse while the build is fresh is cheaper than reconstructing the intent months later, when the person who knew why a value was hardcoded has moved on. Most reusable work falls into different asset types, and each one packages differently Most reusable work falls into one of three categories used throughout this module: a template, a configurable server, or a portable eval. Each type holds a different kind of work and needs to be packaged in its own way. Reaching for the wrong type can make an asset look reusable while still making it difficult to apply.

## Asset type What it bundles What correct packaging requires

Agent Template The system prompt, the tool schemas, and the loop structure from a working agent. Pull the domain-specific values into configuration with documented defaults, so a new team sets the values rather than editing the loop. MCP Server Package The tools the server exposes, with their inputs and the scope the installing team controls. Document each tool input and let the installing team set the scope, so the server installs into a new environment without code edits. Eval Suite The graded test set and the judge rubric that prove the asset works. Ship the dataset and rubric together so a new team can run them in their own context and confirm the asset still works there. The same eval suite also acts as the gate at deployment. When you promote a new model version to production, run it against a pinned baseline score before the version goes live.

Shipping an agent as a set of loose scripts instead of a template is the most common version of the wrong approach. The scripts run, so they look reusable, but every customer-specific value is buried in a different file, and the next team copies and diverges them instead of configuring one asset. Document both the code and the assumptions Code describes behavior. Documentation covers what a future builder cannot reliably infer from reading the source: the assumptions the asset makes about its environment, the inputs it expects, the failure modes it already handles, and the eval that defines whether it still works. Without this, the next team treats the asset as a black box and rebuilds it. Bundle the audit log as part of the package A regulated customer's reviewer asks what data the asset touches, what identity it acts under, and what log it leaves. An accelerator without these passes a demo and stalls at the first security review. Treat the audit log as part of the package. The packaging checklist Keep this checklist next to the build while you package it. Each column is a decision you make once per asset.

Asset type What to parameterize What to document What to bundle for audit Agent template Every value that changes per customer: prompts, paths, scopes, credentials by reference, and thresholds. Environment assumptions, expected inputs, handled failure modes, and the eval that defines working. The data touched, the identity acted under, and the log of what the asset did. MCP Server Scopes, credentials by reference, and per-customer paths. Expected inputs per tool, scope boundaries, and handled failure modes. The data touched, the identity acted under, and the log of what the asset did. Eval Suite Thresholds and dataset paths that change per customer or environment. The rubric logic, what the scores mean, and the baseline the asset is pinned to. The data touched, the identity acted under, and the log of what the asset did.

## Handles well

Parameterizing while the build is fresh turns one delivery into an asset the next engagement configures in hours.

## Adds cost or complexity

Separating generalizable from customer-specific parts and documenting assumptions adds real time to the first build.

## Use a different approach

For a one-off a customer will never reuse, packaging overhead is not worth it: ship the build and move on.

## Setup

Hardcoding ships faster and you were working under a deadline, so you hardcoded the values that made the demo. The template worked. That is exactly why nobody looked at it again until the next team tried to reuse it.

This is a postmortem, written the way a team writes one after the reuse attempt fails, so you can see the failure form before anyone labels it as a mistake. What happened A team built an agent template for a customer engagement and shipped it on time. To hit the due date, the customer-specific values went straight into the code: the repository path, the model name, the review thresholds, and a handful of prompt fragments specific to that customer's domain. The template ran, the engagement closed, and the build went into the shared repository labeled as reusable. Months later a second team picked it up for a similar engagement. They could not configure it, because there was nothing to configure. Every value that needed to change was baked into the loop where the second team could not see it without reading the whole file. There was no document saying which values were customer-specific and which were load-bearing. There was also no bundled eval, so even after they guessed at the edits, nothing confirmed the template still worked in the new context. They had to rewrite it from scratch.

## Why it broke

The build was treated as finished the moment it ran rather than at the moment it could be reused. Hardcoding was the reasonable call under a deadline, and it was never revisited. A working template does not announce that it cannot be reused. The cost appeared only when a second team paid for the rebuild that packaging was supposed to prevent, along with the time they lost discovering the template was a dead end.

## What to Watch Out for

A template that runs has not been packaged for reuse. These are different finishing states. The warning signs are the absence of three things: no parameters where customer-specific values belong, no documentation describing the assumptions, and no bundled eval proving the asset still works in a different context. Package the asset while the build is fresh. The knowledge of what is customer-specific is most expensive to reconstruct after the people who had it have moved on.`,
                  keyTakeaways: [
        "Package while the build is fresh \u2014 expose customer-specific parts as documented parameters.",
        "Bundle the eval and assumptions with the asset so the next team can configure, not rebuild.",
        "A template that ships fast but cannot be reused usually hard-codes the first customer.",
      ],
      examRelevance: [
        { domainId: "d2", label: "Packaging reusable accelerators" },
      ],
                },

                {
                  id: 'contributing-back',
                  moduleId: 'm5',
                  title: "Contributing Back",
                  summary: "Move an asset from private reuse into shared infrastructure a maintainer can verify.",
                  body: `You have already done most of the work that makes an asset shareable. When you packaged it for your own team to reuse, you pulled out the parameters, wrote down the assumptions, and bundled the eval. The parameters show the asset can be configured rather than rewritten. The documented assumptions tell the maintainer what environment the asset expects. The bundled eval gives them a way to confirm it still works. An asset packaged for internal reuse is already close to what a maintainer needs to accept it. The contribution channel is designed to receive that packaged asset. It carries the version, the installation steps, and the components as a single unit, so a team that never spoke to you can install it and get the same working setup. Match the contribution to the channel built for it Contributing back means moving an asset from private reuse to shared infrastructure through a documented channel. Each channel is built for a specific kind of contribution. The Claude Cookbook is a GitHub repository of focused reference implementations. It is designed for self-contained single- or multi-pattern implementations demonstrated clearly and working end to end. Open-source MCP servers and tools each live in their own repository with their own contribution conventions. Sending a full multi-component application to the Cookbook is a mismatch. The repository is set up to review one focused pattern rather than an entire application, so a submission that large does not fit what reviewers are looking for and will stall. The first step is matching the contribution to the channel built for it. Putting a full application where a focused example belongs is one of the most common reasons a contribution never gets reviewed. What makes verifying a contribution possible A maintainer accepts a contribution they can verify. The bar is set by what they need to check, not by how clever the code is. Four things make that verification possible:

1The code does one thing. A sprawling contribution forces a reviewer to reconstruct your intent before evaluating it. 2An example shows it running. A reviewer should not have to build a harness to see the behavior. 3A test proves it works. A test lets a maintainer verify the result without reproducing the reasoning themselves. 4A short statement names the assumptions. Otherwise, the first failure becomes the maintainer's problem.

## Rights and attribution come before technical review

Licensing and attribution decide whether a contribution can be accepted at all, which is why they come before the technical review. Code carried in from a customer engagement may have constraints on where it can go. Confirming you have the right to contribute it, and attributing anything you built on, is a gate the contribution must pass first. Skipping this is what turns a contribution into a problem the legal team must unwind later. The example worked here is the customer service agent case. A reusable conversation-handling pattern, built during an engagement, gets stripped of customer specifics and prepared as a general example for the Cookbook. The contribution-back motion is shared across all three roles in this curriculum. Your job as the Developer is technical readiness: the focused code, the example, the test, the assumptions, and the rights check. The engagement context comes from the broader team. The contribution-readiness reference

Channel What a maintainer checks Licensing and attribution The example and test bar to clear Cookbook for a focused example, or the tool or server's own repository for a tool or fix. That the code does one thing and that they can read it in full. Confirm that you have the right to contribute code from an engagement, with prior work attributed. A runnable example plus a test that proves the behavior, not just a description of it.

## Handles well

A packaged asset needs only the example, test, and rights check to become shared infrastructure others build on.

## Adds cost or complexity

Clearing the maintainer bar and the licensing gate is real work on top of making the code run for you.

## Use a different approach

When code carries an engagement licensing constraint you cannot clear, do not contribute it: escalate to the owner instead.

## Setup

You opened the contribution with the exact code that solved your problem. This was the natural choice because it worked in your case and it was accessible. It worked for you, but that is precisely why it was missing everything a stranger needs to trust it.

This is an exchange from an internal channel so you can hear how a maintainer explains the silence on a pull request. The exchange Developer: My PR has been open three weeks with no review. The code works, I use it every day. What is the holdup? Maintainer: It probably works for you. The problem is I can't tell. There is no test I can run, no example that proves the behavior, and nothing saying what it assumes about the environment. Developer: So, you want me to add a test and an example? Maintainer: Yes. A contribution a reviewer cannot verify sits at the back of the queue until someone has time to reconstruct what it does. A focused PR with a test and an example gets reviewed fast because there is nothing left for me to reverse-engineer.

## Why it broke

The code was correct. The contribution stalled because the maintainer could not verify it without reconstructing the developer's work. That gap is easy to overlook because the author already has the missing context. The example, the test, and the assumptions statement all seem obvious to the person who created the code. To the maintainer, however, they are not, and a reviewer who must reconstruct intent will always do it last.

## What to Watch Out for

A pull request stalls on what the reviewer cannot verify. Before opening a contribution, add the example that shows it running, the test that proves the behavior, and the short statement naming what it assumes. Those three features are what move a contribution from the back of the queue to a fast review, because they leave the maintainer nothing to reverse-engineer.`,
                  keyTakeaways: [
        "Maintainers accept what they can verify: focused code, runnable example, test, assumptions, rights.",
        "Match the contribution to the right channel for its shape.",
        "A PR a reviewer cannot run sits at the back of the queue.",
      ],
      examRelevance: [
        { domainId: "d2", label: "Contribution readiness" },
      ],
                },

                {
                  id: 'requirements-lifecycle',
                  moduleId: 'm5',
                  title: "Requirements & Lifecycle",
                  summary: "From business requirements to functional/infrastructure requirements and lifecycle phases.",
                  body: `The deployment-platform decisions that follow all assume the requirements already exist: the residency rule, the latency target, the identity model. This screen is where those requirements come from: turning a business problem into the functional and infrastructure requirements a deployment decision can be defended against. Capturing functional requirements from a business problem A functional requirement names what the system must do, stated with enough detail to check. A business problem (e.g. "help support agents answer faster") is not yet a requirement; the functional requirements derive from it (e.g. "classify each ticket into one of four queues; draft a reply citing the relevant policy; never auto-send without human approval"). The discipline is to write each as a checkable statement of behavior. A vague goal cannot be designed against or verified, while a specific one becomes a line in an eval and a criterion at review. Deriving infrastructure requirements Infrastructure requirements are the non-functional constraints the deployment must satisfy. Most of them are not stated in the business problem; instead, you derive them by asking the questions the business problem implies. Latency: how fast does a response need to be, measured where the user is? Scale: how many requests, and at what peak? Residency: where must the data be processed, and under which regulation? Identity: who acts, under what credentials, and what must be auditable? Latency, scale, residency, and identity are the infrastructure requirements that most often decide the deployment platform, and they are easiest to capture at the start, before a platform is chosen for other reasons. Documenting requirements so a decision can be defended Requirements are written down because the deployment decision will be reviewed by people who did not gather them. A short requirements record covering the functional behaviors, the infrastructure constraints, and the regulation each constraint comes from lets you defend a platform choice as following from the requirements rather than from familiarity. This record is the input the next screen's deployment decision reads from.

## Handles well

Turning a business problem into checkable functional and infrastructure requirements before any platform is chosen.

## Adds cost or complexity

Eliciting infrastructure constraints up front takes a scoping conversation the team is tempted to skip.

## Use a different approach

For a throwaway prototype with no review and no regulated data, lightweight notes are enough.

The requirements you just captured are the first phase of a longer arc. This screen names that arc as the systems lifecycle, so the deployment, versioning, and boundary work in the rest of this module sits in the right phase rather than arriving as unrelated tasks. The lifecycle phases applied to a Claude application A Claude application moves through the same lifecycle as any engineered system, with the model work mapped onto it:

1Requirements: capture functional and infrastructure needs 2Design: choose the platform, the model, and the trust boundaries 3Build: write the agent, tools, and prompts 4Test: evals, unit, integration, and end-to-end checks 5Deploy: pin the version, gate promotion on the eval 6Operate: instrument cost, latency, and errors; enforce guardrails 7Iterate: feed production findings back into requirements

The phases are the same ones the earlier modules taught one at a time. Identifying them as a lifecycle is what shows how they connect. Gating between phases A gate is a decision to move from one phase to the next, and it is where a regulated engagement keeps control. You do not move from design to build until the platform satisfies the residency requirement; you do not move from deploy toward full production until the new version clears the eval against the pinned baseline. Placing engineering work in the right phase, and refusing to skip a gate, is what keeps a Claude application reviewable.

## Handles well

Placing each piece of engineering work in the lifecycle phase it belongs to, with a defined artifact and gate.

Adds cost or complexity Gating between phases adds checkpoints a team under deadline is tempted to skip.

Use a different approach A one-off experiment may collapse phases, but a regulated deployment cannot.`,
                  keyTakeaways: [
        "Translate business needs into functional and infrastructure requirements for Claude apps.",
        "Place work correctly across build, deploy, operate, and maintain phases.",
        "Lifecycle mistakes show up as features that cannot be operated or audited later.",
      ],
      examRelevance: [
        { domainId: "d2", label: "Requirements and systems lifecycle" },
      ],
                },

                {
                  id: 'deployment-versioning',
                  moduleId: 'm5',
                  title: "Deployment & Versioning",
                  summary: "Choose where a Claude workload runs and pin versions so alias moves do not break production.",
                  body: `A packaged asset and a contributed one are both merely code until something runs them. The asset now faces a different question: where it runs and how to lock its version, so an upstream change does not become an untracked change in production. That platform decision is rarely about technical merit alone. In practice, it is usually shaped by where the customer already has cloud infrastructure, identity management, and compliance agreements in place. The first question is usually about which platform the customer already trusts and operates on. The customer's cloud usually determines the platform The deployment platform is the environment where the Claude workload runs. The same model can run in several deployment environments, and the customer's existing cloud usually determines which one. The first-party Claude API is Anthropic's own environment and typically receives new features first. Claude Platform on AWS is accessed through the customer's AWS account using Anthropic's own model IDs and lifecycle; inference is Anthropic-operated, outside the AWS boundary. Amazon Bedrock offers two integrations: Claude in Amazon Bedrock uses the Messages API at /anthropic/v1/messages with broad feature parity; confirm any feature-specific requirements against the Bedrock documentation, as a features-not-supported list exists, while Claude on Amazon Bedrock (legacy) uses the Invoke Model/Converse APIs with ARN-versioned identifiers. Google Vertex AI does the same inside Google Cloud. Third-party platforms, such as Microsoft Foundry, embed Claude inside a product the customer already uses. Microsoft Foundry offers Claude in two hosting forms: Hosted on Azure (currently Claude Opus 4.8, Claude Sonnet 5, and Claude Haiku 4.5, with inference running end-to-end on Azure infrastructure, generally available) and Hosted on Anthropic (all other Foundry Claude models, with inference on Anthropic-operated infrastructure). Residency assumptions for regulated customers depend on the hosting form of the specific model. Confirm the hosting form and the current model split with Microsoft at build time. Identity and data residency are important for security Identity and data location are answered by the platform, not your code. Bedrock uses AWS identity and keeps data inside the customer's AWS boundary; Vertex uses Google Cloud identity and boundary. Both offer regional routing when residency is a constraint. Matching the platform to the customer's existing compliance agreement avoids a data-residency review from scratch. Pin the version so an upstream model change is not a silent production change Versioning is what keeps a model or prompt change from becoming a silent change in production. Every Claude model ID points to a specific model snapshot. Aliases such as Opus and Sonnet are convenient, but they evolve over time and may resolve to different versions across deployment platforms. A pinned full model ID resolves to a fixed snapshot. Pin the specific model version rather than the alias, so an upstream model update is a deliberate choice rather than a silent production change. Then version the prompt and the asset alongside the code. Finally, keep the prior version available so the regression can be rolled back. An unpinned deployment makes every upstream model update an untracked change to your output. The first line follows a moving alias. The second pins the snapshot. # Pre-4.6 example: a convenience alias can resolve to a new # version without you knowing model = "claude-haiku-4-5"

# Pre-4.6 pinned snapshot: the version is fixed until you change this line model = "claude-haiku-4-5-20251001" For Claude 4.6 and later, the model ID alone pins to a specific snapshot; for earlier models, the ID plus a date suffix is required. Verify the current convention at platform.claude.com at build time. Promote a version through the eval Gate promotion on the eval suite. Send a new version to a portion of traffic, compare against the pinned baseline, and promote or roll back on the result. This is where the eval stops being a one-time test and becomes the deployment gate. The deployment-platform decision table

Platform Identity and data model When to choose it How versioning is pinned First-party Claude APIAnthropic identity and terms. The customer has no binding cloud or residency constraint and wants the newest capabilities. Pin the full model ID and keep the prior snapshot. Claude Platform on AWSAnthropic identity and terms, accessed through the customer's AWS account; inference is Anthropic-operated outside the AWS boundary. Model lifecycle follows Anthropic's deprecation schedule. The customer is on AWS but wants Anthropic model IDs, lifecycle, and feature parity with the first-party API. Pin using the same model ID format as the Claude API (for example, claude-opus-4-8). Lifecycle follows Anthropic's schedule. (Confirm at publish time.) Claude in Amazon Bedrock Messages API at /anthropic/v1/messages, broad feature parity with the first-party API; confirm feature-specific requirements against the Bedrock documentation. Data stays inside the customer's configured AWS boundary. The customer is on AWS, wants broad feature parity with the first-party API (confirm feature-specific requirements), and holds a compliance posture there. Pin the full model ID using the anthropic. prefix format. Partner retirement dates differ from Anthropic's schedule. Confirm at publish time. Claude on Amazon Bedrock (legacy)AWS identity and billing, Invoke Model/Converse APIs with ARN-versioned model identifiers. The customer is on an existing Bedrock integration using Invoke Model or Converse and has not migrated to the Messages API. Pin via ARN-versioned model identifiers per Bedrock's versioning controls. Google Vertex AIGoogle Cloud identity, Identity and Access Management (IAM), and billing, with regional or global endpoints for residency. The customer is on Google Cloud and holds a compliance posture there. Pin the full model ID before rollout using Vertex's model ID format. Partner retirement dates differ from Anthropic's schedule. Third-party platform The wrapping product's identity and billing model. Note: Claude in Microsoft Foundry offers two hosting forms: Hosted on Azure (currently Opus 4.8, Sonnet 5, and Haiku 4.5; inference end-to-end on Azure) and Hosted on Anthropic (all other Foundry Claude models). Confirm residency and compliance terms with Microsoft before selecting this path for a regulated customer. The customer already runs the platform that embeds Claude. Pin per the platform's versioning controls.

## Handles well

Matching the platform to the customer cloud and pinning the version keeps a migration reviewable and a rollback possible.

## Adds cost or complexity

Pinning, retaining prior versions, and gating promotion on the eval add release-process overhead to every deployment.

## Use a different approach

For a throwaway prototype that never touches production, a moving alias is fine: pinning is for what ships.

## Setup

You shipped against the alias that pointed at the recommended version, because that was the convenient default and it gave you the latest model for free. It worked. Then the alias advanced, and what was free turned out to have a price.

This is a trace excerpt from a production log, the kind you would scroll back through after an incident. It shows the day the output shape changed and why there was nothing to roll back to. The log --:  deploy: model="opus"  status=ok --:  alias advanced -> new opus version (no app change) --:  parser: KeyError "summary" in response payload --:  Error: output shape changed; downstream parse failed --:  rollback attempted -> no pinned prior version retained --:  incident: hotfix parser; root cause = unpinned deployment

## Why it broke

The application never changed, but the alias did. No pinned prior version had been retained, so there was nothing to roll back to. The hotfix repaired the parser but left the unpinned deployment in place.

## What to Watch Out for

An alias resolves to a moving target; a pinned full model ID is a fixed snapshot. Pin the full model ID so an upstream update is something you adopt on purpose. Keep the prior pinned version available so a regression is a rollback rather than a hotfix. Gate the new version through your eval before you promote it, so the output-shape change shows up in a test run instead of in production.`,
                  keyTakeaways: [
        "Choose the platform from cloud and compliance posture, then pin a specific model version.",
        "Aliases move \u2014 pinning cites a fixed edition so upgrades are deliberate.",
        "Keep the prior version available for rollback.",
      ],
      examRelevance: [
        { domainId: "d2", label: "Deployment platforms and pinned model IDs" },
      ],
                },

                {
                  id: 'comparing-platforms',
                  moduleId: 'm5',
                  title: "Comparing Platforms",
                  summary: "Compare platforms on latency, compliance, and cost so the choice survives review.",
                  body: `In the last two screens you chose a platform and pinned its version. That choice was right for the customer's cloud, but "right for their cloud" is not yet an argument a procurement and security team will sign off on. Measure latency from the customer's region Latency depends on where the platform runs relative to the customer and on how access to new features is routed. A platform running in the customer's own cloud region can reduce round-trip time compared to a first-party endpoint located farther away. The trade-off is timing of access: the first-party API typically receives new capabilities before they reach other platforms. The number is only accurate when you measure it from the customer's actual region against their actual payload. A measurement from your laptop hides the round-trip penalty that appears once the workload runs where the customer is. Within Bedrock specifically, the choice between global and regional endpoints is also the primary residency control and can affect cost. You should measure from the customer's actual region against both options before committing. Compliance often determines the platform Compliance is often the dimension that ends the debate. A customer who already holds a certification on one cloud is unlikely to re-certify on another. Data residency is a rule that a customer's data must be processed in a specific country or region. Available compliance certifications and who can audit access differ by platform, and a regulated financial or healthcare customer treats these as pass-or-fail rather than as tradeoffs to balance. The first-party Claude API may not offer EU data residency; confirm current regional coverage at platform.claude.com, since EU-only residency typically requires Bedrock or Vertex AI; on third-party platforms such as Microsoft Foundry, hosting is per-model: Azure-hosted Foundry models run inference end-to-end on Azure infrastructure, while Anthropic-hosted Foundry models do not satisfy EU regional residency requirements. Residency must be confirmed per model and deployment with Microsoft. Raise the compliance constraint during scoping, or it surfaces at contract review after the work is done. What drives total cost beyond the per-token rate Per-token rates are broadly aligned across platforms; total cost moves on egress, platform fees, and integration effort. A lower token price can cost more in total once data transfer and integration are factored in. Instrument cost per call for each platform. Confirm the current pricing pages at scoping. The cross-platform comparison reference

Dimension How it differs by platform How to measure it Where each platform wins Latency A platform in the customer's region shortens the round trip, while the first-party API may reach new features first. From the customer's actual region against their actual payload. An in-region cloud platform wins on round-trip latency, while the first-party API is advantaged on earliest feature access. Compliance Data residency, certifications, and audit controls are determined by the deployment platform. Against the customer's existing certification and residency requirements during scoping. The cloud platform the customer has already certified wins, because it needs no re-certification. Cost Token price, data egress, platform fees, and integration effort all vary. Total cost per call per platform, including egress and integration, rather than token price alone. The platform with the lowest total cost for the actual workload wins, which is not always the cheapest token.

## Handles well

Measuring all three dimensions per platform turns a placement into one a procurement team will sign off on.

## Adds cost or complexity

Instrumenting latency, compliance, and cost across platforms requires real measurement work before any code ships.

## Use a different approach

When the customer's compliance requirement is already pass-or-fail, skip the full comparison. That constraint determines the placement on its own.

## Setup

You picked the platform your team was already familiar with, because the migration looked easy and the deadline was approaching rapidly. It built just fine; the trouble was that easy-to-build and allowed-to-ship are different criteria.

The following anecdote is the kind a developer tells a teammate after a review goes sideways. It lets you see the familiar platform trap before anyone calls it a mistake. What happened A developer building for a regulated customer chose the platform the team had shipped on before. The integration came together quickly because the team knew the tools and resources. The build passed its functional tests. At the customer's security review, the reviewer asked where data was being processed. The selected platform did not satisfy the customer's residency requirements. A different platform, one the team knew less well, would have satisfied the requirement through regional deployment options the customer had already cleared. The placement was rejected, and the integration had to be rebuilt on the platform that met the residency constraint.

## Why it broke

Familiarity optimized for the wrong test. The easy migration answered whether the team could build quickly. It never answered whether the deployment would pass the customer's residency review, which was the test that determined whether it could ship. Because the compliance requirement was not fulfilled during scoping, it arrived at the go-no-go review instead. This is the most expensive place to discover it, because the build was already complete.

## What to Watch Out for

A platform that is easy for your team to build on is not necessarily a platform the customer is allowed to run. When the customer is regulated, the residency and compliance constraint is often pass-or-fail, rather than tradeoffs. Identify them early during scoping and let them influence the placement before familiarity does. Checking early costs a scoping conversation, while checking late costs an entire rebuild.`,
                  keyTakeaways: [
        "Measure latency from the customer region, compliance against their certifications, and total cost per call.",
        "For regulated customers, compliance is usually pass-or-fail \u2014 raise it during scoping.",
        "Familiarity alone is not a platform decision.",
      ],
      examRelevance: [
        { domainId: "d2", label: "Latency, compliance, and cost comparison" },
      ],
                },

                {
                  id: 'trust-boundaries',
                  moduleId: 'm5',
                  title: "Trust Boundaries",
                  summary: "Coordinate several Claude deployments with explicit trust boundaries under review.",
                  body: `The accelerators, deployments, and tradeoffs now come together in a single application. Connecting components multiplies the places where identity, secrets, and untrusted input can cross. The discipline is to identify every boundary before connecting anything. Map which component does what before you connect them A multi-component app coordinates more than one Claude capability into a single workflow. An API request might trigger a Claude Code task, which then reaches a customer system through an MCP server. Each component contributes a capability the others do not have. The challenge is that every connection between them creates a place where identity, secrets, and untrusted input can cross. Map which component does what before connecting anything. The trust boundary is where data moves The trust boundary is the point where data or instructions move from one deployment environment to another. It is exactly where the injection and access controls from the prior module apply. Content fetched by a Claude Code task is untrusted when it reaches the next component. The receiving component should treat it as data, rather than as instructions, following the same principle used throughout the security module. The core discipline here is to identify every seam as a boundary. Don't assume a component is trusted simply because it worked correctly on its own. Least privilege applies to the whole application Identity and least privilege, which means giving each component only the access its task needs and nothing more, apply to the application as a whole. Each component operates under an identity. The application is only as contained as its most privileged seam, which means a single component scoped too broadly becomes the weak point even when every other component is properly scoped. You scope each component to the least privilege its role in the workflow requires. This is what keeps a steered component from reaching beyond its intended task. Scoping for a regulated review pulls the module together A regulated review requires justifying audit logging, data-residency decisions, and permission controls across the full application. For regulated deployments, Bedrock and Vertex AI are typically the platforms that satisfy regional residency constraints. Confirm ZDR and HIPAA BAA eligibility for each component against the Anthropic Trust Center and platform.claude.com before scoping. The multi-component integration map

Component What it contributes The trust boundary at its seam The control that enforces it First-party APIOrchestrates the workflow and holds the entry point. The request entering the app from outside. Input validation and the identity the call runs under. Claude Code task Runs the agentic work and may fetch external content. Content it fetched, which is untrusted downstream. Treat fetched content as data at the next seam. MCP server Reaches a customer system to read or act. The system access it holds on the app's behalf. Scope the server to least privilege and log the access.

## Handles well

Naming every seam as a boundary and scoping each component to least privilege makes a multi-component app deployable under review.

## Adds cost or complexity

Mapping seams, enforcing controls at each, and logging boundary crossings adds design and audit work to every integration.

Use a different approach When a seam cannot be secured, do not ship around it: escalate to a human owner.

## Setup

You connected the components that each passed their own tests. The parts were already checked and connecting verified parts feels safe. Each one was trusted in isolation. The gap was that a seam between two trusted parts cannot automatically be trusted itself.

This is a short transcript from a pairing session, the kind of back-and-forth that ends at the moment the unmarked seam gets identified. The session Dev A: All three components pass their own tests. I just wired them up. Dev B: Where does the Claude Code task send what it fetched? Dev A: Straight into the next call as part of the prompt. It is just the content we pulled from the customer page. Dev B: That content is untrusted. If it carries instructions, the next component runs them, because we never mark that seam as a boundary. Dev A: But each component was trusted on its own. Dev B: Right, and the seam between them was not. That is the one nobody treated as a boundary, so fetched content crosses as instructions.

## Why it broke

Each component having passed its own tests said nothing about the seam between them. The fetched content was untrusted the moment it left the Claude Code task. It arrived from a component that worked in isolation and it was passed into the next call as if it were trusted instructions. The boundary existed in the data flow. It just was not marked, so no control checked it. A component that passes its own tests has no seam-level controls. Every point where data crosses between deployment environments requires an explicit boundary control regardless of how each component behaves independently.

## What to Watch Out for

A component that is trusted in isolation does not automatically make the seam leaving it trustworthy. Mark every place data or instructions cross from one deployment environment to another as a boundary. Put a control there that treats fetched content as data rather than instructions, exactly as the security work taught. The seam nobody identifies is the one a steered action crosses.`,
                  keyTakeaways: [
        "Mark every seam where data crosses environments as a trust boundary.",
        "Scope each component to minimum access; trust does not carry over automatically.",
        "When a seam cannot be secured, assign a human owner rather than shipping it.",
      ],
      examRelevance: [
        { domainId: "d7", label: "Multi-component trust boundaries" },
      ],
                },

                {
                  id: 'm5-takeaways',
                  moduleId: 'm5',
                  title: "Module Recap",
                  summary: "Key takeaways and terms for accelerators, contribution, platforms, and trust.",
                  body: `This recap closes **Accelerators & IP Contribution**. Internalize these takeaways — they are the durable skills the rest of the course (and the exam domains) build on.

**01. Package while the build is fresh. An accelerator keeps the reusable logic, exposes the customer-specific parts as documented parameters, and bundles the eval and the audit log alongside the asset. Correct packaging produces an asset teams configure. The knowledge of what is customer-specific is most expensive to reconstruct after the people who held it have moved on.**

**02. A maintainer accepts what they can verify. Moving an asset into shared infrastructure means matching it to the channel built for its shape, then clearing the review bar: focused code, a runnable example, a test, and a statement of assumptions, with licensing rights confirmed before the technical review. A contribution a reviewer cannot verify sits at the back of the queue. Readiness moves a private asset into shared infrastructure others build on.**

**03. Pin what ships. Choose the deployment platform based on the customer's cloud and compliance posture, then pin the specific model version rather than the moving alias and keep the prior version available. An alias is like asking for the current edition of a book: convenient, but the text can change. Pinning cites a fixed edition, so an upstream model change is something you adopt deliberately rather than something that arrives overnight with no rollback path.**

**04. Measure the dimension that decides the placement. A platform choice is defensible only when latency, compliance, and cost are measured: latency from the customer's region, compliance against their existing certification, and cost as the total per call rather than the token price alone. For regulated customers, compliance is usually pass-or-fail. Raising compliance as a constraint during scoping prevents it from rejecting the build later at contract review.**

**05. Mark every seam as a boundary. A multi-component application is only as contained as its most privileged seam. Scope each component to the minimum access its role requires and treat every point where data crosses as a trust boundary. Fetched content is treated as data, not instructions. Trust at a component boundary must be explicitly established. It does not carry over from the component that sent the data. When a seam cannot be secured, it goes to a human owner rather than being shipped.**

## What comes next

You can now package a build into a reusable asset, contribute it back, place and version it on the right platform, defend that placement, and connect components together so the boundaries hold. That completes the build-to-deploy arc for this persona: from writing production code in the earlier modules to shipping assets a regulated customer can audit and a team can reuse.

## Anthropic public references (time-sensitive)

## IDSource Type Used for

S1platform.claude.com (Claude in Amazon Bedrock, Claude on Vertex AI)Product documentation Deployment platforms, identity and data models, residency routing, regional and global endpoints. S2platform.claude.com (Model IDs and versioning, Model deprecations)Product documentation Pinned model IDs, alias resolution, lifecycle and retirement, partner-set schedules. S3anthropic.com and the Anthropic GitHub organization (Cookbook)Product and repository Contribution channels, the Cookbook as a home for focused examples, contribution conventions. S4Building with the Claude API (Skilljar)Course source Eval datasets, graders, and the evaluation pipeline used as the deployment gate. S5Claude Code 101 In Action (Skilljar)Course source Claude Code agentic tasks and MCP server roles in a multi-component workflow.

You can now take a working build all the way to a deployable, auditable asset. Package it, contribute it, place and version it, defend that placement, and hold the boundaries together under review.

Alphabetical. Click a term to expand its definition.

Accelerator A working solution packaged so the next engagement configures it rather than rebuilding it. Customer-specific parts are exposed as documented parameters, the assumptions are written down, and an eval is bundled to prove the asset still works in a new context. Contribution readiness What a maintainer needs to verify a contribution: focused code, a runnable example, a test that proves the behavior, a statement of environment assumptions, and confirmed rights to contribute the code. Deployment platform Where a Claude workload runs. The six are: the first-party Claude API, Claude Platform on AWS, Claude in Amazon Bedrock, Claude on Amazon Bedrock (legacy), Google Vertex AI, and third-party platforms. The same model can differ by platform on identity, data residency, latency, and cost. Model alias versus pinned IDAn alias such as opus or sonnet resolves to a recommended version that updates over time and can differ by platform. A pinned full model ID is a fixed snapshot. Pinning is what keeps an upstream model change from being a silent production change. Trust boundary The seam where data or instructions move from one deployment environment to another in a multi-component app. Content fetched by one component is untrusted when it reaches the next, so the receiving component treats it as data, not instructions.`,
                  keyTakeaways: [
        "Package accelerators with parameters, evals, and written assumptions.",
        "Contribute only what a maintainer can verify.",
        "Pin model versions; measure platform fit on latency, compliance, and cost.",
        "Mark every multi-component seam as a trust boundary.",
      ]
                },
  ],
}
