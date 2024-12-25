# Utiliser l'image Python comme image de base
FROM python:3.11

# Installer le client MySQL
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    && apt-get clean

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier requirements.txt dans le conteneur
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source du projet dans le conteneur
COPY . .

# Exposer le port sur lequel votre application s'exécute (par défaut, Django utilise le port 8000)
EXPOSE 8000

# Commande pour exécuter l'application Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
