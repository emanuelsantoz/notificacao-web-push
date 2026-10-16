self.addEventListener("push", (event) => {
  const dados = event.data?.json() ?? {};

  event.waitUntil(
    self.registration.showNotification(dados.title || "NOVO CHAMADO!", {
      body: dados.body || "Você recebeu uma nova solicitação DA Jornada do Cooperado da consultoria.",
      data: { url: dados.url || "/" }
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
