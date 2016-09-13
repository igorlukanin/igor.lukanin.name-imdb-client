var config = require('config'),
    imdb = require('omdb'),
    Promise = require('bluebird'),
    rmrf = Promise.promisify(require('rimraf')),

    git = require('./git'),
    yaml = require('./yaml'),

    directory = config.get('repo.directory'),
    configFile = config.get('repo.config_file'),
    configPath = directory + configFile,
    configEntry = config.get('repo.config_entry'),
    moviesFile = config.get('repo.movies_file'),
    moviesFullFile = config.get('repo.movies_full_file'),
    moviesPath = directory + moviesFile,
    moviesFullPath = directory + moviesFullFile,
    url = config.get('repo.url'),
    remote = config.get('repo.remote'),
    branch = config.get('repo.branch'),
    message = config.get('repo.message'),
    author = config.get('repo.author'),
    email = config.get('repo.email'),

    updateInterval = config.get('update_interval_minutes') * 60 * 1000 /* milliseconds */;


var updateViaImdb = movie => {
    if (movie.link && movie.link.indexOf('http://www.imdb.com/title/tt') == 0) {
        return new Promise(resolve => {
            var id = movie.link.replace('http://www.imdb.com/title/', '').replace('/', '');

            imdb.get(id, (err, info) => {
                movie.title = info.title;
                movie.release_year = info.year.from ? info.year.from : info.year;
                movie.director = info.director;
                movie.writers = info.writers;
                movie.actors = info.actors;
                movie.poster = info.poster;
                movie.imdb_rating = info.imdb.rating;

                resolve(movie);
            });
        });
    }
    else {
        return movie;
    }
};

var update = () => {
    var movies = rmrf(directory)
        .then(() => git.clone(url, directory))
        .then(() => yaml.read(moviesPath))
        .then(movies => Promise.all(movies.map(updateViaImdb)))
        .then(movies => {
            const currentYear = new Date().getUTCFullYear();
            const moviesThisYear = movies.filter(movie => movie.date.getUTCFullYear() == currentYear);
            yaml.updateKey(configPath, configEntry, moviesThisYear.length);

            yaml.write(moviesFullPath, movies);

            return movies;
        })
        .then(() => git.add(directory, configFile))
        .then(() => git.add(directory, moviesFullFile))
        .then(() => git.commit(directory, author, email, message))
        .then(() => git.push(directory, remote, branch))
        .then(() => {
            console.log('Movies updated.')
        })
        .catch(err => {
            console.log('Movies not updated.');
            console.log(err);
        });
};

update();
setInterval(update, updateInterval);