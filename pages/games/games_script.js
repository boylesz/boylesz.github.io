const apiKey = 'iSgeQrUMdbdatfho34urIBkxTJvQF4wgRtaZnKGb';
const apiURL = 'https://itch.io/api/1/KEY/my-games';

const outputElement = document.querySelector('.exampleElement');

const fetchPromise = fetch(apiURL, {
    method: "GET",
    mode: "cors",
    headers: {
        "X-PINGOTHER": "pingpong",
        "Access-Control-Allow-Method": "GET",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    }
});

fetchPromise.then(response => {
    console.log(response.status);
})