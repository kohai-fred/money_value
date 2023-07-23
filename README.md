# MoneyValue Conversion Monétaire

Bienvenue dans le projet MoneyValue, une toute nouvelle startup dans le domaine de la finance qui développe une
plateforme de conversion monétaire. Ce projet vise à créer une API REST permettant aux développeurs d'effectuer des
conversions entre différentes devises. De plus, nous avons également développé une interface d'administration pour gérer
les devises disponibles.

###### Infos:

La partie backend (api) et la partie frontend (admin) sont totalement indépendantes. Vous trouverez ci-dessous le pas à
pas séparé pour chacune des parties.

### Commande Git Clone

Pour récupérer le code source du projet, utilisez la commande suivante :

```bash
git clone https://github.com/kohai-fred/money_value.git
cd money_value
```

---

### <u>Backend (API) :</u>

La partie backend du projet MoneyValue est une API REST qui permet de convertir des devises en d'autres devises et
acquérir des données sur les conversions les plus demandées.

#### Prérequis

Assurez-vous d'avoir Docker et Docker Compose installés et à jour sur votre système.

#### Installation

Suivez les étapes ci-dessous pour mettre en place l'API sur votre environnement local.

1. Accédez au répertoire de l'API :

```bash
cd api
```

2. Installez les dépendances de l'API en exécutant la commande :

```bash
composer require laravel/sail --dev
```

3. **Configurer un alias Shell pour Sail** (facultatif) :

Par défaut, les commandes Sail sont invoquées en utilisant le script vendor/bin/sail inclus avec toutes les nouvelles
applications Laravel :

```bash
./vendor/bin/sail up
```

Cependant, au lieu de taper à chaque fois `vendor/bin/sail` pour exécuter les commandes Sail, vous pouvez configurer un
alias shell qui vous permet d'exécuter plus facilement les commandes de Sail :

```bash
alias sail='[ -f sail ] && sh sail || sh vendor/bin/sail'
```

Pour vous assurer que cet alias est toujours disponible, vous pouvez l'ajouter à votre fichier de configuration shell
dans votre répertoire personnel, tel que ~/.zshrc ou ~/.bashrc, puis redémarrer votre shell.

Une fois que l'alias shell a été configuré, vous pouvez exécuter les commandes Sail en tapant simplement `sail`. Les
exemples du reste de cette documentation supposeront que vous avez configuré cet alias.

4. Lancez l'environnement de développement à l'aide de Docker :

```bash
sail up
```

5. Générez la clé de l'application Laravel :

```bash
sail artisan key:generate
```

6. Copiez le fichier `.env.example` et renommez-le en `.env`. Ensuite, modifiez les informations de connexion à la base
   de données dans le fichier `.env` comme suit :

```bash
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=api
DB_USERNAME=sail
DB_PASSWORD=password
```

7. Exécutez les migrations et les seeders pour créer la base de données avec des données de démonstration :

```bash
sail artisan migrate:fresh --seed
```

8. Pour accéder à PHPMyAdmin, vous pouvez visiter l'URL suivante dans votre navigateur :

```
http://localhost:8001
```

Vous pouvez utiliser les informations de connexion suivantes :

```
Username: sail
Password: password
```

---

### <u>Frontend (Admin) :</u>

La partie frontend du projet MoneyValue est une interface d'administration qui permet de gérer les devises mises à
disposition.

#### Installation

Suivez les étapes ci-dessous pour mettre en place l'interface d'administration sur votre environnement local.

1. Accédez au répertoire de l'interface d'administration :

```bash
cd ../admin
```

2. Copiez le fichier `.env.example` et renommez-le en `.env`.

3. Installez les dépendances en utilisant npm :

```bash
npm install
```

4. Compilez les ressources du frontend :

```bash
npm run dev
```

5. Vous pouvez maintenant accéder à l'interface d'administration en visitant l'URL suivante dans votre navigateur :

```
https://127.0.0.1:5173
```
