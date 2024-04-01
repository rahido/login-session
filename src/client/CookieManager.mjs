

export function logPrintAllCookies() {
  let decodedCookie = decodeURIComponent(document.cookie);
  console.log("All Cookies:" + decodedCookie);
}


export function getCookieValue(key) {
    console.log("CookieManager.cjs - getCookieValue: " + key);
    let cname = key + "=";
    let value = "";
    let decodedCookie = decodeURIComponent(document.cookie);
    let splitCookies = decodedCookie.split(";");
    for (let i = 0; i < splitCookies.length; i++) {
      if (splitCookies[i].trim().startsWith(cname)) {
        value = splitCookies[i].split("=")[1];
        break;
      }
    }
    return value;
  }

export function getSessionIsValid(){
    console.log("CookieManager.cjs - getSessionIsValid: " + (getCookieValue("refreshId").length>0).toString());
    return getCookieValue("refreshId").length>0;
}

export function setCookies(userId,sessionIds) {
    console.log("CookieManager.cjs - Setting cookies");
    document.cookie = `userId=${userId}; SameSite=None; Secure; path=/`;
    document.cookie = `sessionId=${sessionIds.sessionId}; SameSite=None; Secure; expires=${sessionIds.sessionExpire}"; path=/`;
    document.cookie = `refreshId=${sessionIds.refreshId}; SameSite=None; Secure; expires=${sessionIds.refreshExpire}"; path=/`;
    logPrintAllCookies();
  }

export function clearUserCookies(){
  console.log("CookieManager.cjs - Clearing cookies");
    document.cookie = `userId=; SameSite=None; Secure; path=/`;
    document.cookie = `sessionId=; SameSite=None; Secure; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `refreshId=; SameSite=None; Secure; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  
}

