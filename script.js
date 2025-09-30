let dados = [];

// Carrega o arquivo CSV
fetch("prazos.csv")
  .then(res => res.text())
  .then(texto => {
    const linhas = texto.trim().split("\n");
    linhas.slice(1).forEach(linha => {
      const [cidade, transportadora, prazo, dias, regiao] = linha.split(",");
      dados.push({
        cidade: cidade.trim(),
        transportadora: transportadora.trim(),
        prazo: prazo.trim(),
        dias: dias.trim(),
        regiao: regiao.trim()
      });
    });
  });

// Mostra sugestões enquanto digita
function mostrarSugestoes() {
  const input = document.getElementById("cidadeInput").value.toLowerCase();
  const listaSugestoes = document.getElementById("sugestoes");
  listaSugestoes.innerHTML = "";

  if (input.length > 0) {
    const sugestoes = dados.filter(d => d.cidade.toLowerCase().includes(input));
    sugestoes.slice(0,5).forEach(s => {
      const li = document.createElement("li");
      li.textContent = s.cidade;
      li.onclick = () => {
        document.getElementById("cidadeInput").value = s.cidade;
        listaSugestoes.innerHTML = "";
        buscarPrazo();
      };
      listaSugestoes.appendChild(li);
    });
  }
}

// Busca e mostra resultado
function buscarPrazo() {
  const cidadeInput = document.getElementById("cidadeInput").value.trim().toLowerCase();
  const resultadoDiv = document.getElementById("resultado");
  
  const resultado = dados.find(d => d.cidade.toLowerCase() === cidadeInput);

  if (resultado) {
    resultadoDiv.innerHTML = `
      <table>
        <tr>
          <th>Cidade</th>
          <th>Transportadora</th>
          <th>Prazo (dias)</th>
          <th>Dias de atendimento</th>
          <th>Capital / Interior</th>
        </tr>
        <tr>
          <td>${resultado.cidade}</td>
          <td>${resultado.transportadora}</td>
          <td>${resultado.prazo}</td>
          <td>${resultado.dias}</td>
          <td>${resultado.regiao}</td>
        </tr>
      </table>
    `;
  } else {
    resultadoDiv.innerHTML = `<p style="color:yellow;">Cidade não encontrada.</p>`;
  }
}