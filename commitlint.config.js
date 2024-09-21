module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "ci",
        "chore",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "assets",
        "test",
      ],
    ],
    "type-case": [2, "always", "lower-case"],
    "subject-empty": [2, "never"],
    "subject-case": [0, "never", []], // Allow any case for the subject
  },
};
