'use strict';

var gutil = require('gulp-util'),
    through = require('through2'),
    exec = require('child_process').exec,
    _ = require('lodash');

var pluginName = 'gulp-nunit';

function nunit(options){
    return through.obj(function(file, enc, callback) {
        if (!options.command) {
            this.emit('error', new gutil.PluginError(pluginName, 'command is required'))
            return callback();
        }
        if (!options.assemblies) {
            this.emit('error', new gutil.PluginError(pluginName, 'assemblies is required'))
            return callback();
        }

        var commandParamaters = [];

        commandParamaters.push('"' + options.command + '"');
        commandParamaters.push(options.assemblies.join(' '));
        commandParamaters.push(options.options);

        var fail = _.bind(function() {
            this.emit('error', new gutil.PluginError(pluginName, 'tests failed'))
        }, this);

        var cp = exec(commandParamaters.join(' '), [], function(err) {
            if(err){
                gutil.log(gutil.colors.red('Failed!'));
                fail();
            }else{
                gutil.log(gutil.colors.cyan('Passed!'));
            }

            return callback();
        });

        cp.stdout.pipe(process.stdout);
        cp.stderr.pipe(process.stderr);
    });
};

module.exports = nunit;