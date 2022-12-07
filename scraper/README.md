Utilitaire pour "scraper" les données avion issues de Wikipedia :

- code OACI
- nom en toutes lettres
- photo si disponible

Ces scripts ne sont pas intégrés à la partie Django et sont à exécuter hors ligne.
En effet, les données récupérées méritent d'être "auditées" avant d'être uploadées dans la base de données de Django.

Pour lancer le scraper :

```bash
cd scraper
pipenv install
pipenv run scrapy crawl wikipedia
```

Les données générées sont placées dans le dossier `data/`
