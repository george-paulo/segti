const Consultoria = require("./consultoria");
const bcrypt = require('bcrypt');

class consultoriaMysqlDao {
    constructor(pool) {
        this.pool = pool;
    }

    async listar(pagina) {
        return new Promise((resolve, reject) => {
            let limite = "";
            if (pagina) {
                let offset = pagina * 4; 
                let registrosPorPagina = 4;
                limite = ` LIMIT ${offset}, ${registrosPorPagina}`;
            }
            this.pool.query(`SELECT *, DATE_FORMAT(data_,'%d/%m/%Y') AS data_ FROM consultoria${limite}`, (error, linhas, fields) => {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                let consultorias = linhas.map(linha => {
                    let { id, data_, servico, descricao } = linha;
                    return new Consultoria(data_, servico, descricao, id);
                });
                resolve(consultorias);
            });
        });
    }

    async inserir(consultoria) {
        this.validar(consultoria);

        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO consultoria (data_, servico, descricao) VALUES (?, ?, ?)';
            this.pool.query(sql, [consultoria.data, consultoria.servico, consultoria.descricao], (error, resultado, fields) => {
                if (error) {
                    return reject('Erro ao inserir: ' + error.message);
                }
                resolve(resultado.insertId);
            });
        });
    }

    alterar(id, consultoria) {
        this.validar(consultoria);
        return new Promise((resolve, reject) => {
            let sql = 'UPDATE consultoria SET data_=?, servico=?, descricao=? WHERE id=?;';
            this.pool.query(sql, [consultoria.data, consultoria.servico, consultoria.descricao, id], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.alterId);
            });
        });
    }

    ver (id) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM consultoria WHERE id=?;';
            this.pool.query(sql, id, function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                let consultoria = linhas.map(linha => {
                    let { id, data, servico, descricao } = linha;
                    return new consultoria(data, servico, descricao, id);
                })
                resolve(consultoria[0]);
            });
        });
    }

    apagar(id) {
        return new Promise((resolve, reject) => {
            let sql = 'DELETE FROM consultoria WHERE id=?;';
            this.pool.query(sql, id, function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.deleteId);
            });
        });
    }

    validar(consultoria) {
        if (!consultoria.data) {
            throw new Error('Data em branco');
        }
        if (!consultoria.servico) {
            throw new Error('Serviço em branco');
        }
        if (!consultoria.descricao) {
            throw new Error('Descrição do serviço em branco');
        }
    }

    
    async autenticar(nome, senha) {
        try {
            const consultorias = await this.listar(); // Espera a lista de consultorias
    
            for (let consultoria of consultorias) {
                if (consultoria.nome === nome && bcrypt.compareSync(senha, consultoria.senha)) {
                    return consultoria;
                }
            }
            return null;
        } catch (error) {
            throw new Error('Erro ao autenticar: ' + error.message);
        }
    }
}

module.exports = consultoriaMysqlDao;