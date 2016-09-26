# serverless-plugin-stack-outputs
Displays stack outputs for your serverless stacks

# Installation
Install the package:
```bash
npm install serverless-plugin-stack-outputs
```

Add it to your plugin list in `serverless.yml`:

```yaml
plugins:
  - serverless-plugin-stack-outputs
```

And it will automagically work. Whenever you call `sls info` or `sls deploy`, the outputs will be appended to output. You can also only get the outputs via `sls info outputs`.

# Example
![Example](https://raw.githubusercontent.com/svdgraaf/serverless-plugin-stack-outputs/master/docs/example.gif)
