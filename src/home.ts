let login = window.sessionStorage.getItem("usuarioLogado");
let usuario: Element | null = document.querySelector(
  "#userHome"
) as HTMLFormElement;

if (!login) {
  alert("Você deve logar antes!");
  window.location.href = "../index.html";
}
usuario.innerHTML = `Bem vindo: ${login}`;
let listaUsuarios = JSON.parse(
  window.localStorage.getItem("dados-usuario") || "[]"
);
let indiceUsuario: string = "";

for (const indice in listaUsuarios) {
  if (listaUsuarios[indice].login == login) {
    indiceUsuario = indice;
  }
}

let listaRecados = listaUsuarios[indiceUsuario].recados;
let formulario = document.querySelector("#recados") as HTMLFormElement;
let inputTitulo = document.querySelector("#descricao") as HTMLInputElement;
let inputDescricao = document.querySelector(
  "#detalhamento"
) as HTMLInputElement;
let botaoSalvar = document.querySelector("#enviar_info") as HTMLButtonElement;
let botaoAtualizar = document.querySelector(
  "#botao_atualizar"
) as HTMLButtonElement;
let botaoCancelar = document.querySelector(
  "#botao_cancelar"
) as HTMLButtonElement;
let botaoSair = document.querySelector("#botaoSair") as HTMLButtonElement;
let tabelaDados = document.querySelector("#tabela-registros") as HTMLDivElement;

let ModApaga = document.querySelector("#modalApagarRecado") as HTMLDivElement;
let msgModal = document.querySelector("#msg") as HTMLParagraphElement;

let cardDados = document.querySelector("#row-card") as HTMLDivElement;

let ModalApaga = new bootstrap.Modal(ModApaga);

interface Recados {
  indice: string;
  descricao: string;
  detalhamento: string;
}
interface Usuario {
  nome: string;
  login: string;
  senha: string;
  recados: Recados[];
}
/////////////////////*************EVENTOS****************///////////////////////////

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  adicionarNovoRegistro();
});

document.addEventListener("DOMContentLoaded", () => {
  if (!login) {
    alert("Você precisa estar logado para acessar essa página!");
    window.location.href = "../index.html";
    return;
  }

  salvarNoCard(listaRecados);
});

botaoSair.addEventListener("click", logOut);

//////////////////////*******FUNÇÕES**********////////////////////////////////////////////////

function adicionarNovoRegistro(): void {
  let titulorecados = inputTitulo.value;
  let descricaorecados = inputDescricao.value;

  let recados: Recados = {
    indice: "",
    descricao: titulorecados,
    detalhamento: descricaorecados,
  };

  listaRecados.push(recados);

  window.location.reload();

  limparCampos();

  window.localStorage.setItem("dados-usuario", JSON.stringify(listaUsuarios));
}


//---------FUNÇÃO PARA CRIAÇÃO DE TABELA--------------------

// function salvarNaTabela(dadosrecados: Recados[]) {
//   if (dadosrecados.length > 0) {

//     for (const indice in dadosrecados) {

//       let indcString = dadosrecados[indice].indice;
//       let indcNumber = +indcString;
//       indcNumber= Number(indice);
//       indcNumber++;
//       indcString = indcNumber.toString();
//       dadosrecados[indice].indice = indcString;

//       window.localStorage.setItem(
//         "dados-usuario",
//         JSON.stringify(listaUsuarios)

//       );

//       let novaLinha = document.createElement("tr");
//       let colunaRegistro = document.createElement("td");
//       let colunaTitulo = document.createElement("td");
//       let colunaDescricao = document.createElement("td");
//       let colunaAcoes = document.createElement("td");

//       novaLinha.appendChild(colunaRegistro);
//       novaLinha.appendChild(colunaTitulo);
//       novaLinha.appendChild(colunaDescricao);
//       novaLinha.appendChild(colunaAcoes);

//       tabelaDados.appendChild(novaLinha);

//       novaLinha.setAttribute("class", "informacoes");
//       novaLinha.setAttribute("id", dadosrecados[indice].indice);
//       colunaRegistro.innerHTML = dadosrecados[indice].indice;
//       colunaTitulo.innerHTML = dadosrecados[indice].descricao;
//       colunaDescricao.innerHTML = dadosrecados[indice].detalhamento;
//       colunaAcoes.innerHTML = `
//             <td><button type="button" value="" class="inf_botao" onclick="prepararEdicao(${indice})" id="inf_botao_editar">Editar</button></td>
//             <td><button type="button" value="" class="inf_botao" onclick="apagando(${indice})" id="inf_botao_apagar">Apagar</button></td>
//                                     `;
//     }
//   }
// }

//-----------FUNÇÃO PARA CRIAR CARD---------------

function salvarNoCard(dadosrecados: Recados[]) {
  if (dadosrecados.length > 0) {
    for (const indice in dadosrecados) {
      let indcString = dadosrecados[indice].indice;
      let indcNumber = +indcString;
      indcNumber = Number(indice);
      indcNumber++;
      indcString = indcNumber.toString();
      dadosrecados[indice].indice = indcString;
      window.localStorage.setItem(
        "dados-usuario",
        JSON.stringify(listaUsuarios)
      );

      
      let sectionCard = document.createElement("section");
      let divCardTtl = document.createElement("div");
      let divCardTRst = document.createElement("div");
      let divCardDsc = document.createElement("div");
      let divCardAcao = document.createElement("div");
      let labelRegistro = document.createElement("label");
      let registro = document.createElement("p");
      let labelTitulo = document.createElement("label");
      let titulo = document.createElement("p");
      let labelDescricao = document.createElement("label");
      let descricao = document.createElement("p");
      let labelAcao = document.createElement("label");
      let acoes = document.createElement("td");

      divCardTtl.setAttribute("class", "titulo-card");
      divCardTRst.setAttribute("class", "registro");
      divCardDsc.setAttribute("class", "descricao");
      divCardAcao.setAttribute("class", "acoes");

      divCardTRst.appendChild(labelRegistro);
      divCardTRst.appendChild(registro);

      divCardTtl.appendChild(labelTitulo);
      divCardTtl.appendChild(titulo);

      divCardDsc.appendChild(labelDescricao);
      divCardDsc.appendChild(descricao);

      divCardAcao.appendChild(labelAcao);
      divCardAcao.appendChild(acoes);

      sectionCard.appendChild(divCardTRst);
      sectionCard.appendChild(divCardTtl);
      sectionCard.appendChild(divCardDsc);
      sectionCard.appendChild(divCardAcao);

      cardDados.appendChild(sectionCard);

      sectionCard.setAttribute("class", "card");
      labelRegistro.setAttribute("id", dadosrecados[indice].indice);
      labelRegistro.innerHTML = `Id: `;
      registro.innerHTML = dadosrecados[indice].indice;
      labelTitulo.innerHTML = `Título: `;
      titulo.innerHTML = dadosrecados[indice].descricao;
      labelDescricao.innerHTML = `Descrição: `;
      descricao.innerHTML = dadosrecados[indice].detalhamento;
      labelAcao.innerHTML = `Ações: `;
      acoes.innerHTML = `
             <td><button type="button" value="" class="inf_botao" onclick="prepararEdicao(${indice})" id="inf_botao_editar">Editar</button></td>
             <td><button type="button" value="" class="inf_botao" onclick="apagarRegistro(${indice})" id="inf_botao_apagar">apagar</button></td>
                                     `;
    }
  }
}

function limparCampos(): void {
  inputTitulo.value = "";
  inputDescricao.value = "";
  inputTitulo.focus();
}

function salvarNoStorage(lst_recados: Usuario[]) {
  localStorage.setItem("dados-usuario", JSON.stringify(lst_recados));
}

function logOut(): void {
  window.sessionStorage.removeItem("login");
  window.sessionStorage.removeItem("dados-usuario");
  window.location.href = "../index.html";
}

function pegarDadosStorage() {
  let dadosStorage = JSON.parse(localStorage.getItem("dados-usuario") || "[]");

  if (dadosStorage) {
    for (let registro of dadosStorage) {
      salvarNoCard(registro.recados);
    }
  }

  return;
}

//-------------- FUNÇÃO DE APAGAR DESABILITADA-----------

// function apagando(indice: Recados[]): void {
//   ModalApaga.show();

//   let ApagarRecados= document.querySelector(
//     "#ApagarRecados"
//   ) as HTMLButtonElement;

//   // let ApagarRecado = document.querySelector(
//   //   "#ApagarRecado"
//   // ) as HTMLButtonElement;

//   ApagarRecados.addEventListener("click", () => {
//     listaRecados.splice(indice, 1);
//     salvarNoStorage(listaUsuarios);
//     window.location.reload();
//   });

//   // ApagarRecado.addEventListener("click", () => {
//   //   listaRecados.splice(indice, 1);
//   //   salvarNoStorage(listaUsuarios);
//   //   window.location.reload();
//   // });
// }

function cancelarEdicao() {
  botaoCancelar.setAttribute("onclick", `${limparCampos()}`);
  botaoSalvar.setAttribute("style", "display: inline-block");
  botaoAtualizar.setAttribute("style", "display: none");
  botaoCancelar.setAttribute("style", "display: none");
}

function prepararEdicao(registroID: string) {
  botaoSalvar.setAttribute("style", "display: none");
  botaoAtualizar.setAttribute("style", "display: inline-block");
  botaoAtualizar.setAttribute("onclick", `atualizarRegistro(${registroID})`);
  botaoCancelar.setAttribute("style", "display: inline-block");
  botaoCancelar.setAttribute("onclick", `cancelarEdicao()`);

  inputTitulo.value = listaRecados[registroID].descricao;
  inputDescricao.value = listaRecados[registroID].detalhamento;
}

function atualizarRegistro(registroID: string) {
  let novoTitulo = inputTitulo.value;
  let novaDescricao = inputDescricao.value;

  let recadoEditado = listaRecados[registroID];

  recadoEditado.detalhamento = novaDescricao;
  recadoEditado.descricao = novoTitulo;

  listaRecados.splice(registroID, 1, recadoEditado);
  window.localStorage.setItem("dados-usuario", JSON.stringify(listaUsuarios));
  window.location.reload();
}

function apagarRegistro(indice: Recados[]): void {
  let indcString = indice;
  let indcNumber = +indcString;
  indcNumber = Number(indice);
  indcNumber++;

  msgModal.innerHTML = `Tem certeza que deseja remover o recado de registro ID ${indcNumber}?`;
  ModalApaga.show();

  let ApagarRecados = document.querySelector(
    "#ApagarRecados"
  ) as HTMLButtonElement;

    let confirma:boolean=true;
  ApagarRecados.addEventListener("click", () => {
    listaRecados.splice(indice, 1);
    
    confirma = false;
    
    salvarNoStorage(listaUsuarios);
    window.location.reload();
    
  });

};
