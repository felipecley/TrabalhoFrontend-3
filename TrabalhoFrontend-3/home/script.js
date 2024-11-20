// Texto que será exibido
const texto = "Aqui temos diversos produtos com variedades e muita qualidade !!";
let index = 0;

// Função para adicionar as letras uma por uma
function digitarTextoAnimado() {
    if (index < texto.length) {
        document.getElementById('texto-animado').innerHTML += texto.charAt(index);
        index++;
        setTimeout(digitarTextoAnimado, 100); // Controla a velocidade da digitação (100 ms)
    } else {
        //aguarda 1 segundo antes de reiniciar a digitação
        setTimeout(() => {
            document.getElementById('texto-animado').innerHTML = ''; // Limpa o texto
            index = 0; // Reseta o índice
            digitarTextoAnimado(); // Recomeça a digitação
        }, 1000); // 1 segundo de pausa antes de reiniciar
    }
}

// Texto que será exibido
const textoH1 = "Bem-vindos a Loja";
let indexH1 = 0;
// Função para adicionar as letras uma por uma
function digitarTextoH1() {
    if (indexH1 < textoH1.length) {
        document.getElementById('logo-animado').innerHTML += textoH1.charAt(indexH1);
        indexH1++;
        setTimeout(digitarTextoH1, 100); // Controla a velocidade da digitação (100 ms)
    } else {
        //aguarda 1 segundo antes de reiniciar a digitação
        setTimeout(()=> {
            document.getElementById('logo-animado').innerHTML = '';
            indexH1 = 0; // Reseta o índice
            digitarTextoH1(); // Recomeça a digitação
        }, 1000); // 1 segundo de pausa antes de reiniciar
    }
}
// Inicia as funções ao carregar a página
window.onload = function() {
    digitarTextoAnimado();
    digitarTextoH1();
};
