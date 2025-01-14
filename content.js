(() => {
  const divConteudo = document.getElementById("conteudo_imprimir");

  if (divConteudo) {
    const tabelas = divConteudo.querySelectorAll("table");
    //console.log("Tabelas encontradas:", tabelas);

    // Verifica se há pelo menos uma tabela
    if (tabelas.length > 0) {
      const jsonData = {};

      // Função genérica para processar tabelas (exceto imagens e dados complexos)
      const processarTabela = (tabela, objetoAlvo) => {
        const linhas = tabela.querySelectorAll("tr");
        linhas.forEach((linha) => {
          const celulas = linha.querySelectorAll("td");
          celulas.forEach((celula) => {
            const boldText = celula.querySelector("b")?.innerText?.trim();
            const content = celula.innerHTML
              .replace(/<[^>]+>/g, "") // Remove tags HTML
              .trim()
              .replace(boldText, "").replace("\n", " ").trim(); // Remove o texto em negrito

            if (boldText) {
              objetoAlvo[boldText.replace(":", "").trim()] =
                content || "Não informado";
            }
          });
        });
      };

      // Primeira tabela (Condição de Pagamento e Data de Emissão)
      if (tabelas.length > 0) {
        const cabecalho1 = {};
        processarTabela(tabelas[0], cabecalho1);
        jsonData["cabecalho1"] = cabecalho1;
      }

      // Segunda tabela (Vendedor e Tipo de Pedido)
      if (tabelas.length > 1) {
        const cabecalho2 = {};
        processarTabela(tabelas[1], cabecalho2);
        jsonData["cabecalho2"] = cabecalho2;
      }

      // Terceira tabela (Imagens e Orçamento)
      if (tabelas.length > 2) {
        const cabecalho3 = {};
        const celulas = tabelas[2].querySelectorAll("td");
        cabecalho3["logo_esquerda"] = celulas[0]?.querySelector("img")?.src || "Logo esquerda não encontrada";
        cabecalho3["titulo"] = celulas[1]?.innerText?.trim() || "Título não encontrado";

        const textoLimpo =  cabecalho3["titulo"].replace(/\n/g, '');
        const indiceNumero = textoLimpo.indexOf('Nº');
        if (indiceNumero !== -1) {
          // Extrai o número logo após 'Nº'
          const numeroPedido = textoLimpo.slice(indiceNumero + 2).trim();
          cabecalho3["numero_pedido"] = numeroPedido.trim() * 1 || "Título não encontrado";
      } 

        cabecalho3["logo_direita"] = celulas[2]?.querySelector("img")?.src || "Logo direita não encontrada";
        jsonData["cabecalho3"] = cabecalho3;
      }

      // Quarta tabela (Representada)
      if (tabelas.length > 3) {
        const cabecalho4 = {};
        processarTabela(tabelas[3], cabecalho4);
        jsonData["cabecalho4"] = cabecalho4;
      }

      // Quinta tabela (Informações do Cliente)
      if (tabelas.length > 4) {
        const cabecalho5 = {};
        processarTabela(tabelas[4], cabecalho5);
        jsonData["cabecalho5"] = cabecalho5;
      }

      //console.log("JSON gerado:", jsonData);

      // Processa a tabela de índice 5
      if (tabelas.length > 5) {
        const tabela = tabelas[5];
        const linhas = tabela.querySelectorAll("tbody > tr");

        if (linhas.length > 1) {
          jsonData["item"] = [];

          for (let i = 1; i < linhas.length; i++) {
            const celulas = linhas[i].querySelectorAll("td");

            if (celulas.length >= 8) {
              const produtoDetalhe =
                celulas[2]?.querySelector("table td")?.innerText?.trim() ||
                "Detalhe não encontrado";

              const objeto = {
                "id": parseInt(celulas[0]?.innerText?.trim(), 10) || null,
                "codigo": celulas[1]?.innerText?.trim() || "Código não encontrado",
                "produto": produtoDetalhe,
                "quantidade": parseInt(celulas[4]?.innerText?.trim(), 10) || 0,
                "preco_tabela": celulas[5]?.innerText?.trim().replace('R$ ', '').replace('.','').replace(',', '.') * 1  || "Preço não encontrado",
                "desconto": celulas[6]?.innerText?.trim() || "Desconto não encontrado",
                "preco_liquido": celulas[7]?.innerText?.trim().replace('R$ ', '').replace('.','').replace(',', '.') * 1  || "Preço Líquido não encontrado",
                "subtotal": celulas[8]?.innerText?.trim().replace('R$ ', '').replace('.','').replace(',', '.') * 1 || "Subtotal não encontrado",
              };

              jsonData["item"].push(objeto);
            } 
            /*else {
              console.warn(`Linha ${i + 1} com células insuficientes.`);
            }*/
          }

          console.log("JSON gerado:", { cabecalho: 
            {...jsonData.cabecalho1, ...jsonData.cabecalho2, ...jsonData.cabecalho3, ...jsonData.cabecalho4, ...jsonData.cabecalho5}, 
            detalhes: jsonData.item, });
        } 
        else {
          console.warn("Nenhuma linha encontrada na tabela além do cabeçalho.");
        }
      } else {
        console.warn("Tabela de índice 5 não encontrada.");
      }
    } else {
      console.warn("Nenhuma tabela encontrada.");
    }
  } else {
    console.error('Div com ID "conteudo_imprimir" não encontrada!');
  }
})();
