let dados = [];

// Carrega o CSV e obtém a data real de modificação
fetch("dados.csv")
  .then(response => {
    const dataArquivo = new Date(response.headers.get("Last-Modified"));
    if (!isNaN(dataArquivo)) {
      const opcoes = { 
        day: "2-digit", month: "2-digit", year: "numeric", 
        hour: "2-digit", minute: "2-digit"
      };
      document.getElementById("ultimaAtualizacao").textContent =
        "Última atualização: " + dataArquivo.toLocaleString("pt-BR", opcoes);
    }
    return response.text();
  })
  .then(text => {
    dados = text.split("\n").slice(1).map(linha => {
      const [cidade, transportadora, uf, prazo, tipo] = linha.split(",");
      return { cidade, transportadora, uf, prazo, tipo };
    });
  });

// Elementos
const tbody = document.querySelector("#results tbody");
const inputGeral = document.getElementById("searchGeral");
const sugestoes = document.getElementById("suggestionsGeral");
const contador = document.getElementById("contadorResultados");

// Destacar termo
function destacar(texto, termo) {
  if (!termo) return texto;
  const regex = new RegExp(termo, "gi");
  return texto.replace(regex, match => `<mark>${match}</mark>`);
}

// Mostrar resultados
function mostrarResultados(filtrados, termo) {
  tbody.innerHTML = "";
  if (filtrados.length === 0) {
    tbody.innerHTML = "<tr><td colspan='5'>Nenhum resultado encontrado.</td></tr>";
    contador.textContent = "";
    return;
  }

  filtrados.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${destacar(d.cidade || "", termo)}</td>
      <td>${destacar(d.transportadora || "", termo)}</td>
      <td>${destacar(d.uf || "", termo)}</td>
      <td>${d.prazo || ""}</td>
      <td>${d.tipo || ""}</td>
    `;
    tbody.appendChild(tr);
  });

  contador.textContent = `${filtrados.length} resultado${filtrados.length > 1 ? "s" : ""} encontrado${filtrados.length > 1 ? "s" : ""}`;
}

// Filtro geral
function buscar(termo) {
  termo = termo.toLowerCase();
  const filtrados = dados.filter(d =>
    d.cidade?.toLowerCase().includes(termo) ||
    d.transportadora?.toLowerCase().includes(termo) ||
    d.uf?.toLowerCase().includes(termo)
  );
  mostrarResultados(filtrados, termo);
}

// Sugestões automáticas
inputGeral.addEventListener("input", () => {
  const termo = inputGeral.value.toLowerCase();
  sugestoes.innerHTML = "";
  if (termo.length < 2) return;

  const combinados = dados.flatMap(d => [d.cidade, d.transportadora, d.uf]);
  const unicos = [...new Set(combinados.filter(v => v?.toLowerCase().includes(termo)))];
  unicos.slice(0, 5).forEach(valor => {
    const li = document.createElement("li");
    li.textContent = valor;
    li.onclick = () => {
      inputGeral.value = valor;
      sugestoes.innerHTML = "";
      buscar(valor);
    };
    sugestoes.appendChild(li);
  });
});

// Pressionar Enter
inputGeral.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    sugestoes.innerHTML = "";
    buscar(inputGeral.value);
  }
});

// Fechar sugestões ao clicar fora
document.addEventListener("click", e => {
  if (!sugestoes.contains(e.target) && e.target !== inputGeral) {
    sugestoes.innerHTML = "";
  }
});
