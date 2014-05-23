'use strict';

var nunit = require('./index');

describe('gulp-nunit', function() {
    describe('when command has not been set', function() {
        var asm;
        beforeEach(function() {
            asm = nunit({});
        });

        it('should throw an exception', function(cb) {
            var error;
            asm.on('error', function(err) {
                expect(err.message).toEqual('command is required');
                cb();
            });
            asm.write();
        })
    });

    describe('when no assemblies have been set', function() {
        var asm;
        beforeEach(function() {
            asm = nunit({
                command: 'unit'
            });
        });

        it('should throw an exception', function(cb) {
            var error;
            asm.on('error', function(err) {
                expect(err.message).toEqual('assemblies is required');
                cb();
            });
            asm.write();
        })
    });
});