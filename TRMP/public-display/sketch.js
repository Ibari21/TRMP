const URL = `http://${window.location.hostname}:5050`;
let socket = io(URL, { path: '/real-time' });

const PORT = 5050;
const IPaddress = 'localhost';

let character = {
    x: 0,
    y: 0
};
let whiteMouse = {
    x: 50,
    y: 50
};
let speed = 10;
let score = 0;

function setup() {
    frameRate(60);
    createCanvas(windowWidth, windowHeight);
    character.x = windowWidth / 2;
    character.y = windowHeight / 2;
}

function draw() {
    background(0, 50);
    textSize(64);
    text('🐍', character.x - 25, character.y);
    textSize(24);
    text('🐁', whiteMouse.x, whiteMouse.y);
    eatsMouse();

    
}


function eatsMouse() {
    if (dist(character.x, character.y, whiteMouse.x, whiteMouse.y) < 50) {
        putMouseRandomPosition();
        score++;

        saveScore();
    }
}

function putMouseRandomPosition() {
    whiteMouse.x = random(50, windowWidth - 50);
    whiteMouse.y = random(50, windowHeight - 50);
}

/*___________________________________________

1) Include the socket method to listen to events and change the character position.
You may want to use a Switch structure to listen for up, down, right and left cases.
_____________________________________________ */

socket.on('movement', move => {

    switch (move) {
        case 'UP':
            character.y = character.y - speed;
            break;

        case 'DOWN':
            character.y = character.y + speed;

            break;
        
        case 'RIGHT':
            character.x = character.x + speed;

                break;

        case 'LEFT':
            character.x = character.x - speed;

            break;
    }
});

function saveScore() {
    sendScore("/score", score)
    .then((data) => {
        console.log(data);
    });
}

/*___________________________________________

2) Include the fetch method to post each time the snake eats a mouse
_____________________________________________ */

async function sendScore(url = "", data = {}){

    let bodyJSON = JSON.stringify(score);

    const putRequest = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: bodyJSON
    }

    const request = await fetch(`http://${IPaddress}:${PORT}/score`, putRequest);

}