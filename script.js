let carrinho = [];
let produtosData = [];

async function carregarProdutos() {
    const response = await fetch("https://api.mercadolibre.com/sites/MLB/search?seller_id=36878440");
    const dados = await response.json();
    produtosData = dados.results;
    const produtosContainer = document.getElementById("produtosContainer");

    produtosData.forEach(produto => {
        const div = document.createElement("div");
        div.classList.add("produto");
        div.innerHTML = `
            <img src="${produto.thumbnail}" alt="${produto.title}">
            <h3>${produto.title}</h3>
            <p>R$ ${produto.price.toFixed(2)}</p>
            <button onclick="adicionarAoCarrinho('${produto.id}', '${produto.title}', ${produto.price}, '${produto.thumbnail}')">Adicionar ao Carrinho</button>`;
        produtosContainer.appendChild(div);
    });
}

function adicionarAoCarrinho(id, nome, preco, imagem) {
    const produtoNoCarrinho = carrinho.find(produto => produto.id === id);
    if (produtoNoCarrinho) {
        produtoNoCarrinho.quantidade++;
    } else {
        carrinho.push({ id, nome, preco, imagem, quantidade: 1 });
    }
    atualizarCarrinho();
}

function removerDoCarrinho(id) {
    const produtoIndex = carrinho.findIndex(produto => produto.id === id);
    if (produtoIndex !== -1) {
        carrinho.splice(produtoIndex, 1);
    }
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const contadorCarrinho = document.getElementById("contadorCarrinho");
    contadorCarrinho.textContent = carrinho.reduce((total, produto) => total + produto.quantidade, 0);

    const produtosCarrinho = document.getElementById("produtosCarrinho");
    produtosCarrinho.innerHTML = '';

    carrinho.forEach(produto => {
        const div = document.createElement("div");
        div.classList.add("produtoCarrinho");
        div.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" width="50">
            <h3>${produto.nome}</h3>
            <p class="preco">R$ ${(produto.preco * produto.quantidade).toFixed(2)}</p>
            <p>Quantidade: 
                <button onclick="alterarQuantidade('${produto.id}', -1)">-</button>
                ${produto.quantidade}
                <button onclick="alterarQuantidade('${produto.id}', 1)">+</button>
            </p>
            <!-- Substituindo o texto "Remover" pelo ícone de lixeira -->
            <button onclick="removerDoCarrinho('${produto.id}')">
                <i class="bi bi-trash"></i> <!-- Ícone de lixeira -->
            </button>
        `;
        produtosCarrinho.appendChild(div);
    });

    // Adicionando o botão de finalizar compra
    const finalizarButton = document.createElement("button");
    finalizarButton.textContent = "Finalizar Compra";
    finalizarButton.onclick = finalizarCompra;
    produtosCarrinho.appendChild(finalizarButton);
}

function alterarQuantidade(id, delta) {
    const produto = carrinho.find(produto => produto.id === id);
    if (produto) {
        produto.quantidade += delta;
        if (produto.quantidade <= 0) {
            removerDoCarrinho(id);
        } else {
            atualizarCarrinho();
        }
    }
}

function mostrarCarrinho() {
    const carrinhoModal = document.getElementById("carrinhoModal");
    carrinhoModal.style.display = "flex";
}

function fecharCarrinho() {
    const carrinhoModal = document.getElementById("carrinhoModal");
    carrinhoModal.style.display = "none";
}

function calcularTotalCarrinho() {
    return carrinho.reduce((total, produto) => total + produto.preco * produto.quantidade, 0);
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Por favor, adicione produtos ao carrinho antes de finalizar a compra.");
        return;  // Impede a finalização se o carrinho estiver vazio
    }

    let mensagem = "Confira seu pedido:\n\n";

    carrinho.forEach(produto => {
        mensagem += `${produto.nome} - R$ ${(produto.preco * produto.quantidade).toFixed(2)} (Quantidade: ${produto.quantidade})\n`;
    });

    mensagem += `\nTotal: R$ ${calcularTotalCarrinho().toFixed(2)}\n\nPara finalizar a compra, por favor, entre em contato pelo WhatsApp.`;

    // Substitua o número de telefone abaixo pelo número de sua empresa
    const numeroWhatsApp = "5561983652801";  // Exemplo: número de WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    window.open(urlWhatsApp, "_blank");

    // Limpar o carrinho após a compra
    carrinho = [];
    atualizarCarrinho();
    fecharCarrinho();
}

// Carregar produtos na página
carregarProdutos();
