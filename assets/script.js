
let btnSalvarTarefa = document.getElementById('bt-adicionar')
let TarefaNome = document.getElementsByName('nome-tarefa')[0]
let tarefas = []

let EstatisticaTarefa = {
    qtdTarefas: 0,
    qtdTarefasConcluidas: 0,
    qtdTarefasPendentes: 0
}

carregarTarefas()
renderizarTarefas()

btnSalvarTarefa.addEventListener('click', function (e){
    e.preventDefault()  
    switch (ValidaInforCampo(TarefaNome.value)){
        case 'Vazio':
            alert('O nome da tarefa não pode ser vazio')
        break
        case 'Numero':
            alert('O nome da tarefa não pode ser um número')
        break
        case 'Caracteres':
            alert('O nome da tarefa precisa ter mais de três caracteres')
        break
        default:
            salvarTarefa(TarefaNome.value)
           atualizarLocalStorage()
           
    }  
})

function ValidaInforCampo(texto){

    if(texto == "" || texto == null){''
        return "Vazio"
    }else if(!isNaN(texto)){
        return "Numero"
    }else if( texto.length <= 4){
        return "Caracteres"
    }
}

function salvarTarefa(texto){
    let tarefa = 
        {
            id: tarefas.length + 1,
            nome: texto,
            status: 'Pendente'
        }    
    tarefas.push(tarefa)
    console.log(tarefas)
    atualizarLocalStorage()

}

function carregarTarefas(){
    tarefas = localStorage.getItem('tarefas')  == null ? [] : JSON.parse(localStorage.getItem('tarefas'))
    atualizarEstatisticaTarefas()
}

function renderizarTarefas() {

    document.querySelector('.tarefas').innerHTML = ''

    tarefas.forEach((e, index) => {
        let modeloTarefa = document.querySelector('.tarefa.tarefa-modelo').cloneNode(true)
        modeloTarefa.classList.remove('tarefa-modelo')

        modeloTarefa.setAttribute('data-tarefa', index)
        modeloTarefa.querySelector('p').innerHTML = e.nome
        modeloTarefa.querySelector('.bt-padrao.bt-excluir-tarefa')
            .setAttribute('data-btExcluir', index)
        
        if(e.status == 'Concluida'){
            modeloTarefa.querySelector('input').setAttribute('checked','')
            modeloTarefa.querySelector('p').classList.add('tarefa-conluida')
        }        

        modeloTarefa.querySelector('.bt-padrao.bt-excluir-tarefa').addEventListener('click', function (e) {
            let idRemove = e.target.parentNode.getAttribute('data-btexcluir')

            tarefas.splice(idRemove, 1)
            atualizarLocalStorage()

            renderizarTarefas()
            carregarTarefas()
        })

        modeloTarefa.querySelector('input').setAttribute('data-tarefa-input', index)
        modeloTarefa.querySelector('input').addEventListener('change', function (e){
            if(modeloTarefa.querySelector('input').checked){
                tarefas[index].status = "Concluida"
            }else{
                tarefas[index].status = "Pendente"
            }

            atualizarLocalStorage()
            
        })

        document.querySelector('.tarefas').append(modeloTarefa)
    })


}

function atualizarEstatisticaTarefas(){

    EstatisticaTarefa.qtdTarefas = tarefas.length
    EstatisticaTarefa.qtdTarefasConcluidas = tarefas.reduce((a, c) => a +=  c.status == 'Concluida' ? 1 : 0, 0)
    EstatisticaTarefa.qtdTarefasPendentes = tarefas.reduce((a, c) => a +=  c.status == 'Pendente' ? 1 : 0, 0)


    document.querySelector('.qtd-tarefas span').innerHTML = EstatisticaTarefa.qtdTarefas
    document.querySelector('.qtd-tarefas-conluidas span').innerHTML = EstatisticaTarefa.qtdTarefasConcluidas
    document.querySelector('.qtd-tarefas-pendentes span').innerHTML = EstatisticaTarefa.qtdTarefasPendentes
}

function atualizarLocalStorage(){

    localStorage.setItem('tarefas', JSON.stringify(tarefas))
    renderizarTarefas()
    carregarTarefas()
    
}