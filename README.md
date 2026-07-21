# FILM!

## Установка

### PostgreSQL

Установите и запустите PostgreSQL, например с помощью Docker:

`docker-compose up -d`

Заполните базу тестовыми данными (из корня проекта):

```
docker exec -i postgres_container psql -U exampleuser -d exampledb < backend/test/prac.init.sql
docker exec -i postgres_container psql -U exampleuser -d exampledb < backend/test/prac.films.sql
docker exec -i postgres_container psql -U exampleuser -d exampledb < backend/test/prac.shedules.sql
```

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости (точно такие же, как в package-lock.json) с помощью команд

`npm ci` или `yarn install --frozen-lockfile`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

- `DATABASE_DRIVER` - тип драйвера СУБД - в нашем случае это `postgres`
- `DATABASE_URL` - строка подключения к PostgreSQL, например `postgres://localhost:5432/films`
- `DATABASE_USERNAME` - имя пользователя БД
- `DATABASE_PASSWORD` - пароль пользователя БД

PostgreSQL должна быть установлена и запущена.

Запустите бэкенд:

`npm run start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.
