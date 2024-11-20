class User {
    constructor(nome, sobrenome, email, idade, foto) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.email = email;
        this.idade = idade;
        this.foto = foto;
    }
}

// Expressão regular para validar o email
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Expressão regular para validar URLs
const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;

// Função para carregar usuários da API
async function loadUsers() {
    try {
        const response = await fetch('https://dummyjson.com/users');
        const data = await response.json();
        displayUsers(data.users); // Exibe a lista de usuários da API
    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
    }
}

// Função para adicionar um novo usuário à API
async function addUser(event) {
    event.preventDefault();
    clearErrorMessages();

    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const email = document.getElementById("email").value.trim();
    const idade = parseInt(document.getElementById("idade").value.trim());
    const foto = document.getElementById("foto").value.trim(); // Foto como URL opcional

    let hasError = false;

    // Validações nome
    if (nome.length < 3 || nome.length > 50) {
        showError("nome", "O nome deve ter entre 3 e 50 caracteres.");
        hasError = true;
    } else {
        showSuccess("nome");
    }
    // validações sobrenome
    if (sobrenome.length < 3 || sobrenome.length > 50) {
        showError("sobrenome", "O sobrenome deve ter entre 3 e 50 caracteres.");
        hasError = true;
    } else {
        showSuccess("sobrenome");
    }
    // validações email
    if (!emailRegex.test(email)) {
        showError("email", "Por favor, insira um e-mail válido.");
        hasError = true;
    } else {
        showSuccess("email");
    }
    // validações idade
    if (isNaN(idade) || idade <= 0 || idade >= 120) {
        showError("idade", "A idade deve ser um número positivo e menor que 120.");
        hasError = true;
    } else {
        showSuccess("idade");
    }
    // validações foto
    if (foto && !urlRegex.test(foto)) { // Se foto for preenchida, deve ser uma URL válida
        showError("foto", "Por favor, insira uma URL válida para a foto.");
        hasError = true;
    } else if (foto) {
        showSuccess("foto");
    }

    if (hasError) {
        return; // Se houver erro, não adiciona o usuário
    }

    // Criação de novo usuário para a API
    const newUser = {
        firstName: nome,
        lastName: sobrenome,
        email: email,
        age: idade,
        image: foto || null // Se foto estiver vazia, define como null
    };

    try {
        const response = await fetch('https://dummyjson.com/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser)
        });
        const result = await response.json();
        console.log("Usuário adicionado:", result);

        loadUsers(); // Recarrega a lista de usuários após a adição
    } catch (error) {
        console.error("Erro ao adicionar usuário:", error);
    }
}

// Função para exibir a lista de usuários
function displayUsers(users) {
    const userList = document.getElementById("user-list");
    userList.innerHTML = ""; // Limpa a lista de usuários

    users.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.classList.add("card");
        listItem.dataset.userId = user.id; // Armazena o ID do usuário

        listItem.innerHTML = `
            <div class="space"><strong>Nome:</strong> ${user.firstName}</div>
            <div class="space"><strong>Sobrenome:</strong> ${user.lastName}</div>
            <div class="space"><strong>Email:</strong> ${user.email}</div>
            <div class="space"><strong>Idade:</strong> ${user.age}</div>
            <div class="space"><strong>Foto:</strong> ${user.image ? `<img src="${user.image}" width="50" />` : "N/A"}</div>
            <button class="remove-btn">
                <i class="bi bi-trash"></i> Remover
            </button>
        `;

        userList.appendChild(listItem);
    });

    // Adiciona os listeners de evento para os botões de remoção
    document.querySelectorAll(".remove-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const userId = event.target.closest("li").dataset.userId;
            removeUser(userId);
        });
    });
}

// Função para remover um usuário da API
async function removeUser(userId) {
    try {
        await fetch(`https://dummyjson.com/users/${userId}`, {
            method: 'DELETE'
        });
        console.log(`Usuário com ID ${userId} removido.`);
        loadUsers(); // Atualiza a lista de usuários após a remoção
    } catch (error) {
        console.error("Erro ao remover usuário:", error);
    }
}

// Funções auxiliares de validação
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = message;

    field.parentElement.appendChild(errorMessage);
    field.classList.add("error");
    field.classList.remove("success");
}

function showSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.add("success");
    field.classList.remove("error");
}

function clearErrorMessages() {
    document.querySelectorAll(".error-message").forEach((message) => message.remove());
    document.querySelectorAll("input, textarea").forEach((field) => {
        field.classList.remove("error", "success");
    });
}

// Adiciona o evento de submit ao formulário
document.getElementById("add-user-form").addEventListener("submit", addUser);

// Carrega a lista de usuários ao iniciar
window.onload = loadUsers;
