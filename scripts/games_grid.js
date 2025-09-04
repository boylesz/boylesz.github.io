fetch('games.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('games-grid');

        data.forEach(game => {
            const gameCell = document.createElement('div');
            gameCell.classList.add('game-cell');

            const link1 = document.createElement('a');
            link1.href = game.link;
            link1.target = '_blank';

            const img = document.createElement('img');
            img.src = "resources/games/" + game.image;
            link1.appendChild(img);

            const link2 = document.createElement('a');
            link2.href = game.link;
            link2.target = '_blank';

            const title = document.createElement('h3');
            title.textContent = game.name;
            link2.appendChild(title);

            const desc = document.createElement('p');
            desc.textContent = game.description;

            
            gameCell.appendChild(link1);
            gameCell.appendChild(link2);
            gameCell.appendChild(desc);
            
            if (game.tags?.length > 0) {
                game.tags.forEach(tag => {
                    const tagEl = document.createElement('span');
                    tagEl.textContent = tag.text;
                    tagEl.style.backgroundColor = tag.color;
                    tagEl.className = "game-tag"
                    gameCell.appendChild(tagEl);
                })
            }

            container.appendChild(gameCell);
        });
    })
    .catch(error => console.error('Error loading game data:', error));