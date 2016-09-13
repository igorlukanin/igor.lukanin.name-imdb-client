var fs = require('fs'),
    yaml = require('yaml-js');


var read = function(path) {
    return yaml.load(fs.readFileSync(path));
};

var readKey = function(path, key) {
    var data = read(path);
    return data[key];
};

var write = function(path, data) {
    return fs.writeFileSync(path, yaml.dump(data));
};

var updateKey = function(path, key, value) {
    var data = read(path);
    data[key] = value;
    return write(path, data);
};


module.exports = {
    read,
    write,
    readKey,
    updateKey
};