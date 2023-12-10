const utils = require("../lib/utils")

class AutorController {
    autor(req, res) {
        const autor = {
            nome: 'George Paulo',
            formacoes: [
                'Técnico em Informática para Internet',
                'Instituto Federal do Ceará',
                'Ano: 2023'
            ],
            experiencias: [
                'Militar do Exército Brasileiro',
                'Trabalhando atualmente com infraestrutura de TI',
                'Ano: Desde 2018'
            ]
        };

        utils.renderizarEjs(res, './views/autor.ejs', autor);
    }
}

module.exports = AutorController;