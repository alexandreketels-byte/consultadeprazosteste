let dados = [];

// Carrega o arquivo CSV
fetch("prazos.csv")
  .then(res => res.text())
  .then(texto => {
    const linhas = texto.trim().split("\n");
    linhas.slice(1).forEach(linha => {
      const [cidade, transportadora, prazo] = linha.split(",");
      dados.push({
        cidade: cidade.trim().toLowerCase(),
        transportadora: transportadora.trim(),
        prazo: prazo.trim()
      });
    });
  });

function buscarPrazo() {
  const cidadeInput = document.getElementById("cidadeInput").value.trim().toLowerCase();
  const resultadoDiv = document.getElementById("resultado");
  
  const resultado = dados.find(d => d.cidade === cidadeInput);

  if (resultado) {
    resultadoDiv.innerHTML = `
      <table>
        <tr><th>Cidade</th><th>Transportadora</th><th>Prazo (dias)</th></tr>
        <tr><td>${capitalize(resultado.cidade)}</td><td>${resultado.transportadora}</td><td>${resultado.prazo}</td></tr>
      </table>
    `;
  } else {
    resultadoDiv.innerHTML = `<p style="color:red;">Cidade não encontrada.</p>`;
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}