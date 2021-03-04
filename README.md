# action-oss

[![CI](https://github.com/ShopRunner/action-oss/actions/workflows/ci.yaml/badge.svg)](https://github.com/ShopRunner/action-oss/actions/workflows/ci.yaml)

Open Source Software scanning Github Action. Used to scanning the tools that we Open Source for compliance with our OSS policies. 

## Usage

You can add the action to a workflow below.

```yaml
name: "CI"

on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main

jobs:
  scan:
    name: Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v1
      - name: OSS Scan
        uses: shoprunner/action-oss@main
```

## General Requirements
Below are the requirements that will be enforced. This list is not all-inclusive but should be the primary
requirements.

### Correct Documentation
- `CODE-OF-CONDUCT.md` in root directory, using the preset [template](/dist/templates/docs/CODE-OF-CONDUCT.md)
- `CONTRIBUTING.md` in the root directory (no linting of contents)
- `bug_report.md` in the `.github/ISSUE_TEMPLATE` directory (no linting of contents)
- `feature_request.md` in the `.github/ISSUE_TEMPLATE` directory (no linting of contents)

### Approved License
- [BSD-3-Clause](/dist/templates/licenses/BSD-3-Clause)
- [MIT](/dist/templates/licenses/MIT)

## Gotchas

- **CODE-OF-CONDUCT.md Sensitivity** - The linter is very sensitive, please copy the file verbatim (i.e. don't add whitespace or new lines)

## Attribution

The vast majority of this repository is based on: [https://github.com/auth0/open-source-template](https://github.com/auth0/open-source-template).
