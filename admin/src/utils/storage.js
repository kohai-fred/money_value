const TOKEN_NAME = "token";

function setTokenStorage(token) {
  window.sessionStorage.setItem(TOKEN_NAME, token);
}

function getTokenStorage() {
  return window.sessionStorage.getItem(TOKEN_NAME) ?? null;
}

function removeTokenStorage() {
  window.sessionStorage.removeItem(TOKEN_NAME);
}

export { setTokenStorage, getTokenStorage, removeTokenStorage };
