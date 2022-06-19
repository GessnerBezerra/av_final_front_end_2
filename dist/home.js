"use strict";
let login = window.sessionStorage.getItem("usuarioLogado");
if (!login) {
    alert("Você deve logar antes!");
    window.location.href = "../index.html";
}
let usuario = window.sessionStorage.getItem("usuarioLogado");
let listaUsuarios = JSON.parse(window.localStorage.getItem("dados-usuario") || "[]");
let indiceUsuario = "";
for (const indice in listaUsuarios) {
    if (listaUsuarios[indice].login == usuario) {
        indiceUsuario = indice;
    }
}
let listaRecados = listaUsuarios[indiceUsuario].recados;
let formulario = document.querySelector("#recados");
let inputTitulo = document.querySelector("#descricao");
let inputDescricao = document.querySelector("#detalhamento");
let botaoSalvar = document.querySelector("#enviar_info");
let botaoAtualizar = document.querySelector("#botao_atualizar");
let botaoCancelar = document.querySelector("#botao_cancelar");
let botaoSair = document.querySelector("#botaoSair");
let tabelaDados = document.querySelector("#tabela-registros");
/////////////////////*************EVENTOS****************///////////////////////////
formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    adicionarNovoRegistro();
});
document.addEventListener('DOMContentLoaded', () => {
    if (!login) {
        alert("Você precisa estar logado para acessar essa página!");
        window.location.href = "../index.html";
        return;
    }
    salvarNaTabela(listaRecados);
});
// document.addEventListener('DOMContentLoaded', salvarNaTabela(listaRecados));
botaoSair.addEventListener("click", logOut);
//////////////////////*******FUNÇÕES**********////////////////////////////////////////////////
function adicionarNovoRegistro() {
    let titulorecados = inputTitulo.value;
    let descricaorecados = inputDescricao.value;
    let recados = {
        indice: "",
        descricao: titulorecados,
        detalhamento: descricaorecados,
    };
    listaRecados.push(recados);
    window.location.reload();
    salvarNaTabela(listaRecados);
    limparCampos();
    window.localStorage.setItem("dados-usuario", JSON.stringify(listaUsuarios));
}
function salvarNaTabela(dadosrecados) {
    if (dadosrecados.length > 0) {
        for (const indice in dadosrecados) {
            dadosrecados[indice].indice = indice;
            window.localStorage.setItem("dados-usuario", JSON.stringify(listaUsuarios));
            let novaLinha = document.createElement("tr");
            let colunaRegistro = document.createElement("td");
            let colunaTitulo = document.createElement("td");
            let colunaDescricao = document.createElement("td");
            let colunaAcoes = document.createElement("td");
            novaLinha.appendChild(colunaRegistro);
            novaLinha.appendChild(colunaTitulo);
            novaLinha.appendChild(colunaDescricao);
            novaLinha.appendChild(colunaAcoes);
            tabelaDados.appendChild(novaLinha);
            novaLinha.setAttribute("class", "informacoes");
            novaLinha.setAttribute("id", dadosrecados[indice].indice);
            colunaRegistro.innerHTML = dadosrecados[indice].indice;
            colunaTitulo.innerHTML = dadosrecados[indice].descricao;
            colunaDescricao.innerHTML = dadosrecados[indice].detalhamento;
            colunaAcoes.innerHTML = `
            <td><button type="button" value="" class="inf_botao" onclick="prepararEdicao(${indice})" id="inf_botao_editar">Editar</button></td>
            <td><button type="button" value="" class="inf_botao" onclick="apagando(${indice})" id="inf_botao_apagar">Apagar</button></td>
                                    `;
        }
    }
}
function limparCampos() {
    inputTitulo.value = "";
    inputDescricao.value = "";
}
function salvarNoStorage(lst_recados) {
    localStorage.setItem("dados-usuario", JSON.stringify(lst_recados));
}
function logOut() {
    window.sessionStorage.removeItem("login");
    window.sessionStorage.removeItem("dados-usuario");
    window.location.href = "../index.html";
}
function pegarDadosStorage() {
    let dadosStorage = JSON.parse(localStorage.getItem("dados-usuario") || "[]");
    if (dadosStorage) {
        for (let registro of dadosStorage) {
            salvarNaTabela(registro.recados);
        }
    }
    return;
}
function apagarRegistro(registroID) {
    // let modal: HTMLElement = document.createElement("div");
    // modal.innerHTML = `
    // <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    //       <div class="modal-dialog">
    //         <div class="modal-content">
    //           <div class="modal-header">
    //             <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
    //             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    //           </div>
    //           <div class="modal-body">
    //             <p>Tem certeza que deseja remover o recado de registro ID ${registroID + 1}?
    //             ;</p>
    //           </div>
    //           <div class="modal-footer">
    //             <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="apagando(${registroID + 1})" id="inf_botao_editar">Sim</button>
    //             <button type="button" class="btn btn-primary">Cancelar</button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   `;
    let confirma = window.confirm(`Tem certeza que deseja remover o recado de registro ID ${registroID + 1}?`);
    // myModal.hide();
}
;
function apagando(indice) {
    let confirma = window.confirm(`Tem certeza que deseja remover o recado de registro ID ${indice}?`);
    if (confirma) {
        listaRecados.splice(indice, 1);
        salvarNoStorage(listaUsuarios);
        window.location.reload();
    }
}
function cancelarEdicao() {
    botaoCancelar.setAttribute("onclick", `limparCampos()`);
    botaoSalvar.setAttribute("style", "display: inline-block");
    botaoAtualizar.setAttribute("style", "display: none");
    botaoCancelar.setAttribute("style", "display: none");
}
function prepararEdicao(registroID) {
    botaoSalvar.setAttribute("style", "display: none");
    botaoAtualizar.setAttribute("style", "display: inline-block");
    botaoAtualizar.setAttribute("onclick", `atualizarRegistro(${registroID})`);
    botaoCancelar.setAttribute("style", "display: inline-block");
    inputTitulo.value = listaRecados[registroID].descricao;
    inputDescricao.value = listaRecados[registroID].detalhamento;
}
function atualizarRegistro(registroID) {
    let novoTitulo = inputTitulo.value;
    let novaDescricao = inputDescricao.value;
    let recadoEditado = listaRecados[registroID];
    recadoEditado.detalhamento = novaDescricao;
    recadoEditado.descricao = novoTitulo;
    listaRecados.splice(registroID, 1, recadoEditado);
    window.localStorage.setItem("dados-usuario", JSON.stringify(listaUsuarios));
    window.location.reload();
}
