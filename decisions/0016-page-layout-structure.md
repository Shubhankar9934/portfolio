# 0016: Page layout structure

- Status: Accepted
- Date: 2026-11-03
- Phase: 1
- Decided by: user (request: "structure the layout of page"); Claude chose the concrete structure

## Context
The page was a stack of sections, but each section wrote its own markup: its own `<section>`, heading, and spacing rules, with spacing applied through a `main section` selector. Adding or reordering sections meant copying that markup, and the header nav had to be kept in step by hand.

## Decision
- Every content section is rendered through one `Section` component (`web/src/components/Section.tsx`). It gives each section the same structure: `<section id aria-labelledby>`, a `<header>` with the `<h2>` and an optional intro line, then a `section-body` wrapper.
- Spacing uses a `.section` class instead of a `main section` selector.
- Page order is fixed in `web/src/App.tsx`: Projects, Skills, Experience & education, then the footer. The header nav links follow the same order.
- No new sections are added. A Hero/About section stays out of scope, as ADR-0005 decided.

## Consequences
- A new section is one `<Section id title>` element and a nav link.
- Section headings, spacing, and the `id` and `aria-labelledby` pairing are kept consistent by one component.
- Section order and nav order are still maintained by hand; they are not generated from a list.
- Visual output is unchanged apart from minor spacing differences, which were not re-screenshotted (see the light-theme follow-up in `tasks.md`).

## Alternatives considered
- A CSS grid or sidebar layout: more visual change than the request needed, and it would touch the phone layout.
- A config-driven section list that generates both the page and the nav: useful once there are many sections; premature for three.
