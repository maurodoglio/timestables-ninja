# 🥷 Times Tables Ninja

Learn times tables like a ninja! A kid-friendly web app where elementary students
practise multiplication inside a martial-arts dojo: join as a white-belt novice,
train, pass gradings, and climb all the way to **Ninja Master**.

Everything runs in the browser. No accounts, no server, no data ever leaves the
device — safe to use in a classroom.

## The belt ladder

Each belt introduces new tables. A grading always covers the new tables **plus**
everything already earned, so earlier facts keep coming back.

| Belt | Tables introduced |
| --- | --- |
| White | 1, 2, 10 |
| Yellow | 5 |
| Orange | 3 |
| Green | 4 |
| Blue | 6 |
| Purple | 8 |
| Brown | 7 |
| Red | 9 |
| Black | 11, 12 |
| Ninja Master | all 1–12 plus division facts |

A grading is 25 questions with a per-question time limit that tightens at higher
belts. You pass with **at least 90% correct** *and* an average answer time under
the belt's target. Gradings can be retaken freely, and a belt is never lost.

## Training modes

- **🏯 Training Hall** — practise any unlocked table, your choice of length, timer optional.
- **🎯 Weak Stances** — an untimed drill built automatically from the facts you miss most or answer slowest.
- **⚡ Sparring** — 60 seconds, as many correct answers as you can, with a personal best.
- **🥋 Grading** — the belt test.

## How practice adapts

Every fact stores attempts, accuracy, a rolling average response time and a
correct-streak. Those produce a mastery level (`unseen → learning → solid →
mastered`) that weights question selection, so struggling facts appear far more
often and mastered ones resurface just enough to stay sharp.

## Kid-friendly by design

- Big tap targets and an on-screen keypad, plus full physical-keyboard support.
- Wrong answers are calm: the correct fact is shown and the question is requeued.
- Timer bar can be hidden, motion can be reduced, and a more readable font is available.
- Progress can be exported to a JSON "ninja scroll" and restored on another device.

## Development

```bash
npm install
npm run dev      # start the dev server
npm test         # run the unit tests
npm run build    # type-check and build to dist/
```

Pure game logic lives in `src/game` (belts, question selection, scoring) and
`src/state` (persistence, sessions, achievements); it has no React dependencies
and is covered by unit tests. React screens and components sit on top.

## Deployment

The app builds to plain static files (`npm run build` → `dist/`) and uses hash
routing, so it can be served from any static host or sub-path.

GitHub Pages deployment via GitHub Actions is not yet wired up: adding workflow
files requires a token with the `workflow` scope. To enable it, add a workflow
that runs `npm ci && npm test && npm run build` with
`VITE_BASE=/<repository-name>/` and publishes `dist/` using
`actions/upload-pages-artifact` and `actions/deploy-pages`, then set the Pages
source to "GitHub Actions" in repository settings.
