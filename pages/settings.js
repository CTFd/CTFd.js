import CTFd from "../main";

export async function updateSettings(body) {
  const response = await CTFd.fetch("/api/v1/users/me", {
    method: "PATCH",
    body: JSON.stringify(body)
  });
  const settings = await response.json();
  return settings;
}

export async function generateToken(body) {
  const response = await CTFd.fetch("/api/v1/tokens", {
    method: "POST",
    body: JSON.stringify(body)
  });
  const token = await response.json();
  return token;
}

export async function deleteToken(tokenId) {
  const response = CTFd.fetch(`/api/v1/tokens/${tokenId}`, {
    method: "DELETE"
  });
  const token = await response.json();
  return token;
}
