let fs = require('fs'),
    md5 = require('js-md5');

function Md5WebpackProvider(options) {
    var self = this;

    this.options = options;
    this.setCurrentHash = setCurrentHash;
    this.refreshHashFile = refreshHashFile;

    this.setCurrentHash();

    function setCurrentHash() {
        self.options.hash = getHashFile();

        if (self.options.production && !self.options.old_hash) {
            self.options.old_hash = self.options.hash;
            self.options.hash = getNewHash();
        }
    }

    function refreshHashFile() {
        createHashFile(self.options.hash);
    }

    function getHashFile() {
        if (!fs.existsSync(self.options.path_to_hash)) {
            createHashFile(getNewHash());
        }

        return fs.readFileSync(options.path_to_hash)
    }

    function createHashFile(hash) {
        fs.writeFileSync('version.md5', hash);
    }

    function getNewHash() {
        return md5(Date.now() + 's').substr(20);
    }
}

Md5WebpackProvider.prototype.apply = function (compiler) {
    let self = this;

    compiler.plugin('emit', function (compilation, callback) {
        let assets = compilation.assets;

        self.options.keys = Object.keys(assets);

        self.options.keys.forEach(function (value) {
            var ext = value.split('.').pop();

            if (ext !== 'js' && ext !== 'css') return;

            assets[value.replace('.'+ext, '') + '-' + self.options.hash + '.' + ext] = assets[value];

            delete assets[value];
        });

        compilation.assets = assets;

        callback();
    });

    compiler.plugin('done', function (compilation) {
        if (self.options.production && self.options.keys) {

            self.options.keys.forEach(function (value, index, array) {
                var ext = value.split('.').pop();

                if (ext !== 'js' && ext !== 'css') return;

                var file = './' + value.replace('.'+ext, '') + '-' + self.options.old_hash + '.'+ext;

                if (fs.existsSync(file))
                    fs.unlinkSync(file);
            });

            self.refreshHashFile()
        }

        return true;
    });
};

module.exports = Md5WebpackProvider;