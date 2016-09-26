# serverless-plugin-stack-outputs
Displays stack outputs for your serverless stacks

# Installation
Install the package: `npm install serverless-plugin-stack-outputs`
Add it to your plugin list in `serverless.yml`:

```yaml
plugins:
  - serverless-plugin-stack-outputs
```

And it will automagically work. Whenever you call `info` or `deploy`, the outputs will be appended to output

# Usage
```bash
sls info
```

```bash
sls deploy
```

# Example
