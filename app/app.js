const http = require('http');
const ConsultoriaController = require('./controllers/ConsultoriaControllers');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const AuthController = require('./controllers/AuthController');
const UsuariosController = require('./controllers/UsuariosControllers');
const ConsultoriaMysqlDao = require('./lib/projeto/ConsultoriaMysqlDao');
const UsuariosMysqlDao = require('./lib/projeto/UsuariosMysqlDao');
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'bd',
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE
});

let consultoriaDao = new ConsultoriaMysqlDao(pool);
let usuariosDao = new UsuariosMysqlDao(pool);
let consultoriasController = new ConsultoriaController(consultoriaDao);
let estaticoController = new EstaticoController();
let autorController = new AutorController();
let authController = new AuthController(usuariosDao);
let usuariosController = new UsuariosController(usuariosDao);

const PORT = 3000;
const server = http.createServer((req, res) => {
    let [url, querystring] = req.url.split('?');
    let urlList = url.split('/');
    url = urlList[1];
    let metodo = req.method;

    if (url=='index') {
        consultoriasController.index(req, res);
    }
    
    else if (url == 'admin' && metodo == 'GET') {
        authController.admin(req, res);
    }

    else if (url == 'servico' && metodo == 'GET') {
        consultoriasController.listar(req, res);
    }
    else if (url == 'servico' && metodo == 'POST') {
        consultoriasController.inserir(req, res);
    }
    
    else if (url == 'servico' && metodo == 'PUT') {
        consultoriasController.alterar(req, res);
    }
    
    else if (url == 'servico' && metodo == 'DELETE') {
        consultoriasController.apagar(req, res);
        }

    else if (url == 'servico' && metodo == 'GET') {
        consultoriasController.ver(req, res);
        }    

    else if (url == 'usuarios' && metodo == 'GET') {
        usuariosController.listar(req, res);
    }
    else if (url == 'usuarios' && metodo == 'POST') {
        usuariosController.inserir(req, res);
    }
    else if (url == 'usuarios' && metodo == 'PUT') {
        authController.servicoizar(req, res, function() {
            usuariosController.alterar(req, res);
        }, ['admin', 'geral']);
    }
    else if (url == 'usuarios' && metodo == 'DELETE') {
        authController.servicoizar(req, res, function() {
            usuariosController.apagar(req, res);
        }, ['admin']);
    }

    else if (url=='autor') {
        autorController.autor(req, res);    
    }

    else if (url=='solucao') {
        estaticoController.solucao(req, res);    
    }

    else if (url=='contrate') {
        estaticoController.contrate(req, res);    
    }

    else if (url=='cadastro') {
        authController.cadastro(req, res);    
    }
        
    else if (url=='admin') {
        authController.admin(req, res);    
    }

    else if (url == 'login') {
        authController.index(req, res);
    }
    else if (url == 'logar') {
        authController.logar(req, res);
    }    
    else {
        estaticoController.procurar(req, res);   
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});