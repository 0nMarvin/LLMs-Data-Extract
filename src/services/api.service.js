export async function fetchApi(url, options) {
  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    const msg = json.error?.message || json.message || "Erro na requisição";
    throw new Error(msg);
  }

  return { response, json };
}