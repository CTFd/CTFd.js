import CTFd from "../main";

export async function updateSettings(body) {
  const response = await CTFd.fetch("/api/v1/users/me", {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  return await response.json(); // settings
}

export async function generateToken(body) {
  const response = await CTFd.fetch("/api/v1/tokens", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return await response.json(); // token
}

export async function deleteToken(tokenId) {
  const response = await CTFd.fetch(`/api/v1/tokens/${tokenId}`, {
    method: "DELETE",
  });

  return await response.json(); // token
}
