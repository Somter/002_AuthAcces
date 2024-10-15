var cookieParser = require('cookie-parser');
var session = require('express-session');

// подключение модуля connect-mssql
var MSSQLStore = require('connect-mssql')(session);
var mssql = require('mssql'); 

module.exports = {
    createStore: function () {
        var config = {
            user: 'Ivan',   				// пользователь базы данных
            password: '11111', 	 			// пароль пользователя 
            server: 'Kris', 			// хост
            database: 'testdb',    			// имя бд
            port: 1433,			 			// порт, на котором запущен sql server
            options: {
                encrypt: true,  // Использование SSL/TLS
                trustServerCertificate: true // Отключение проверки самоподписанного сертификата
            },
        }

        return new MSSQLStore(config);
    }
}