'use strict';

var Q                   = require('q'),
    _                   = require('underscore'),
    path                = require('path'),
    del                 = require('del'),
    Container           = require('../../index'),
    backupFileServer    = require('../../../sysadmin/backup-file-system'),
    models              = require(path.resolve(__dirname, '../../../models'));

function RestorePackage () {

}

/**
 * Backup a package
 * @param {string} tag - Screenshot tag
 * @returns {Bluebird.Promise|*}
 */
RestorePackage.prototype.execute = function (tag) {
    var self = this;

    return this.getScreenshots(tag)
        .then(function (packageScreenshot) {
            var volumes = JSON.parse(packageScreenshot.volumes);
            return _.reduce(volumes, function (prevPromise, containerDirBinds) {
                return prevPromise.then(function () {
                    return self.restoreFiles(containerDirBinds);
                });

            }, Q.when(true));
        })
    ;
};

/**
 * Return package column row
 * @param {string} tag - Package hostname
 * @returns {Bluebird.Promise|*}
 */
RestorePackage.prototype.getScreenshots = function (tag) {
    return models
        .PackageScreenshot
        .find({
            where: {tag: tag}
        }).then(function (packageScreenshot) {

            if (!packageScreenshot) {
                return Q.reject('Tag ' + tag + ' does not exists!');
            }

            return Q.resolve(packageScreenshot);
        })
    ;
};

/**
 * Restore files
 * @param {Array} containerDirBinds
 * @returns {*}
 */
RestorePackage.prototype.restoreFiles = function (containerDirBinds) {
    return _.reduce(containerDirBinds, function (prevPromise, volume) {

        return prevPromise.then(function () {

            del.sync([volume.hostPath + '/*']);
            return backupFileServer.restore(volume.backupId, volume.hostPath);

        });

    }, Q.when(true));
};

module.exports = RestorePackage;
