let login = window.sessionStorage.getItem("usuarioLogado");

if (!login) {
  alert("Você deve logar antes!");
  window.location.href = "../index.html";
}
let usuario = window.sessionStorage.getItem("usuarioLogado");
let listaUsuarios = JSON.parse(
  window.localStorage.getItem("dados-usuario") || "[]"
);
let indiceUsuario: string = "";

for (const indice in listaUsuarios) {
  if (listaUsuarios[indice].login == usuario) {
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

let ModApagar = document.querySelector("#toastApagarRecado") as HTMLDivElement;

let ModalApagar = new bootstrap.Toast(ModApagar);

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

  salvarNaTabela(listaRecados);
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

function salvarNaTabela(dadosrecados: Recados[]) {
  if (dadosrecados.length > 0) {

    for (const indice in dadosrecados) {

      dadosrecados[indice].indice = indice;
      
      window.localStorage.setItem(
        "dados-usuario",
        JSON.stringify(listaUsuarios)

      );

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

function limparCampos(): void {
  inputTitulo.value = "";
  inputDescricao.value = "";
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
      salvarNaTabela(registro.recados);
    }
  }

  return;
}

function apagando(indice: Recados[]): void {
  ModalApagar.show();

  let ApagarRecado = document.querySelector(
    "#ApagarRecado"
  ) as HTMLButtonElement;

  ApagarRecado.addEventListener("click", () => {
    listaRecados.splice(indice, 1);
    salvarNoStorage(listaUsuarios);
    window.location.reload();
  });
}

function cancelarEdicao() {
  botaoCancelar.setAttribute("onclick", `limparCampos()`);
  botaoSalvar.setAttribute("style", "display: inline-block");
  botaoAtualizar.setAttribute("style", "display: none");
  botaoCancelar.setAttribute("style", "display: none");
}

function prepararEdicao(registroID: string) {
  botaoSalvar.setAttribute("style", "display: none");
  botaoAtualizar.setAttribute("style", "display: inline-block");
  botaoAtualizar.setAttribute("onclick", `atualizarRegistro(${registroID})`);
  botaoCancelar.setAttribute("style", "display: inline-block");

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
