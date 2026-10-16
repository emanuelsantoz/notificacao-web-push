self.addEventListener("push", (event) => {
  const dados = event.data?.json() ?? {};

  event.waitUntil(
    self.registration.showNotification(dados.title || "Nova solicitação", {
      body: dados.body || "Você recebeu uma nova solicitação.",
      data: { url: dados.url || "/" }
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
