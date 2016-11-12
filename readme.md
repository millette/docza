# Readme

Install it:
```
git clone https://github.com/millette/glassjaw.git
cd glassjaw
```

Install CouchDB:

* Instructions: https://cwiki.apache.org/confluence/display/COUCHDB/Debian

Dans la section «Add Erlang Solutions repository:», remplacer
```
sudo apt-get install -y libmozjs185 libmozjs185-dev
```

par
```
sudo apt-get install -y libmozjs185-dev
```

Le paquet ```libmozjs185``` n'existe pas, il s'agit de ```libmozjs185-1.0```
et comme ```libmozjs185-dev``` en dépend, il n'est pas nécessaire de l'ajouter manuellement.

Install redis server:
```
aptitude install -t jessie-backports redis-server
```

Version 3.2.5 with jessie-backports; 2.8.17 with jessie.
Only tested with the backport.

This will also install redis-cli. To see that it works,
open a terminal and type to see its activity:
```
redis-cli monitor
```

CTRL-C when you're satisfied it works.


If you don't already have it, install yarn, an npm alternative:
```
npm install yarn -g
```

Why yarn? It's arguably faster than npm and deterministic. In other words,
two npm installs of the same package might not install the same files in
the same places, whereas yarn is designed to be reproducible.

If you're already familiar with npm, have a look at this
[yarn-npm cheat sheet](https://github.com/areai51/yarn-cheatsheet).

Install dependencies:
```
yarn
```

Start it for development, editing files will reload the server:
```
yarn run dev
```

Start it for production, templates are cached:
```
yarn start
```

Launch the browser:
```
firefox http://localhost:8090/
```

What other scripts are available?
```
yarn run
```

See the file ```package.json``` for each script implementation.

To run all tests, linters, etc.
```
yarn run test
```
