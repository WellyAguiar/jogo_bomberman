// Variáveis do jogo
const gridSize = 10;
const grid = [];
const bombs = [];
let player1Wins = 0;
let player2Wins = 0;
let player1BombActive = false;
let player2BombActive = false;
let player1BombTimeout;
let player2BombTimeout;

const player1 = {
    x: 0,
    y: 0,
};
const player2 = {
    x: gridSize -1,
    y: gridSize -1,
};

const player1Trail = [];
const player2Trail = [];


function createGameGrid() {
    const gameContainer = document.getElementById("game-container");

    // Verifique se a grid já foi criada
    if (grid.length === 0) {
        for (let i = 0; i < gridSize; i++) {
            const row = [];
            for (let j = 0; j < gridSize; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");

                // Verifica se a célula está na posição de nascimento de um jogador
                const isPlayerSpawnCell = (i === player1.y && j === player1.x) || (i === player2.y && j === player2.x);

                if (isPlayerSpawnCell) {
                    // Célula onde um jogador está, não adiciona a classe "block"
                    row.push(cell);
                } else {
                    // Verifica se a célula é adjacente a um jogador ou a célula inicial do jogador
                    const isAdjacentToPlayer = (
                        (Math.abs(i - player1.y) === 1 && j === player1.x) ||
                        (i === player1.y && Math.abs(j - player1.x) === 1) ||
                        (Math.abs(i - player2.y) === 1 && j === player2.x) ||
                        (i === player2.y && Math.abs(j - player2.x) === 1) ||
                        (i === player1.y && j === player1.x) || // Adicione a célula inicial do jogador à lista de adjacentes
                        (i === player2.y && j === player2.x) // Adicione a célula inicial do jogador à lista de adjacentes
                    );

                    if (isAdjacentToPlayer) {
                        // Célula adjacente a um jogador ou a célula inicial do jogador, não adiciona a classe "block"
                    } else {
                        // Célula normal, adiciona a classe "block"
                        cell.classList.add("block");
                    }
                    row.push(cell);
                }

                gameContainer.appendChild(cell);
            }
            grid.push(row);
        }
        updatePlayerPosition(player1, "player-1", player1Trail);
        updatePlayerPosition(player2, "player-2", player2Trail);

    } else {
        // Reposicione os jogadores nas posições iniciais e adicione as classes aos jogadores
        player1.x = 0;
        player1.y = 0;
        player2.x = gridSize - 1;
        player2.y = gridSize - 1;
        updatePlayerPosition(player1, "player-1", player1Trail);
        updatePlayerPosition(player2, "player-2", player2Trail);

        setTimeout(() => {
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    setTimeout(function() {
                        const cell = grid[i][j];
                        cell.classList.remove("bomb", "block", "explosion");
            
                        // Verifica se a célula é adjacente a um jogador
                        const isAdjacentToPlayer = (
                            (Math.abs(i - player1.y) === 1 && j === player1.x) ||
                            (i === player1.y && Math.abs(j - player1.x) === 1) ||
                            (Math.abs(i - player2.y) === 1 && j === player2.x) ||
                            (i === player2.y && Math.abs(j - player2.x) === 1) ||
                            (i === player1.y && j === player1.x) || // Adicione a célula inicial do jogador à lista de adjacentes
                            (i === player2.y && j === player2.x) // Adicione a célula inicial do jogador à lista de adjacentes
                        );
            
                        if (isAdjacentToPlayer) {
                            // Célula adjacente a um jogador, não adiciona a classe "block"
                        } else {
                            // Célula normal, adiciona a classe "block"
                            cell.classList.add("block");
                        }
                    }, 5 * (i * gridSize + j)); // Atraso de 1 segundo multiplicado pela posição na grade
                }
            }
            
        }, 0);
        // Remova as classes "block" das células com paredes
        grid[3][3].classList.remove("block");
        grid[5][7].classList.remove("block");
        grid[5][6].classList.remove("block");
        grid[5][5].classList.remove("block");
    }

    console.log("Create grid");
}

// Função para remover o rastro de um jogador
function clearPlayerTrail(playerTrail) {
    for (const cell of playerTrail) {
        cell.classList.remove("player-1", "player-2");
    }
    playerTrail.length = 0;

}

// Função para atualizar a posição do jogador
function updatePlayerPosition(player, className, playerTrail) {
    let playerCell = grid[player.y][player.x];
    playerCell.classList.add(className);
    playerTrail.push(playerCell);
}

function checkPlayerCollision(player1, player2) {
    return player1.x === player2.x && player1.y === player2.y;
}
function playerExploded(playerNumber) {
    // Encontre a célula do jogador
    const playerCell = document.querySelector('.player-' + playerNumber);

    // Agora, você pode adicionar uma vitória ao jogador vencedor e atualizar a exibição das vitórias, mas não precisa remover o jogador aqui
    const opponentNumber = playerNumber === 1 ? 2 : 1; // Determina o número do oponente
    if (opponentNumber === 1) {
        player1Wins++;
    } else {
        player2Wins++;
    }

    // Atualize a exibição das vitórias
    updateWinsDisplay();

    // Interrompa os temporizadores das bombas
    clearTimeout(player1BombTimeout); // Interrompa o temporizador do jogador 1, se aplicável
    clearTimeout(player2BombTimeout); // Interrompa o temporizador do jogador 2, se aplicável

    // Redefina as flags de bomba ativa para ambos os jogadores
    player1BombActive = false;
    player2BombActive = false;

    // Agora, resete o jogo
    resetGame();
}

function updateWinsDisplay() {
    // Atualize a exibição das vitórias na interface do jogo
    document.getElementById('player1Wins').innerText = "P1: " + player1Wins;
    document.getElementById('player2Wins').innerText = "P2: " + player2Wins;
}

function resetGame() {
    // Remova todas as classes das células, exceto "cell"
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('player-1', 'player-2', 'bomb', 'block', 'explosion');
    });

    bombs.length = 0;
    document.querySelectorAll('.bomb').forEach(bombCell => bombCell.remove());
    document.querySelectorAll('.explosion').forEach(explosionCell => explosionCell.remove());

    createGameGrid();    

    // Atualize a exibição das vitórias
    updateWinsDisplay();
}

function handleBombDrop(player) {
    const cell = grid[player.y][player.x];
    if (!cell.classList.contains("bomb")) {
        if ((player === player1 && !player1BombActive) || (player === player2 && !player2BombActive)) {
            const bombElement = document.createElement("div");
            bombElement.classList.add("bomb");
            cell.classList.add("bomb");
            const bomb = { x: player.x, y: player.y, timer: 3 };
            bombs.push(bomb);

            // Defina a flag de bomba ativa para o jogador atual
            if (player === player1) {
                player1BombActive = true;
            } else if (player === player2) {
                player2BombActive = true;
            }

            // Adicione um temporizador individual para cada bomba
            const bombTimeout = setTimeout(() => {
                explodeBomb(bomb);

                // Remova a flag de bomba ativa quando a bomba explodir
                if (player === player1) {
                    player1BombActive = false;
                } else if (player === player2) {
                    player2BombActive = false;
                }
            }, bomb.timer * 1000); // Converta para milissegundos

            // Salve o identificador do temporizador em uma variável adequada
            if (player === player1) {
                player1BombTimeout = bombTimeout;
            } else if (player === player2) {
                player2BombTimeout = bombTimeout;
            }

            // Remova a classe "bomb" da célula da bomba após o término do temporizador
            setTimeout(() => {
                cell.classList.remove("bomb");
            }, bomb.timer * 1000);
        }
    }
}


function updateBombs() {
    for (let i = bombs.length - 1; i >= 0; i--) {
        const bomb = bombs[i];
        bomb.timer--;
        if (bomb.timer <= 0) {
            // A bomba explodiu, remova-a do array e exploda os blocos próximos
            explodeBomb(bomb);
            bombs.splice(i, 1);
        }
    }
}

function explodeBomb(bomb) {
    const explosionRadius = 1; // Raio de explosão (1 célula para cada direção)
    const directions = [
        { dx: 0, dy: 0 },  // Centro (própria bomba)
        { dx: 0, dy: 1 },  // Direita
        { dx: 0, dy: -1 }, // Esquerda
        { dx: 1, dy: 0 },  // Abaixo
        { dx: -1, dy: 0 }  // Acima
    ];

    // Verifique a explosão no centro (própria bomba)
    const bombCell = grid[bomb.y][bomb.x];

    // Adicione a explosão no local da bomba
    const bombExplosionElement = document.createElement("div");
    bombExplosionElement.classList.add("explosion");
    bombCell.appendChild(bombExplosionElement);

    // Ouvinte de evento para remover a explosão da bomba após a animação
    bombExplosionElement.addEventListener("animationend", () => {
        bombCell.removeChild(bombExplosionElement); // Remove o elemento de explosão após a animação terminar
    });

    // Verifique explosões nas direções (exceto no centro)
    for (let i = 1; i <= explosionRadius; i++) {
        for (const dir of directions) {
            const x = bomb.x + dir.dx * i;
            const y = bomb.y + dir.dy * i;

            if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
                continue; // Pule as direções que ultrapassam os limites do grid
            }

            const cell = grid[y][x];

            if (cell.classList.contains("player-1")) {
                playerExploded(1); // Chame a função playerExploded para o jogador 1
            } else if (cell.classList.contains("player-2")) {
                playerExploded(2); // Chame a função playerExploded para o jogador 2
            }

            const explosionElement = document.createElement("div");
            explosionElement.classList.add("explosion");
            cell.appendChild(explosionElement);

            cell.classList.remove("block"); // Remove blocos após a explosão
            explosionElement.addEventListener("animationend", () => {
                cell.removeChild(explosionElement); // Remove o elemento de explosão após a animação terminar
            });
        }
    }

    // Remova a classe "bomb" da célula da bomba após a explosão
    bombCell.classList.remove("bomb");
}



// Função para lidar com eventos de teclado do jogador 1 (WASD)
function handleKeyPressPlayer1(event) {
    const oldX = player1.x;
    const oldY = player1.y;
    console.log(player1);

    if (event.key === "w" && player1.y > 0) {
        player1.y--;
    } else if (event.key === "s" && player1.y < gridSize - 1) {
        player1.y++;
    } else if (event.key === "a" && player1.x > 0) {
        player1.x--;
    } else if (event.key === "d" && player1.x < gridSize - 1) {
        player1.x++;
    }

    const newCell = grid[player1.y][player1.x];
    if (newCell.classList.contains("block") || checkPlayerCollision(player1, player2)) {
        // Lógica para lidar com colisões com blocos aqui
        player1.x = oldX;
        player1.y = oldY;
    } else {
        // Verifica se o jogador 1 está sobrepondo o rastro do jogador 2
        if (newCell.classList.contains("player-2")) {
            // Lógica para lidar com a sobreposição do rastro do jogador 2 aqui
            // Por exemplo, você pode remover o rastro do jogador 2 ou terminar o jogo
            newCell.classList.remove("player-2"); // Remove o rastro do jogador 2
            // Atualiza a posição do jogador 1 após remover o rastro do jogador 2
            updatePlayerPosition(player1, "player-1", player1Trail);
        } else {
            clearPlayerTrail(player1Trail); // Limpa o rastro do jogador 1
            updatePlayerPosition(player1, "player-1", player1Trail);
        }
    }
}

// Função para lidar com eventos de teclado do jogador 2 (Setas)
function handleKeyPressPlayer2(event) {
    const oldX = player2.x;
    const oldY = player2.y;

    if (event.key === "ArrowUp" && player2.y > 0) {
        player2.y--;
    } else if (event.key === "ArrowDown" && player2.y < gridSize - 1) {
        player2.y++;
    } else if (event.key === "ArrowLeft" && player2.x > 0) {
        player2.x--;
    } else if (event.key === "ArrowRight" && player2.x < gridSize - 1) {
        player2.x++;
    }

    const newCell = grid[player2.y][player2.x];
    if (newCell.classList.contains("block") || checkPlayerCollision(player2, player1)) {
        // Lógica para lidar com colisões com blocos aqui
        player2.x = oldX;
        player2.y = oldY;
    }
    clearPlayerTrail(player2Trail); // Limpa o rastro do jogador 2

    updatePlayerPosition(player2, "player-2", player2Trail);
}

// Event listeners para capturar eventos de teclado
document.addEventListener("keydown", handleKeyPressPlayer1);
document.addEventListener("keydown", handleKeyPressPlayer2);
document.addEventListener("keydown", (event) => {
    if (event.key === " ") { // Barra de espaço
        handleBombDrop(player1); // Para o jogador 1
        console.log(grid);

    } else if (event.key === "Enter") { // Tecla Enter
        handleBombDrop(player2); // Para o jogador 2
    }
});

// Chamada para criar o grid do jogo
createGameGrid();
