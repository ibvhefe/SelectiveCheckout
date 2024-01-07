# Selective Checkout for Azure DevOps

This extension contains a pipeline task that allows for *slim* git checkouts.
You can select what folders you want to download.
This keeps your traffic low and your build times fast.

## Usage

```yaml
steps:
- checkout: none

- task: SelectiveCheckout@0
  inputs:
    pathsToCheckout: 'path/to/download'
```

Besides *pathsToCheckout*, *fetchDepth* is also supported.

## Limitations

- Only Github and Azure Devops repositories are supported.
- No multiple repository support.
- No Team Foundation Version Control (TFVS) support.
