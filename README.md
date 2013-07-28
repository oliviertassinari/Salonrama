Salonrama
=========

Conventions
--------------------------------------

HTML : 
<br>

CSS : 
minuscule
séparateur : -
anglais

Noms des fichiers static et chemin :
minuscule
séparateur : _
anglais

BDD :
minuscule
séparateur : _
anglais

Commandes
--------------------------------------

Ressources statics

```bash
php app/console assets:install --symlink web
```

Mise à jour de la base de donnée

```bash
php app/console doctrine:database:create
php app/console doctrine:schema:update --dump-sql
php app/console doctrine:schema:update --force
```

Mise à jour des bundles

```bash
php composer.phar update
```

Générer les getters et setters

```bash
php app/console doctrine:generate:entities SalonramaMainBundle
```

Vider le cache

```bash
php app/console cache:clear
```