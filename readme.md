# Readme

ATTENTION: voir la section Database vers la fin de ce document
pour une mise à jour importante.

Install it:
```
git clone https://github.com/millette/docza.git
cd docza
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
et comme ```libmozjs185-dev``` en dépend, il n'est pas nécessaire de
l'ajouter manuellement.

La version Debian Stable de Erlang fonctionne bien, pas besoin d'installer une
autre source de paquets.

Install redis server:
```
sudo aptitude install -t jessie-backports redis-server
```

Version 3.2.5 with jessie-backports; 2.8.17 with jessie.
Only tested with the backport.

This will also install redis-cli. To see that it works,
open a terminal and type to see its activity:
```
redis-cli monitor
```

CTRL-C when you're satisfied it works.

Install NodeJS and n, the node version manager:
```
curl -L https://git.io/n-install | bash
```

This will install node 7.0 (stable) for your user. We're currently
using node 4.x, but node 6 (lts) and 7 should also work, so

```
n lts # installs version 6.9.1 and switch to that version
n 4.6.2 # install and switch to node 4.6.2
```

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
firefox http://localhost:8099/
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

### Web dependencies
Uses [Foundation][] for its css.

Uses [medium-editor][] for the wysiwyg editor.

### Server dependencies
* [HapiJS][] (instead of express or koa)
* [sharp][] (instead of ImageMagick)

### Project structure
```
docza
├── assets
│   ├── css
│   │   └── vendor
│   ├── img
│   └── js
│       └── vendor
├── ddoc
│   └── app
│       └── views
│           └── menu
├── plugins
│   └── login
├── server
│   ├── main
│   └── web
├── templates
│   └── partials
└── test
    ├── plugins
    │   └── login
    └── server
        └── web
```

Static files (css, images and client JavaScript) go under assets in
their respective directories.

Custom plugins (only login for now) go in plugins.

Main files (routes, etc.) go in server subdirectories. server/web holds
the routes to the static files. server/main is where most of the application happens.

Direct templates go in templates and bits of templates (chunks, blocks, partials)
go in partials.

Finally, all the unit tests are in subdirectories reflecting the main directory structure.

## Database

Il faut maintenant créer le document avec l'id spécial "_design/app".
Notez qu'il faut être un admin pour gérér les *design docs*.

Ajoutez les lignes suivantes à votre fichier .env:

```
DBADMIN=[Votre admin username]
DBPASSWORD=[Password de l'admin]
```

Le Design Doc de CouchDB sera mis à jour à partir du répertoire ddoc/app/
selon la structure de fichiers conventionnelles. Voir [couchdb-compile][]
pour les détails.

[Foundation]: <http://foundation.zurb.com/sites/docs/>
[medium-editor]: <https://github.com/yabwe/medium-editor>
[sharp]: <http://sharp.dimens.io/en/stable/api/>
[HapiJS]: <http://hapijs.com/>
[couchdb-compile]: <https://github.com/jo/couchdb-compile#the-couchdb-directory-tree>
