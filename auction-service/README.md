# Base Serverless Framework Template

#### Serverless dependencies

##### `serverless-pseudo-parameters`

Define variables inside `serverless.yml` file.

Examples:

- `#{AWS::Region}`
- `#{AWS::AccountId}`

#### `serverless-bundle`

Needed in order to use `webpack` and create and optimized bundle that has to be deployed into lambda function.

#### Logs

See CloudWatch logs in terminal:

```bash
sls logs -f processAuctions -t
sls logs -f processAuctions --startTime 1h
```

Notation:

- `-t = -time` from now on
- `--startTime 1h` from 1h ago to now

#### Invoke function in terminal

```bash
sls invoke -f processAuctions -l
```

Notation:

- `-f = -function`
- `-l = -logs` to see the logs

## What's included

- Folder structure used consistently across our projects.
- [serverless-pseudo-parameters plugin](https://www.npmjs.com/package/serverless-pseudo-parameters): Allows you to take advantage of CloudFormation Pseudo Parameters.
- [serverless-bundle plugin](https://www.npmjs.com/package/serverless-pseudo-parameters): Bundler based on the serverless-webpack plugin - requires zero configuration and fully compatible with ES6/ES7 features.

## Getting started

```
sls create --name YOUR_PROJECT_NAME --template-url https://github.com/codingly-io/sls-base
cd YOUR_PROJECT_NAME
npm install
```

You are ready to go!
