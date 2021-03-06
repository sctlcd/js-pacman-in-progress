import { Pacman, rotateDiv } from './pacman.js';
import { Ghost } from './ghost.js';
import { squares, createBoard } from './board.js'

document.addEventListener('DOMContentLoaded', () => {

    const scoreDisplay = document.getElementById('score');
    const width = 28; // 28 x 28 = 784 squares
    let score = 0;

    createBoard();

    let pacman = new Pacman('pac-man', 490, 300);


    // draw pacman onto the grid
    squares[pacman.currentIndex].classList.add(pacman.className);

    // move pac-man
    function movePacman(e) {
        squares[pacman.currentIndex].classList.remove('pac-man');

        /*
          key | code | movement | rotation(degree)
          left arrow | 37 | -1 | 180
          up arrow | 38 | -width | 270
          right arrow | 39 | +1 | 0
          down arrow | 40 | +width | 90
          */
        switch (e.keyCode) {
            case 37:
                if (pacman.currentIndex % width !== 0 &&
                    !squares[pacman.currentIndex - 1].classList.contains('wall') &&
                    !squares[pacman.currentIndex - 1].classList.contains('ghost-lair')) {
                    pacman.currentIndex -= 1;
                    rotateDiv(pacman.currentIndex, 180);
                }

                // check if pacman is in the left exist
                if ((pacman.currentIndex - 1) === 363) {
                    pacman.currentIndex = 391;
                }
                break;
            case 38:
                if (pacman.currentIndex - width >= 0 &&
                    !squares[pacman.currentIndex - width].classList.contains('wall') &&
                    !squares[pacman.currentIndex - width].classList.contains('ghost-lair')) {
                    pacman.currentIndex -= width;
                    rotateDiv(pacman.currentIndex, 270);
                }
                break;
            case 39:
                if (pacman.currentIndex % width < width - 1 &&
                    !squares[pacman.currentIndex + 1].classList.contains('wall') &&
                    !squares[pacman.currentIndex + 1].classList.contains('ghost-lair')) {
                    pacman.currentIndex += 1;
                    rotateDiv(pacman.currentIndex, 0);
                }

                // check if pacman is in the right exit
                if ((pacman.currentIndex + 1) === 392) {
                    pacman.currentIndex = 364;
                }
                break;
            case 40:
                if (pacman.currentIndex + width < width * width &&
                    !squares[pacman.currentIndex + width].classList.contains('wall') &&
                    !squares[pacman.currentIndex + width].classList.contains('ghost-lair')) {
                    pacman.currentIndex += width;
                    rotateDiv(pacman.currentIndex, 90);
                }
                break;
        }

        squares[pacman.currentIndex].classList.add('pac-man');

        pacDotEaten();
        powerPelletEaten();
        checkForGameOver();
        checkForWin();
    };

    // event listener on keyup event
    document.addEventListener('keyup', movePacman);

    // function when Pac-man eats a pac-dot
    function pacDotEaten() {
        if (squares[pacman.currentIndex].classList.contains('pac-dot')) {
            score++;
            scoreDisplay.innerHTML = score;
            squares[pacman.currentIndex].classList.remove('pac-dot');
        }
    };

    // function when Pac-man eats a power-pellet
    function powerPelletEaten() {
        if (squares[pacman.currentIndex].classList.contains('power-pellet')) {
            score += 10
            ghosts.forEach(ghost => ghost.isScared = true)
            setTimeout(unScareGhosts, 10000)
            squares[pacman.currentIndex].classList.remove('power-pellet')
        }
    };

    // function when the ghosts stop flashing
    function unScareGhosts() {
        ghosts.forEach(ghost => ghost.isScared = false)
    };

    let ghosts = [
        new Ghost('blinky', 348, 250),
        new Ghost('pinky', 376, 400),
        new Ghost('inky', 351, 300),
        new Ghost('clyde', 379, 500)
    ]

    // draw my ghost onto the grid
    ghosts.forEach(ghost => {
        squares[ghost.currentIndex].classList.add(ghost.className);
        squares[ghost.currentIndex].classList.add('ghost');
    });

    // move the Ghosts randomly
    ghosts.forEach(ghost => moveGhost(ghost))

    // function to move the ghosts
    function moveGhost(ghost) {
        const directions = [-1, +1, width, -width]
        let direction = directions[Math.floor(Math.random() * directions.length)]

        ghost.timerId = setInterval(function() {
            // if the next square your ghost is going to go in/meet does not have a ghost and does not have a wall
            if (!squares[ghost.currentIndex + direction].classList.contains('ghost') &&
                !squares[ghost.currentIndex + direction].classList.contains('wall')) {
                // remove the ghosts classes
                squares[ghost.currentIndex].classList.remove(ghost.className, 'ghost', 'scared-ghost')
                    // squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')
                    // move into that space
                ghost.currentIndex += direction
                squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
                    // else find a new random direction ot go in
            } else direction = directions[Math.floor(Math.random() * directions.length)]

            // if the ghost is scared
            if (ghost.isScared) {
                squares[ghost.currentIndex].classList.add('scared-ghost')
            }

            // if the ghost is scared and pacman is on it
            if (ghost.isScared && squares[ghost.currentIndex].classList.contains('pac-man')) {
                squares[ghost.currentIndex].classList.remove(ghost.className, 'ghost', 'scared-ghost')
                ghost.currentIndex = ghost.startIndex
                score += 100
                squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
            }

            checkForGameOver();

        }, ghost.speed)
    };

    // function to check for game over
    function checkForGameOver() {
        if (squares[pacman.currentIndex].classList.contains('ghost') &&
            !squares[pacman.currentIndex].classList.contains('scared-ghost')) {
            ghosts.forEach(ghost => clearInterval(ghost.timerId))
            document.removeEventListener('keyup', movePacman)
            scoreDisplay.innerHTML = ' Game over!'
        }
    };

    // function to check for win
    function checkForWin() {
        if (score >= 274) {
            ghosts.forEach(ghost => clearInterval(ghost.timerId))
            document.removeEventListener('keyup', movePacman)
            scoreDisplay.innerHTML = ' WON!'
        }
    };
});