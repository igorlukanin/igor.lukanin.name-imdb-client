This script periodically updates my [personal website](http://igor.lukanin.name) with movies I've watched, converting [IMDB links](https://github.com/igorlukanin/igor.lukanin.name/blob/gh-pages/_data/movies.yml) to [complete movie metadata](https://github.com/igorlukanin/igor.lukanin.name/blob/gh-pages/_data/movies-full.yml) using [The Open Movie Database](http://www.omdbapi.com) API.

### How it works

1. Clone my static [Jekyll](http://jekyllrb.com)-powered website's [repo](https://github.com/igorlukanin/igor.lukanin.name)
2. Retrieve links to movies from a [YAML file](https://github.com/igorlukanin/igor.lukanin.name/blob/gh-pages/_data/movies.yml)
3. Get metadata for each movie via OMDB API and put it to another [YAML file](https://github.com/igorlukanin/igor.lukanin.name/blob/gh-pages/_data/movies-full.yml)
4. `git add` + `commit` + `push`
5. The website automatically redeploys thanks to Github's support for Jekyll
