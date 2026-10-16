const botaoAtivar = document.querySelector("#ativar-notificacoes");
const botaoSimular = document.querySelector("#simular-notificacao");
const status = document.querySelector("#status");

let serviceWorkerRegistration;

function mostrarStatus(mensagem, tipo = "") {
  status.textContent = mensagem;
  status.className = tipo;
}

function notificacoesSaoSuportadas() {
  return "Notification" in window && "serviceWorker" in navigator;
}

async function registrarServiceWorker() {
  serviceWorkerRegistration ??= await navigator.serviceWorker.register("./testes.js");
  await navigator.serviceWorker.ready;
  return serviceWorkerRegistration;
}

async function atualizarTela() {
  if (!notificacoesSaoSuportadas()) {
    botaoAtivar.disabled = true;
    mostrarStatus("Este navegador não oferece suporte a notificações.", "erro");
    return;
  }

  if (!window.isSecureContext) {
    botaoAtivar.disabled = true;
    mostrarStatus("Abra a página em http://localhost ou HTTPS para testar notificações.", "erro");
    return;
  }

  if (Notification.permission === "granted") {
    await registrarServiceWorker();
    botaoAtivar.disabled = true;
    botaoAtivar.textContent = "Notificações ativadas";
    botaoSimular.disabled = false;
    mostrarStatus("Notificações permitidas. Já é possível simular uma solicitação.", "sucesso");
    return;
  }

  if (Notification.permission === "denied") {
    botaoAtivar.disabled = true;
    mostrarStatus("As notificações foram bloqueadas. Libere-as nas configurações do navegador e recarregue a página.", "erro");
    return;
  }

  mostrarStatus("Clique em “Ativar notificações” para conceder a permissão.");
}

botaoAtivar.addEventListener("click", async () => {
  try {
    const permissao = await Notification.requestPermission();

    if (permissao !== "granted") {
      await atualizarTela();
      return;
    }

    await registrarServiceWorker();
    await atualizarTela();
  } catch (erro) {
    console.error(erro);
    mostrarStatus("Não foi possível ativar as notificações. Veja o console para detalhes.", "erro");
  }
});

botaoSimular.addEventListener("click", async () => {
  try {
    const registration = await registrarServiceWorker();
    await registration.showNotification("NOVO CHAMADO!", {
      body: "Você recebeu uma nova solicitação DA Jornada do Cooperado da consultoria.",
      tag: "Jornada do Cooperado",
      renotify: true,
      data: { url: location.href },
      icon: "./img/headset-barracred.png"
    });
    mostrarStatus("Notificação de teste enviada.", "sucesso");
  } catch (erro) {
    console.error(erro);
    mostrarStatus("Não foi possível mostrar a notificação. Veja o console para detalhes.", "erro");
  }
});

atualizarTela();
