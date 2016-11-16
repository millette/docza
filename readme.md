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
│   ├── img
│   └── js
│       └── vendor
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
Ajoutez ce contenu pour notre index secondaire (le menu):

```
{
   "_id": "_design/app",
   "language": "javascript",
   "views": {
       "menu": {
           "map": "function(doc) {\n  var weight\n  var obj = { path: '/' + doc._id }\n  if (doc.weight) {\n    weight = parseInt(doc.weight, 10)\n  } else {\n    weight = 999\n  }\n  if (doc.menu_title) {\n    obj.title = doc.menu_title\n  } else if (doc.title) {\n    obj.title = doc.title\n  }\n  if (!obj.title) { return }\n  if (doc._attachments) {\n    if (doc._attachments['top-image-1.jpeg']) {\n       obj.img = obj.path + '/top-image-1.jpeg'\n    } else if (doc._attachments['top-image-1.png']) {\n       obj.img = obj.path + '/top-image-1.png'\n    }\n  }\n  emit(weight, obj)\n}"
       }
   }
}
```

Alternativement, on peut créer le ```view``` dans futon.

Visitez http://localhost:5984/_utils/database.html?pizzaloca/_temp_view

Copiez dans View Code:

```
function(doc) {
  var weight
  var obj = { path: '/' + doc._id }
  if (doc.weight) {
    weight = parseInt(doc.weight, 10)
  } else {
    weight = 999
  }
  if (doc.menu_title) {
    obj.title = doc.menu_title
  } else if (doc.title) {
    obj.title = doc.title
  }
  if (!obj.title) { return }
  if (doc._attachments) {
    if (doc._attachments['top-image-1.jpeg']) {
       obj.img = obj.path + '/top-image-1.jpeg'
    } else if (doc._attachments['top-image-1.png']) {
       obj.img = obj.path + '/top-image-1.png'
    }
  }
  emit(weight, obj)
}
```

Puis Save As:

* Design document: _design/app
* View name: menu


Une prochaine étape gèrera les changements au *design doc* automatiquement.

[Foundation]: <http://foundation.zurb.com/sites/docs/>
[medium-editor]: <https://github.com/yabwe/medium-editor>
[sharp]: <http://sharp.dimens.io/en/stable/api/>
[HapiJS]: <http://hapijs.com/>
