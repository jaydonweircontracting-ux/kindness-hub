# ASHFALL — AI Development Workflow

The repository is the permanent source of truth. No AI session may rely on
previous chat history.

## Every fresh session

1. Read `README.md`.
2. Read `docs/ASHFALL_MASTER_DESIGN.md`.
3. Read `docs/CURRENT_STATE.md`.
4. Read `docs/DEVELOPMENT_ROADMAP.md`.
5. Read `docs/JOB_PROTOCOL.md`.
6. Read the relevant Bible for the current job.
7. Inspect the repository and its history.
8. Determine the actual implementation state — do not trust documentation
   claims that the code contradicts.
9. Implement ONLY the current job.
10. Run tests. Run the headless engine. Benchmark where appropriate.
11. Update `docs/CURRENT_STATE.md` and `docs/CHANGELOG.md`.
12. Write the job record in `docs/jobs/`.
13. Commit with a small, meaningful message (`Job 002 — World Coordinates`).
14. Report and stop.

## Hard rules

- Never invent a new architecture because the current task is difficult.
- Never throw away working systems without a documented reason.
- Never claim something is implemented unless it exists and has been tested.
- Never begin the next job in the same session.
- The AI may recommend, warn and propose. It may not silently redefine the
  game's core vision. The user is the product owner.

## Session handoff

`docs/CURRENT_STATE.md` is the single most important file in the repository. It
must always describe reality at the end of a session.