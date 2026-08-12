# SustainRx

**A diagnosis for your codebase.**

Live: [git-story-nine.vercel.app](https://git-story-nine.vercel.app)

---

## What it is

SustainRx is an AI-powered codebase analysis tool built on a medical metaphor: it examines a repository the way a doctor examines a patient. Connect a GitHub account, point it at a repo, and it produces a health assessment: where the tech debt lives, which areas are hot spots likely to cause problems, and documentation generated from the code itself.

This is an original product, not a clone or a tutorial build. Concept, design system, and architecture are mine, built independently from idea to deployment.

## Features

- **GitHub OAuth**: sign in and analyze your own repositories directly
- **Tech debt flagging**: surfaces maintenance issues and problem areas, prioritized so a team knows what to tackle first
- **Hot spot detection**: identifies the areas of the codebase most likely to need attention
- **Tiered documentation generation**: reports written for different audiences rather than one-size-fits-all output
- **PDF export**: turn any report into a document you can print, file, or email
- **Guardrails**: token caps and concurrency limits on AI calls to keep analysis fast and costs predictable

## Known limitations

Dependency and stack analysis is based on what a repo *declares* (package.json, requirements.txt, go.mod, etc.) via the GitHub API — it doesn't install anything or resolve the actual dependency tree (lockfile, node_modules, transitive packages). A dependency that's missing from the manifest but present transitively (or vice versa) won't be caught; the diagnosis reflects declared state, not resolved state.

## The medical metaphor

The design system carries the diagnosis concept through the whole product, not as decoration but because the metaphor is accurate to what the tool does: examine, diagnose, prescribe. A codebase is a living thing that accumulates conditions over time, and most teams only look when something hurts. SustainRx is the checkup.

## Stack

- React, TypeScript, Tailwind CSS
- Firebase (auth and data layer)
- GitHub OAuth
- Claude API for analysis
- Stripe for subscription billing
- Deployed on Vercel

## Lineage

SustainRx grew out of an earlier concept called GitStory, a narrative layer over a codebase's history. SustainRx expanded that into a full analysis product. A later project, Vestige, strips the concept back down to its sharpest single job, the git historian, and reuses patterns proven here: the UI foundation, the GitHub integration, the notification system, and the loading and error handling.

## Why I built it

I came to software from the trades: I ran a stone fabrication shop and maintained industrial automation before retraining as a frontend developer. In that world, equipment gets inspected on a schedule because failures are expensive and predictable. Codebases deserve the same discipline, and most teams do not have a tool that makes the inspection cheap. SustainRx is that tool.

---

Built by Mitchell Leahy. Portfolio: [mleahy.dev](https://mleahy.dev)
