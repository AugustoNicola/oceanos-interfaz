export async function llamarBackend(endpoint, body) {
  const respuesta = await fetch(`http://localhost:8000/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!respuesta.ok) {
    const text = await respuesta.text();
    throw new Error(text || "Ocurrió algún error...");
  }

  return respuesta.json();
}
