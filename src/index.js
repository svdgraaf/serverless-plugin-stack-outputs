'use strict';

const _ = require('lodash');
const Class = require('class.extend');
const chalk = require('chalk');

module.exports = Class.extend({

  init: function(serverless, opts) {
    this._serverless = serverless;
    this._opts = opts;
    this._SDK = null;
    const that = this;

    // find the serverless sdk
    _.forEach(this._serverless.pluginManager.plugins, function(plugin){
      if (plugin.constructor.name == 'AwsInfo') {
        // got the info plugin, hijack it
        that._SDK = plugin.sdk
      }
    })

    // always output when the output command is called
    this.hooks = {
      'info:outputs:output':  this.outputStackOutput.bind(this),
    };

    // on verbose, also output the outputs after deploy, and on info
    if (this._opts.verbose) {
      this.hooks = _.merge(this.hooks, {
        'after:deploy:deploy': this.outputStackOutput.bind(this),
        'after:info:info': this.outputStackOutput.bind(this),
      });
    }

    this.commands = {
      info: {
        lifecycleEvents: [
          'info',
        ],
        commands:{
          outputs: {
            usage: 'Displays stack outputs',
            lifecycleEvents: [
              'output',
            ],
          }
        },
      },
    };
  },

  outputStackOutput: function() {
    // find the correct stage
    var stage = this._serverless.service.defaults.stage;
    if (this._serverless.variables.options.stage) {
      stage = this._serverless.variables.options.stage;
    }

    // find the correct stage
    var region = this._serverless.service.defaults.region;
    if (this._serverless.variables.options.region) {
      region = this._serverless.variables.options.region;
    }

    const stackName = `${this._serverless.service.service}-${stage}`;

    // get all the outputs from AWS
    this._SDK.request('CloudFormation',
      'describeStacks',
      {
        StackName: stackName
      },
      stage,
      region
    ).then((result) => {
      if (result) {
        const outputs = result.Stacks[0].Outputs;

        var msg = `${chalk.yellow.underline('Stack output:')}\n`;
        _.forEach(outputs, function(output){
          msg = msg.concat(`${chalk.yellow(output.OutputKey)}: ${output.OutputValue}\n`);
        });

        this._serverless.cli.consoleLog(msg);
      }
    });
  },
});
