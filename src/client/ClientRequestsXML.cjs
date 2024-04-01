// COMMON JS
// XMLHttpRequest


export function sendLoginReq(){
    console.log("Sending Login Request");
    const xhr = new XMLHttpRequest();
    xhr.open("GET","http://127.0.0.1:8080");
    //xhr.send();
    let jsonObj = {
    employees:[
        {"firstName":"John", "lastName":"Doe"},
        {"firstName":"Anna", "lastName":"Smith"},
        {"firstName":"Peter", "lastName":"Jones"}
    ]
    }
    xhr.send(JSON.stringify(jsonObj))
    // xhr.responseType = "json";
    xhr.responseType = 'json';
    xhr.setRequestHeader
    xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        const data = xhr.response;
        console.log("Client Received: " + JSON.stringify(data));
    } else {
        console.log(`Error: ${xhr.status}`);
    }
    };
}