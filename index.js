'use strict';

var gutil = require('gulp-util'),
	through = require('through2'),
	exec = require('child_process').exec,
	_ = require('lodash');

var pluginName = 'gulp-nunit';

function nunit(options) {
	if (!options.command) {
		throw new gutil.PluginError(pluginName, 'command is required');
	}

	var assemblies = [];

	function collectAssemblies(file, enc, callback) {

		assemblies.push(file.path);
		return callback();
	}

	function flushStream() {

		var fail = _.bind(function () {
			this.emit('error', new gutil.PluginError(pluginName, 'tests failed'))
		}, this);
		var end = _.bind(function () {
			this.emit('end');
		}, this);

		if (assemblies.length === 0) {
			this.emit('error', new gutil.PluginError(pluginName, 'assemblies is required'))
			return this.emit('end');
		}

		var commandParamaters = [];

		commandParamaters.push('"' + options.command + '"');
		commandParamaters.push(options.options);
		commandParamaters.push(assemblies.join(' '));


		var cp = exec(commandParamaters.join(' '), [], function (err) {
			if (err) {
				gutil.log(gutil.colors.red('Failed!'));
				fail();
			} else {
				gutil.log(gutil.colors.cyan('Passed!'));
			}
			end();
		});

		cp.stdout.pipe(process.stdout);
		cp.stderr.pipe(process.stderr);
	};

	return through.obj(collectAssemblies, flushStream);
};

module.exports = nunit;
