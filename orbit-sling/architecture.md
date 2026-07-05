# Game Architecture: Orbit Sling

## Overview
"Orbit Sling" is a fast-paced, 2D mobile-style physics arcade game. The player controls a continuously moving comet and uses centripetal force to swing from static planets to gain altitude.

## Technical Specifications
* **Rendering:** HTML5 `<canvas>` element.
* **Logic:** Vanilla JavaScript with a continuous `requestAnimationFrame` game loop.
* **Layout:** A clean, centered mobile-portrait aspect ratio (e.g., 400x600) with a dark space background.

## Core Entities
1. **The Comet (Player):** A small circle. Constantly moves.
2. **The Planets (Anchors):** Static circles scattered on the map.
3. **The Tether:** A line drawn between the comet and the nearest planet when the player holds the screen.

## Phase 1 Goal
Setup a responsive HTML5 canvas, link the CSS and JS files, and establish a basic 60fps rendering loop that clears and redraws the screen.

## Phase 2 Goal
Spawn the comet and planets on the canvas. The comet starts near the bottom center and moves continuously upward. Draw 3–5 static planets scattered across the upper portion of the screen each frame using canvas `drawImage()` with assets from `assets/images/`.
