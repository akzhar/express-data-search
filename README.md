# express-data-search
Веб приложение для поиска информации в Active Directory (аккаунты, группы, компьютеры).

<img src="https://raw.githubusercontent.com/akzhar/express-data-search/main/demo/1.jpg" alt="AD accounts search" title="AD accounts search" width="35%"/>
<img src="https://raw.githubusercontent.com/akzhar/express-data-search/main/demo/2.jpg" alt="'taov' query result" title="'taov' query result" width="35%"/>
<img src="https://raw.githubusercontent.com/akzhar/express-data-search/main/demo/3.jpg" alt="group\ataov accout's details" title="group\ataov accout's details" width="35%"/>
<img src="https://raw.githubusercontent.com/akzhar/express-data-search/main/demo/4.jpg" alt="AD computers search" title="AD computers search" width="35%"/>

Помимо AD, приложение выполняет поиск по данным в формате JSON (принтеры, телефоны).

<img src="https://raw.githubusercontent.com/akzhar/express-data-search/main/demo/5.jpg" alt="Printers search" title="Printers search" width="35%"/>
<img src="https://raw.githubusercontent.com/akzhar/express-data-search/main/demo/6.jpg" alt="Phones search" title="Phones search" width="35%"/>

### Поиск в AD позволяет проверить: 
- залочен ли аккаунт
- истек ли его пароль
- расшифровка атрибута [UserAccountControl](https://devsday.ru/blog/details/11004)
- компьютер по имени пользователя и наоборот
- членство в AD группах (выводит список всех групп, в т.ч. вложенных)
- др. информация из AD (почта, телефон, отдел, должность, руководитель и т.д.)

### В чем польза поиска в AD:
- быстро, т.к. не надо логиниться под админским аккаунтом в AD
- наглядно

### Как пользоваться поиском в AD:
- выбираем **режим поиска** 
    - простой и быстрый (по имени (cn) или его части или почте (mail))
    - расширенный (выборка с множественными условиями (ldap фильтр))
- вводим **критерий поиска**
- выбираем **область поиска**, можно ограничить область поиска только OU RUS
- нажимаем кнопку **Искать**

### Настройка приложения под себя:
- скачать репозиторий
- установить зависимости: `npm i`
- изменить абсолютный путь к файлу `server.js` в файлах `runServer.cmd`и `stopServer.cmd`
- создать конфигурационный файл `./src/back/.env.json`:
```
{
    "PORT": 3000,
    "PASSWORD_MAX_AGE": 42,
    "LDAP_URL":"ldap://domain.com",
    "BASE_DN_GROUP": "ou=unit, dc=domain, dc=com",
    "BASE_DN_RUS": "ou=subunit, ou=unit, dc=domain, dc=com",
    "USER_NAME": "username@domain.com",
    "PASSWORD": "yourpassword"
}
```
- в конфигурационном файле `./src/front/js/config.js` изменить значения переменных `hostName` (имя вашего локального хоста) и `url.instruction` (ссылка на инструкцию по подключению принтера)
- в скрипте `json-server` в файле `package.json` изменить путь к файлу data.json (файл с данными принтеров и телефонов формируется файлом `EXCEL to JSON.xlsm`) и значение у флага `--host`
- командой `npm run build` собрать проект (папка `build`)

### Запуск сервера:
- `runServer.cmd` (можно через планировщик заданий)
