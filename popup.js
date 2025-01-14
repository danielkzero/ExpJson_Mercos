// popup.js
document.getElementById('executar').addEventListener('click', () => {
    // Envia uma mensagem para o console indicando o início do script
    console.log('Tentando executar o script na página ativa.');
  
    // Obtém a aba ativa e injeta o script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ['content.js'],
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error('Erro ao executar o script:', chrome.runtime.lastError.message);
            atualizarStatus('Erro ao executar o script.', true);
          } else {
            console.log('Script executado com sucesso!');
            atualizarStatus('Script executado com sucesso!');
          }
        }
      );
    });
  });
  
  // Função para atualizar o status no popup
  function atualizarStatus(mensagem, erro = false) {
    const status = document.getElementById('status');
    status.textContent = mensagem;
    status.style.color = erro ? 'red' : 'green';
  }
  