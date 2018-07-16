Projet 3 - Création d'un site pour le Lab'O

## Description :

Création d'un site web, utilisable sur tablette, pour faciliter la gestion de la remise des clefs par les membres du Lab'O et de la Pépinière.
Projet de 8 semaines, 10h / semaine.
Groupe de 5 personnes.

## Problématiques client :

À ce jour, toute personne souhaitant louer une salle, se doit de passer par l’accueil du Lab’O afin de noter sur le formulaire papier:

  - Initiales de la personnes présente à l’accueil ou son nom
  - La date du jour
  - La salle sélectionnée
  - Nom, Prénom
  - Cocher la case “clefs remises”
  - Formation SSI
  - Doubles clefs
  - Signature

## Cahier des charges :

Le site doit être optimisé pour tablette, et remplacer le systeme papier.

De plus, le client souhaite :
  - Enregistrer un délai d’utilisation de la salle
  - Envoi par mail de notification en cas de dépassement du délai d’utilisation (enregistrement de la date de remise des clefs)
  - Page d’administration permettant de monitorer les salles disponibles et celles occupées, et de cocher une fois la remise des clefs faite après utilisation. Laisser un champ commentaire libre par salle avant la remise des clefs, et après la remise.
La possibilité de signer le formulaire directement sur la tablette

## Propositions de l'équipe qui ont été réalisées :

  - Gestion d'une liste d'équipements, associable à la réservatino de la salle, ou prennable séparement.
  - Possibilité d'ordonner le personnel / équipement par ordre d'importance.
  - Les champs "Formation SSI", "Double des clefs" se gèrent automatiquement en fonction de l'heure de la réservation et de la salle louée.
  - Archivage automatique des reservations lors de leurs clotures. Celle-ci sont supprimées automatiquement au bout de 3 mois (RGPD)

## Buts recherchés :
  - Apprentissage du travail en groupe via l'utilisation de GitHub :
      - Mise en place de la méthode de travail agile SCRUM (Un membre de l'équipe devient Product Owner chaque semaine, et anime les réunions journalières).
      - Mise en place d'une méthode de travail branche_en_cours -> dev -> master controlée par le PO.
      
  - Gestion de projet : 
      - Création d'un Wireframe pour recueillir les avis clients sur l'agencement du site.
      - Rétrospective hebdomadaire devant le client du travail effectué.
      - Animation des réunions avec le client, et reccueil de ses besoins lors des réunions, pour présenter à la fin de chaque sprint l'avancé du projet au client.
      
  - Technique :
      - Utilisation Symfony 3.4.
      - Utilisation de Webpack (SCSS, JS, jQuery, Bootstrap 3.3.7).
      - Utilisation du moteur de template "Twig".
      - Utilisation de bundles : Vish Uploader, Swift Mailer.
      - Utilisation de Cron, pour automatiser l'envoie de mails.


Lab'O project
========================

The Lab'O project is a web application for the management of equipment loans and their return. The application
can collect the loan details and the signature and agree on a date of return of the equipment. After a restitution, the 
summary of the loan remains stored in archive for a period of three months before being deleted
automatically. If the date of return is not respected, an automatic email is sent after a period of
24h, every day until the return of the equipment.  

The application's developpers : Anthony Sottejeau, Clément Paquin, Julia Limousin, Anthony Pointu, Quentin Picart.

System requirements
-------------------

* PHP 7.1;
* Web-server (Apache or Nginx);
* Database (MySQL/MariaDB or PostgreSQL);
* composer https://getcomposer.org/doc/00-intro.md
* npm https://www.npmjs.com/get-npm

How To Use
----------

To clone and run this project, you'll need Git, Composer, NPM and Crontab. From your command line:

*Clone this repository*
gitclone https://github.com/WildCodeSchool/orleans-0218-labo.git

*Go to the project repertory*
cd orleans-0218-labo

*Install dependencies*
Before you continue, you must authorize you computer to connect to your mail account.
Connect to a gmail account and go to "google account". Click on "connect to google validation in two steps", click on 
"start", click on "next".
Then you must authentificate yourself with your mobile phone, and write the code you will receive.
Click on "next", and activate.
You will receive a confirmation message on your mobile phone.
You have to go back on your google account and go to connection and security and click on "connect to google".
Click on "applications's password" (you have none yet). Approve the connection to the mobile phone, 
select "other (personnalised name)", then generate.
The generated password must be kept for the composer installation.

1) How to install composer :
composer install (cli)
Press enter for parameters : database_host, database_port
Choose a name for database_name, then press enter.
Chooser a name for database_user, or keep default name (root), then press enter.
Enter your database password and press enter.
Enter "gmail" in mailer_transport parameter, press enter.
Enter "smtp.gmail.com" in mailer_host parameter, press enter.
Enter an email address in mailer_user parameter, press enter.
You have to fill mailer_password parameter with the previously generated password.
For mailer_mail, do the same as with the mailer_user parameter, then press enter.
Finally, press enter to keep the secret parameter default.

2) How to install npm:
npm install (cli)

3) Use crontab (in the cli)
crontab -e 
00 10 * * * php {path to project}/orleans-0218-labo/bin/console app.mailAuto

*Compile Webpack for CSS and JS*
./node_modules/.bin/encore production (cli)

*Initiate Project*
php bin/console doctrine:database:create (cli)
php bin/console doctrine:schema:update --force (cli)

*Launch Server PHP*
php bin/console server:run or configure a web server (apache, nginx, ...).
