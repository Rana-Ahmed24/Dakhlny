# CLAUDE.md

## Project Goal

Build a FAST production-ready MVP for a North Coast Egypt guest access coordination platform.

This is a MANUAL OPERATOR-BASED SYSTEM.

Admins manually coordinate requests externally using phone calls and WhatsApp.

The goal is:

* Speed
* Stability
* Fast deployment before Eid
* Clean UX
* Easy operations

Do NOT overengineer anything.

---

## Core Concept

The platform has TWO main flows:

1. Request Access
   Users request access to villages.

2. Become a Provider
   Users apply to become providers who can offer guest access.

There are NO fixed user roles.

Any user can:

* Request access
* Become a provider

Admins manually coordinate everything.

Providers are NEVER publicly visible.

Customers NEVER contact providers directly.

---

## Tech Stack

* Next.js 15 App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Supabase

---

## UI Direction

Design should feel:

* Luxury
* Premium
* Coastal
* Modern
* Fast
* Minimal

Avoid generic SaaS appearance.

Color inspiration:

* Deep navy
* Ocean blue
* Sand beige
* White typography

Use:

* Elegant spacing
* Large typography
* Smooth subtle animations
* Beautiful cards
* Mobile-first responsive design

---

## Important Business Rules

* Manual coordination only
* No automated matching
* No realtime systems
* No direct customer-provider communication
* No public provider listings
* No payment integrations for MVP
* No chat systems
* No notifications system

---

## Admin Dashboard

Admin dashboard is the MOST IMPORTANT part of the system.

Dashboard must allow admins to:

* View access requests
* View provider applications
* Approve/reject providers
* Assign providers manually
* Add notes
* Update statuses
* Activate/deactivate providers

Dashboard should feel operational, fast, and easy to use.

---

## Code Requirements

* Production-ready code only
* Reusable clean components
* Proper TypeScript types
* Proper loading states
* Proper error handling
* Proper empty states
* Clean folder structure
* Use environment variables correctly
* Optimize for Vercel deployment

Do NOT leave TODOs.

Do NOT generate placeholders.

Generate COMPLETE implementation files.

---

## DO NOT ADD

* Stripe
* Paymob
* WebSockets
* Realtime systems
* AI features
* Notification systems
* Complex authentication
* Redux unless absolutely necessary
* Microservices
* Messaging systems
* Customer/provider chat systems
* Automated booking systems
* Complex enterprise architecture

---

## Mobile-First Priority

This platform is primarily for mobile users.

Design mobile-first BEFORE desktop.

Most users will come from:

* TikTok
* Instagram
* WhatsApp

Prioritize:

* Fast mobile UX
* Large buttons
* Short forms
* Thumb-friendly interactions
* Sticky CTAs
* Clean mobile layouts

Desktop is secondary.

Keep everything SIMPLE and FAST.
