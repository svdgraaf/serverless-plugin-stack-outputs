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

    this.hooks = {
      'after:deploy:deploy': this.outputStackOutput.bind(this),
      'after:info:info': this.outputStackOutput.bind(this),
    };
  },

  outputStackOutput: function() {
    const stackName = `${this._serverless.service.service}-${this._opts.stage}`;

    // get all the outputs from AWS
    this._SDK.request('CloudFormation',
      'describeStacks',
      {
        StackName: stackName
      },
      this._opts.stage,
      this._opts.region
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
