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

For multiple paths:

```yaml
steps:
- checkout: none

- task: SelectiveCheckout@0
  inputs:
    pathsToCheckout: |
      path/to/download/1
      path/to/download/2
```

If a shallow clone is not wanted:

```yaml
steps:
- checkout: none

- task: SelectiveCheckout@0
  inputs:
    pathsToCheckout: 'path/to/download'
    fetchDepth: 0 # The same semantics as the normal checkout task.
```

## Limitations

- Only Github and Azure Devops repositories are supported.
- No multiple repository support.
- No Team Foundation Version Control (TFVS) support.

If you need more features, feel free to contact me.
