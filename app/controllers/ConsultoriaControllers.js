const Consultoria = require('../lib/projeto/consultoria');
const utils = require('../lib/utils');

class consultoriaController {
    constructor(consultoriaDao) {
        this.consultoriaDao = consultoriaDao;
    }
    async index(req, res) {
        let consultoria = await this.consultoriaDao.listar();
        utils.renderizarEjs(res, './views/index.ejs', {consultoria});  

    }

    async servico(req, res) {
        let [ url, queryString ] = req.url.split('?');
        console.log(url);
        let urlList = url.split('/');
        url = urlList[1];
        let pagina = urlList[2];

        let consultoria = await this.consultoriaDao.listar(servico);
        utils.renderizarEjs(res, './views/servico.ejs', {consultoria, servico});  

    }

    async listar(req, res) {
        let consultoria = await this.consultoriaDao.listar();
        utils.renderizarJSON(res, consultoria);
    }
    
    async inserir(req, res) {
        let consultoria = await this.getconsultoriaDaRequisicao(req);
        console.log(consultoria);
        console.log('ERRO_ISERIR');
        try {
            this.consultoriaDao.inserir(consultoria);
            utils.renderizarJSON(res, {
                consultoria,
                mensagem: 'consultoria cadastrada'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }

    async ver(req, res) {
        let [ url, queryString ] = req.url.split('?');
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];      
        let consultoria = await this.consultoriaDao.ver(id);
        utils.renderizarJSON(res, consultoria);
    }

    async alterar(req, res) {
        console.log('ERRO_ALTERAR');
        let consultoria = await this.getconsultoriaDaRequisicao(req);
        console.log(consultoria);
        let [ url, queryString ] = req.url.split('?');
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];
        console.log(id);
        try {
            this.consultoriaDao.alterar(id, consultoria);
            utils.renderizarJSON(res, {
                mensagem: 'consultoria alterado'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }
    
    apagar(req, res) {
        console.log('ERRO_APAGAR');
        let [ url, queryString ] = req.url.split('?');
        console.log(url);
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];
        console.log(id);
        this.consultoriaDao.apagar(id);
        utils.renderizarJSON(res, {
            mensagem: 'consultoria apagada',
            id: id
        });
    }

    async getconsultoriaDaRequisicao(req) {
        let corpo = await utils.getCorpo(req);
        console.log(corpo);
        let consultoria = new Consultoria(
            corpo.data,
            corpo.servico,
            corpo.descricao
        );
        return consultoria;
    }
}

module.exports = consultoriaController;