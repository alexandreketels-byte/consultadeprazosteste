let dados = [];

async function carregarCSV() {
    const response = await fetch('prazos.csv');
    const data = await response.text();

    const linhas = data.split('\n').map(l => l.trim()).filter(l => l);
    const cabecalho = linhas[0].split(',');

    dados = linhas.slice(1).map(linha => {
        const valores = linha.split(',');
        let obj = {};
        cabecalho.forEach((coluna, i) => {
            obj[coluna.trim()] = valores[i] ? valores[i].trim() : "";
        });
        return obj;
    });
}

function exibirResultados(filtrados) {
    const tabela = document.getElementById('resultado');
    tabela.innerHTML = "";

    filtrados.forEach(linha => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${linha["Cidade"]}</td>
            <td>${linha["Transportadora"]}</td>
            <td>${linha["UF"]}</td>
            <td>${linha["Prazo/Dias"]}</td>
            <td>${linha["Capital/Interior"]}</td>
        `;
        tabela.appendChild(tr);
    });
}

document.getElementById("pesquisa").addEventListener("input", function () {
    const termo = this.value.toLowerCase();
    const filtrados = dados.filter(l => l["Cidade"].toLowerCase().includes(termo));
    exibirResultados(filtrados);
});

document.getElementById("pesquisa").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        const termo = this.value.toLowerCase();
        const filtrados = dados.filter(l => l["Cidade"].toLowerCase().includes(termo));
        exibirResultados(filtrados);
    }
});

carregarCSV();
