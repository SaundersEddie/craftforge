# CraftForge

CraftForge is a product launch system for makers.

It helps turn real product notes for handmade, 3D printed, laser, CNC, and woodworking products into practical launch materials: listing copy, social posts, photo checklists, and improvement notes.

The first goal is not public SaaS. The first goal is simple:

> Can CraftForge take one real Brindle Besties product and produce a usable launch pack in under 10 minutes?

## Current status

Early v0.1 foundation.

## Core v0.1 workflow

```txt
Add product → Save product → Generate launch pack → Review health score → Use for real listing
```

## MVP features

- Product library
- Product create form
- Product detail page
- Saved launch packs
- Listing health score
- Launch pack generator placeholder
- AI generation later, after the core workflow works

## Not in v0.1

- Authentication
- User accounts
- Stripe billing
- Public SaaS launch
- Image uploads
- R2 storage
- Etsy API integration
- Social scheduling
- Agent mode

New ideas go to Backlog or Icebox, not directly into Today.

## Stack

- Astro
- Cloudflare Pages
- Cloudflare Pages Functions / Workers
- Cloudflare D1
- TypeScript
- GitHub Projects

## Project structure

```txt
craftforge/
  src/
    pages/
    components/
    lib/
  migrations/
  docs/
```

## Core principle

CraftForge should feel like it understands maker reality better than generic AI tools.

Generic AI asks:

> What do you want to write?

CraftForge asks:

> What are you making, what is it made from, how long does it take, what can go wrong, and where are you selling it?
