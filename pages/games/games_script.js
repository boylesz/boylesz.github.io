const apiKey = 'iSgeQrUMdbdatfho34urIBkxTJvQF4wgRtaZnKGb';
const apiURL = 'https://itch.io/api/1/KEY/my-games';

const outputElement = document.querySelector('.exampleElement');

const requestOptions = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${apiKey}`
    }
};

fetch(apiURL, requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        outputElement.textContent = JSON.stringify(data, null, 2);
    })
    .catch(error => {
        console.error('Error:', error);
    });