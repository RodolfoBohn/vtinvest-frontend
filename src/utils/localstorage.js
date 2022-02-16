export function getLocalStorage(item) {
    return JSON.parse(localStorage.getItem(item));
  }
  
  export function setLocalStorage(item, valor) {
    localStorage.setItem(item, JSON.stringify(valor));
  }
  
  export function clearLocalStorage() {
    localStorage.clear();
  }
  