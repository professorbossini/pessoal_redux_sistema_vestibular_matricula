const redux = require ('redux')
const prompts = require ('prompts')

// função criadora de ação
// nome e cpf serão capturados via prompt
const realizarVestibular = (nome, cpf) => {
  // nota gerada aleatoriamente
  const entre6e10 = Math.random() <= 0.7;
  const nota = entre6e10 ? Math.random() * 4 + 6 : Math.random() * 5;
  console.log('nota: ' + nota)
  // esse JSON é uma ação
  return {
    type: "REALIZAR_VESTIBULAR",
    payload: {
      nome,
      cpf,
      nota
    }
  };
};
// função criadora de ação
// cpf capturado via prompt
// status de acordo com a realização do vestibular
const realizarMatricula = (cpf, status) => {
  // esse JSON é uma ação
  return {
    type: "REALIZAR_MATRICULA",
    payload: {
      cpf, status
    }
  };
};
  
// essa função é um reducer
const historicoVestibular = (historicoVestibularAtual = [], acao) => {
  if (acao.type === "REALIZAR_VESTIBULAR") {
    return [...historicoVestibularAtual, acao.payload];
  }
  return historicoVestibularAtual;
};

// essa função é um reducer
const historicoMatriculas = (historicoMatriculasAtual = [], acao) => {
  if (acao.type === "REALIZAR_MATRICULA") {
    return [...historicoMatriculasAtual, acao.payload];
  }
  return historicoMatriculasAtual;
};

const todosOsReducers = redux.combineReducers({
  historicoMatriculas,
  historicoVestibular
});
const store = redux.createStore(todosOsReducers);
// função de teste
const main = async () => {
  const menu =
    "1-Realizar Vestibular\n2-Realizar Matrícula\n3-Visualizar meu status\n4-Visualizar lista de aprovados\n0-Sair"
  let response;
  do {
    response = await prompts({
        type: 'number',
        name: 'op',
        message: menu
    });
    try {
      switch (response.op) {
        case 1:{
            const {nome} = await prompts({
                type: 'text',
                name: 'nome',
                message: "Digite seu nome"
            });
            const {cpf} = await prompts({
                type: 'text',
                name: 'cpf',
                message: "Digite seu cpf"
            });
            store.dispatch(realizarVestibular(nome, cpf));
            break;
        }
        case 2:{
          const {cpf} = await prompts({
              type: 'text',
              name: 'cpf',
              message: "Digite seu cpf"
          });
          const aprovado = store.getState().historicoVestibular.find( aluno => aluno.cpf === cpf && aluno.nota >= 6)
          if (aprovado){
              store.dispatch(realizarMatricula(cpf, "M"))
              console.log ("Ok, matriculado!")
          }
          else{
              store.dispatch(realizarMatricula(cpf, "NM"))
              console.log ("Infelizmente você não foi aprovado no vestibular ainda.")
          }
            break;
        }
        case 3:{
          const {cpf} = await prompts({
              type: 'text',
              name: 'cpf',
              message: "Digite seu cpf"
          });
          const aluno = store.getState().historicoMatriculas.find(aluno => aluno.cpf === cpf)
          if (aluno){
              console.log (`Seu status é: ${aluno.status}`)
          }
          else{
              console.log("Seu nome não consta na lista de matrículas")
          }
          break;
        }
        case 4:{
            const listaAprovados = store.getState().historicoVestibular.filter(aluno => aluno.nota >= 6);
            console.log(listaAprovados);
            break;
        }
        case 0:
          console.log("Até logo");
          break;
        default:
          console.log("Opção inválida");
          break;
      }
    } catch (err) {
      console.log(err)
      console.log("Digite uma opção válida");
    }
  } while (response.op !== 0);
};

main()