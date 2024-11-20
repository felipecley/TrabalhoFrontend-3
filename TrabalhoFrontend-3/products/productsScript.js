class Product {
    constructor(titulo, descricao, preco, marca, categoria, foto) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.preco = preco;
        this.marca = marca;
        this.categoria = categoria;
        this.foto = foto;
    }
}

// Expressão regular para validar o preço (formato numérico)
const precoRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

// Expressão regular para validar URLs
const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;

// Função para buscar produtos da API
async function fetchProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        const productsList = data.products;
        displayProducts(productsList);
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

// Função para adicionar um novo produto à API
async function addProduct(event) {
    event.preventDefault();

    clearErrorMessages();

    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const preco = document.getElementById("preco").value.trim();
    const marca = document.getElementById("marca").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const foto = document.getElementById("foto").value.trim(); // Foto como URL opcional

    let hasError = false;

    // Validações do título
    if (titulo.length < 3 || titulo.length > 50) {
        showError("titulo", "O título deve ter entre 3 e 50 caracteres.");
        hasError = true;
    } else {
        showSuccess("titulo");
    }

    // Validações da descrição
    if (descricao.length < 3 || descricao.length > 50) {
        showError("descricao", "A descrição deve ter entre 3 e 50 caracteres.");
        hasError = true;
    } else {
        showSuccess("descricao");
    }

    // Validações do preço
    if (!precoRegex.test(preco) || parseFloat(preco) <= 0) {
        showError("preco", "Por favor, insira um preço válido.");
        hasError = true;
    } else {
        showSuccess("preco");
    }

    // Validações da marca
    if (marca.length < 3 || marca.length > 50) {
        showError("marca", "A marca deve ter entre 3 e 50 caracteres.");
        hasError = true;
    } else {
        showSuccess("marca");
    }

    // Validações da categoria
    if (categoria.length < 3 || categoria.length > 50) {
        showError("categoria", "A categoria deve ter entre 3 e 50 caracteres.");
        hasError = true;
    } else {
        showSuccess("categoria");
    }

    // Validações da foto
    if (foto && !urlRegex.test(foto)) { // Se foto for preenchida, deve ser uma URL válida
        showError("foto", "Por favor, insira uma URL válida para a foto.");
        hasError = true;
    } else if (foto) {
        showSuccess("foto");
    }

    if (hasError) {
        return;
    }

    const newProduct = {
        title: titulo,
        description: descricao,
        price: parseFloat(preco),
        brand: marca,
        category: categoria,
        thumbnail: foto || null // Se a foto estiver vazia, define como null
    };

    try {
        const response = await fetch('https://dummyjson.com/products/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });
        const result = await response.json();
        console.log("Produto adicionado:", result);
        fetchProducts(); // Atualiza a lista após a adição
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
    }
}

// Função para exibir a lista de produtos
function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach((product) => {
        const listItem = document.createElement("li");
        listItem.classList.add("card");
        listItem.dataset.productId = product.id;

        listItem.innerHTML = `
            <div class="space"><strong>Título:</strong> ${product.title}</div>
            <div class="space"><strong>Descrição:</strong> ${product.description}</div>
            <div class="space"><strong>Preço:</strong> R$ ${product.price}</div>
            <div class="space"><strong>Marca:</strong> ${product.brand}</div>
            <div class="space"><strong>Categoria:</strong> ${product.category}</div>
            <div class="space"><strong>Foto:</strong> ${product.thumbnail ? `<img src="${product.thumbnail}" alt="Foto do produto" width="100">` : "N/A"}</div>
            <button class="remove-btn">
                <i class="bi bi-trash"></i> Remover
            </button>
        `;

        productList.appendChild(listItem);
    });

    document.querySelectorAll(".remove-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const productId = event.target.closest("li").dataset.productId;
            removeProduct(productId);
        });
    });
}

// Função para remover um produto
async function removeProduct(productId) {
    try {
        await fetch(`https://dummyjson.com/products/${productId}`, {
            method: 'DELETE'
        });
        console.log(`Produto com ID ${productId} removido.`);
        fetchProducts(); // Atualiza a lista de produtos após a remoção
    } catch (error) {
        console.error("Erro ao remover produto:", error);
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
document.getElementById("add-product-form").addEventListener("submit", addProduct);

// Carrega a lista de produtos ao iniciar
fetchProducts();
