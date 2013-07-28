Salonrama
=========

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



php app/console assets:install --symlink web

php app/console doctrine:database:create
php app/console doctrine:schema:update --dump-sql
php app/console doctrine:schema:update --force

php composer.phar update

php app/console doctrine:generate:entities SalonramaMainBundle

php app/console cache:clear