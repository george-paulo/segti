function escolher() {
    
    let inputDescricao = document.querySelector('[name=descricao]');
    let descricao = inputDescricao.value;
    let inputdata = document.querySelector('[name=data]');
    let data = inputdata.value;
    let inputServico = document.querySelector('[name=servico]');
    let servico = inputServico.value;
    let inputId = document.querySelector('[name=id]');
    let id = parseInt(inputId.value);
    
    let consultoria = {
        data, servico, descricao
    }

    if (id == 0) {
        inserir_(consultoria);
    }
    
    else {
        editar(consultoria, id);
    }
}
let traducoes = {
    'pt-BR': {
        'Senha em branco': 'A senha não pode ser em branco!',
        'consultoria Cadastrado': 'consultoria cadastrada com sucesso!',
        'consultoria Apagado': 'consultoria apagada com sucesso!'
    },
    'en': {
        'Senha em branco': 'Password cannot be empty!'
    }
}

async function inserir_() {
    
    let data = document.querySelector('[name=data]').value;
    let servico = document.querySelector('[name=servico]').value;
    let descricao = document.querySelector('[name=descricao]').value;
    console.log('inserindo');
    let divResposta = document.querySelector('#resposta');
    let dados = new URLSearchParams({data, servico, descricao});
    console.log(dados);
    let resposta = await fetch('servico', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },   
        body: dados
    });
    if (resposta.status == 200) {
        divResposta.classList.add('padrao');
        divResposta.classList.remove('npadrao');
    }
    else {
        divResposta.classList.add('npadrao');
        divResposta.classList.remove('padrao');
    }
    let respostaJson = await resposta.json();
    let mensagem = respostaJson.mensagem;
    divResposta.innerText = traducoes['pt-BR'][mensagem];
}

async function listar() {

    let divConsultoria = document.getElementById('consultorias');
    divConsultoria.innerText = 'Carregando...'
    let resposta = await fetch('servico');
    let consultorias = await resposta.json();
    divConsultoria.innerHTML = '';
    for (let consultoria of consultorias) {
        let linha = document.createElement('tr');
        let colunaId = document.createElement('td');
        let colunaData = document.createElement('td');
        let colunaConsultoria = document.createElement('td');
        let colunaServico = document.createElement('td');
        let colunaAcoes = document.createElement('td');
        let botaoEditar = document.createElement('button');
        let botaoApagar = document.createElement('button');
        colunaId.innerText = consultoria.id;
        colunaData.innerText = consultoria.data_;
        colunaConsultoria.innerText = consultoria.servico;
        colunaServico.innerText = consultoria.descricao;  

        botaoEditar.innerText = 'Editar';
        botaoEditar.onclick = function () {
            formEditar(consultoria.id);
        }
        botaoApagar.onclick = function () {
            apagar(consultoria.id);
        }
        botaoApagar.innerText = 'Apagar';
        linha.appendChild(colunaId);
        linha.appendChild(colunaData);
        linha.appendChild(colunaConsultoria);
        linha.appendChild(colunaServico);
        colunaAcoes.appendChild(botaoEditar);
        colunaAcoes.appendChild(botaoApagar);
        linha.appendChild(colunaAcoes);
        divConsultoria.appendChild(linha);
    }
}

async function formEditar(id) {
    let resposta = await fetch('consultoria/' + id, {
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
    });
    let consultoria = await resposta.json();
    console.log(consultoria);
    let inputData = document.querySelector('[name=data]');
    inputData.value = consultoria.data;
    let inputservico = document.querySelector('[name=servico]');
    inputservico.value = consultoria.servico;
    let inputdescricao = document.querySelector('[name=descricao]');
    inputdescricao.value = consultoria.descricao;
    let inputId = document.querySelector('[name=id]');
    inputId.value = consultoria.id;
}

async function editar(consultoria, id) {
    let divResposta = document.querySelector('#resposta');
    let dados = new URLSearchParams(consultoria);
    let resposta = await fetch('consultoria/' + id, {
        method: 'put',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },   
        body: dados
    });
    if (resposta.status == 200) {
        divResposta.classList.add('padrao');
        divResposta.classList.remove('npadrao');
    }
    else {
        divResposta.classList.add('npadrao');
        divResposta.classList.remove('padrao');
    }
    let respostaJson = await resposta.json();
    let mensagem = respostaJson.mensagem;
    divResposta.innerText = traducoes['pt-BR'][mensagem];
}

async function apagar(id) {
    let divResposta = document.querySelector('#resposta');
    if (confirm('Quer apagar o #' + id + '?')) {
        let resposta = await fetch('consultoria/' + id, {
            method: 'delete',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        let respostaJson = await resposta.json();
        let mensagem = respostaJson.mensagem;
        divResposta.innerText = traducoes['pt-BR'][mensagem];
        listar();
    }
}

