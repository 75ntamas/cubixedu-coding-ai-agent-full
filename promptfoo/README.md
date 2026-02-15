# Promptfoo Testing Suite for Coding Assistant

## Overview

This directory contains comprehensive test cases for the Coding Assistant's system prompt using [Promptfoo](https://www.promptfoo.dev/), an open-source tool for evaluating LLM outputs.

## Purpose

The test suite validates:
1. **Scope Enforcement**: Ensures the assistant only answers questions about code in the knowledge base
2. **Response Quality**: Verifies citations, clarity, and completeness
3. **Off-Topic Handling**: Confirms proper rejection of non-coding queries
4. **Edge Cases**: Tests ambiguous queries, multiple results, and partial matches

## Test Categories

### 1. Valid KB Queries ✅
Tests when the knowledge base has relevant code:
- Method explanations
- Code usage examples
- Debugging requests
- Improvement suggestions

### 2. Invalid KB Queries ❌
Tests when code is not in the knowledge base:
- External libraries (React, Node.js)
- Different languages (Python)
- Algorithms not implemented (binary search tree)

### 3. Off-Topic Queries 🚫
Tests non-coding questions:
- Weather, personal advice, general knowledge
- Ensures proper redirection to coding domain

### 4. Edge Cases 🔧
Tests complex scenarios:
- Ambiguous queries
- Very broad queries
- Multiple relevant results

### 5. Response Quality Checks 📊
Validates response requirements:
- Citation accuracy
- No hallucination
- Scope adherence

### 6. Multi-Turn Conversations 💬
Simulates conversation flows:
- Follow-up questions
- Topic switches

## Installation

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key (or other LLM provider)

### Install Promptfoo

```bash
npm install -g promptfoo
```

Or use npx (no installation required):
```bash
npx promptfoo@latest
```

## Configuration

### 1. Set OpenAI API Key

Create a `.env` file in this directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

Or export it in your shell:
```bash
export OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Review Configuration

The [`promptfooconfig.yaml`](promptfooconfig.yaml) file defines:
- System prompt location: `../coding-ai-agent/system-prompt.md`
- LLM provider: `openai:gpt-4o-mini` (configurable)
- Test cases with assertions

## Running Tests

### Run All Tests

```bash
cd promptfoo
promptfoo eval
```

### View Results in UI

```bash
promptfoo view
```

This opens a web interface at `http://localhost:15500` showing:
- Pass/fail status for each test
- LLM responses
- Assertion details

### Run Specific Test Category

Edit [`promptfooconfig.yaml`](promptfooconfig.yaml) and comment out tests you don't want to run.

### Generate Report

```bash
promptfoo eval --output results.json
```

## Test Structure

Each test case includes:

```yaml
- description: "Human-readable test description"
  vars:
    query: "User question"
    kb_results: "Simulated knowledge base results"
  assert:
    - type: contains
      value: "Expected string in response"
    - type: not-contains
      value: "String that should NOT appear"
```

## Assertion Types

Available assertion types:
- `contains`: Response must include the value
- `not-contains`: Response must NOT include the value
- `contains-any`: Response must include at least one value from array
- `is-json`: Response must be valid JSON
- `regex`: Response must match regex pattern
- `javascript`: Custom JavaScript validation function

## Expected Results

### Test Summary
- **Total Tests**: 22
- **Expected Pass Rate**: ~95-100%

### Pass Criteria
A test passes when:
- Valid KB queries receive detailed, cited answers
- Invalid KB queries are politely declined
- Off-topic queries are redirected
- No hallucination occurs
- Citations are accurate

### Failure Investigation

If tests fail:
1. Check the response in the Promptfoo UI
2. Verify the system prompt is correctly loaded
3. Ensure KB results simulation is accurate
4. Adjust assertions if needed (but don't compromise quality)

## Customization

### Change LLM Provider

Edit [`promptfooconfig.yaml`](promptfooconfig.yaml):

```yaml
providers:
  - id: openai:gpt-4o  # or gpt-4, gpt-3.5-turbo
  # OR
  - id: anthropic:claude-3-5-sonnet-20241022
  # OR
  - id: azure:chat:your-deployment
```

### Add New Test Cases

Follow the existing pattern in [`promptfooconfig.yaml`](promptfooconfig.yaml):

```yaml
- description: "Your test description"
  vars:
    query: "Your test query"
    kb_results: "Simulated KB context"
  assert:
    - type: contains
      value: "Expected behavior"
```

### Adjust Temperature

Lower temperature (0.0-0.3) for more consistent responses:

```yaml
providers:
  - id: openai:gpt-4o-mini
    config:
      temperature: 0.1  # More deterministic
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Test System Prompt

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g promptfoo
      - run: cd promptfoo && promptfoo eval
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

## Metrics

Track these metrics over time:
- **Pass Rate**: % of tests passing
- **Scope Violations**: # of tests where assistant answered out-of-scope
- **Hallucinations**: # of tests with fabricated information
- **Citation Accuracy**: % of responses with correct citations

## Maintenance

### When to Update Tests

Update tests when:
- System prompt is modified
- New code modules are added to KB
- New edge cases are discovered
- User feedback reveals gaps

### Test Review Schedule

- **Weekly**: Run full test suite
- **Before Deployment**: Ensure all tests pass
- **After Prompt Changes**: Validate no regressions

## Troubleshooting

### Issue: "Command not found: promptfoo"

**Solution**: Install globally or use npx
```bash
npm install -g promptfoo
# OR
npx promptfoo eval
```

### Issue: "OpenAI API key not found"

**Solution**: Set environment variable
```bash
export OPENAI_API_KEY=your_key_here
```

### Issue: "System prompt not found"

**Solution**: Verify path in config
```yaml
prompts:
  - file://../coding-ai-agent/system-prompt.md
```

### Issue: Tests passing but should fail

**Solution**: Review assertions, ensure they're strict enough
```yaml
# Too lenient
- type: contains
  value: "code"

# Better
- type: contains
  value: "I don't have information about that code in my knowledge base"
```

## Resources

- [Promptfoo Documentation](https://www.promptfoo.dev/docs/intro)
- [Assertion Types](https://www.promptfoo.dev/docs/configuration/expected-outputs)
- [System Prompt Reference](../coding-ai-agent/system-prompt.md)
- [Policy Matrix](../policy-matrix.md)
- [Concept Document](../coding-assistant-concept.md)

## Contributing

When adding tests:
1. Write clear, descriptive test names
2. Cover both positive and negative cases
3. Include realistic user queries
4. Verify assertions are meaningful
5. Document any special test setup

## License

Same as parent project.
