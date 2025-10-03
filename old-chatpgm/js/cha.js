class ChatManager {
  constructor() {
    (this.rateLimit = Security.initRateLimit()),
      (this.messageQueue = []),
      (this.isProcessing = !1),
      (this.retryCount = 0),
      (this.maxRetries = 3);
  }
  async sendMessage(t, e) {
    if (!t || "string" != typeof t) throw Error("Mensagem inv\xe1lida");
    if (!Security.checkRateLimit(this.rateLimit))
      throw Error("Muitas requisi\xe7\xf5es. Por favor, aguarde um momento.");
    let i = Security.sanitizeInput(t);
    if (i.length > 500) throw Error("Mensagem muito longa");
    try {
      let s = await fetch(
        "https://n8n-h1.pmfi.pr.gov.br/webhook-test/93fca1b0-9224-43fa-b08a-07f481c9d040",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Session-ID": e },
          body: JSON.stringify({ session_id: e, text: i }),
          credentials: "same-origin",
        }
      );
      if (!s.ok) throw Error(`HTTP error! status: ${s.status}`);
      let a = await s.json();
      return a;
    } catch (r) {
      if (
        (console.error("Erro na requisi\xe7\xe3o:", r),
        this.retryCount < this.maxRetries)
      )
        return (
          this.retryCount++,
          new Promise((i) => {
            setTimeout(() => {
              i(this.sendMessage(t, e));
            }, 1e3 * this.retryCount);
          })
        );
      throw Error("Falha ao enviar mensagem ap\xf3s v\xe1rias tentativas");
    }
  }
}
