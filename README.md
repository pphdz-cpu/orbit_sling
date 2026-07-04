# Orbit Sling

Fast-paced 2D mobile physics arcade game. The player controls a continuously moving comet and uses centripetal force to swing from static planets to gain altitude.

## Technical Specifications

| Area | Choice |
|------|--------|
| Engine | Unity 2D Core |
| Logic | C# MonoBehaviour scripts |
| Physics | Native `Rigidbody2D` + `DistanceJoint2D` / `HingeJoint2D` tethering |
| Camera | Orthographic, continuously moving upward on the Y-axis |

## Core Scripts

| Script | Role |
|--------|------|
| `CometController.cs` | Continuous upward force, tether input, release trajectory |
| `Planet.cs` | Static anchor points for Joint2D connections |
| `GameManager.cs` | Score, win/loss states, screen boundary limits |
| `CameraController.cs` | Upward-scrolling orthographic camera |

All scripts live under `Assets/Scripts/`.

## Scene Setup (Unity Editor)

1. Create a **2D Core** project (or open this repo in Unity 2022.3+).
2. Add an empty GameObject with `GameManager` and wire the comet + camera references.
3. Create the **Comet** prefab:
   - `Rigidbody2D` (Dynamic), `CircleCollider2D`, `CometController`
4. Create **Planet** prefabs:
   - `Rigidbody2D` (Static), `CircleCollider2D`, `Planet`
   - Tune `Tether Radius` and `Tether Break Distance` in the Inspector
5. Assign the Main Camera's `CameraController` and set `Target` to the comet.
6. Hook `GameManager` UnityEvents to UI (score label, game over / win panels).

## Controls

- **Hold** touch / mouse / Space near a planet → tether and swing
- **Release** → detach with boosted momentum along the current trajectory

## Win / Loss

- **Win:** reach the configured altitude target (`winAltitude` on GameManager)
- **Loss:** fall below the rising camera floor (`fallDeathOffset`)
