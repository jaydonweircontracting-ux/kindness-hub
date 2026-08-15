# ASHFALL — Job Protocol

## Every job follows

SPECIFICATION -> IMPLEMENTATION -> UNIT TEST -> INTEGRATION TEST -> BENCHMARK ->
DOCUMENT -> COMMIT -> NEXT JOB

## A job record must contain

```text
JOB ID
NAME
OBJECTIVE
SCOPE
NON-GOALS
DEPENDENCIES
FILES
IMPLEMENTATION
TESTS
BENCHMARK
SUCCESS CRITERIA
STATUS
```

Job records live in `docs/jobs/JOB-XXX-name.md`.

## Statuses

PLANNED, IN_PROGRESS, BLOCKED, IMPLEMENTED, TESTED, BENCHMARKED, APPROVED,
DEPRECATED.

## Completion states — do not confuse them

- DESIGNED: documented.
- PLANNED: scheduled.
- IMPLEMENTED: code exists.
- TESTED: automated tests pass.
- BENCHMARKED: performance measured where appropriate.
- APPROVED: accepted by the product owner.

## Scope discipline

Do not overbuild: implementing chunk storage does not mean also implementing
factions, combat, quests, weather or economy.

Do not underbuild: compiling is not completion. A job must satisfy its
implementation, tests, integration, documentation and success criteria.

## Failure handling

Identify the smallest responsible subsystem and fix only that. Reproduce,
isolate, write a regression test, fix, run related tests, run all tests,
document if architectural.

## Architecture changes

Never silently change major architecture. Write an ADR in `docs/decisions/`
covering DECISION, REASON, ALTERNATIVES, CONSEQUENCES — and get approval.