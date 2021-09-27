console.log("Harry New Project 6 : Snake Game in JavaScript index3.js");

// function for getting the highScore value from the Local Storage
function gettingHighScore(){
    // If the local storage does not contain high-score key than assign a high-score key with value 0 else  directly return the value  
    if(localStorage.getItem('high-score') === null){
        // Its automaticlly typecast the value to string 
        localStorage.setItem('high-score', 0);
    }
    return parseInt(localStorage.getItem('high-score'));
}


// Function to Reflect the Current Score Changes in the Website or HTML
function changeScore(){
    let currScoreElm = document.getElementById('curr-score');
    currScoreElm.innerText = `Score : ${currScore}`;
}

// Function to Reflect the High Score Changes in the Website or HTML
function changeHighScore(){
    let highScoreElm = document.getElementById('high-score');
    highScoreElm.innerText = `High Score : ${highScore}`;
}


// function for generating the Random Number between 2 to 16 which we need 
// because we have to move the target to 2 to 16 in x and y
// don't move the target to first row and first column and last row and last column
function randomGenerator(){
    // We know that random give the number between 0-1 include 0 but not include 1 
    // by multiply it to 15 :- minimum :- 0 and Maximum would be :- 15.85
    let random = Math.random()*15;
    // Now by doing the ceil we know that we get the highest possible integer
    // now our number range is 1-15
    let randomInt = Math.ceil(random);

    // Returning the Random integer
    // getting the number between 2-16
    return (1+randomInt);
}


// function for ending the game 
function gameOver(){
    gameOverSound.play();
    gameSound.pause();

    inputDir =  {x: 0, y: 0};

    // Now Updating the High Score to the Local Storage
    localStorage.setItem('high-score', highScore.toString());

    
    // showing an Alert of Game Over to the User
    alert("Game Over ! Press Enter Button to Start Again.");

    // Setting the Score to zero and Reflecting it to HTML 
    currScore = 0;
    changeScore();

    // Setting the x and y position of the snake to Default
    snakeArr = [{x: 13, y: 15}];

    // This will do the play the game sound again
    gameSound.currentTime = 0;
    gameSound.play();
}

function animation(ctime){
    // This is our Game Loop
    window.requestAnimationFrame(animation);

    // This is for controlling repainting because our requestFrameAnimation works very very fast
    // we are comparing it with last repainting time which we assign when we are repainting 
    if((ctime-lastPaintTime)/1000 < 1/speed){
        return;
    }

    // assigning repainting time and calling our game engine to do some work according to him
    lastPaintTime = ctime; 
    gameEngine();
}

function isCollide(SnakeArr){
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if(snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y){
            return true;
        }
    }
    // if snake go into the Wall 
    if(snakeArr[0].x >= 18 || snakeArr[0].x <= 0 || snakeArr[0].y >= 18 || snakeArr[0].y <= 0){
        console.log("Calling gameOver");
        return true;
    }

    return false;
}

// This is our main gameEngine() which will going to run in every painting 
function gameEngine(){
    // Part 1 :- Updating the Snake and target
    // Checking if the snake head reached at border or it does not eat itself 
    if(isCollide(snakeArr)){
        gameOver();
    }

    // If you eaten the target 
    if(snakeArr[0].x === target.x && snakeArr[0].y === target.y){
        console.log("Target Eaten");
        // Playing the target eaten sound when you eat the target 
        targetEatenSound.play();

        // updating the position of the target randomely by using the randomGenerator
        target = {x: randomGenerator(), y : randomGenerator()};

        // Adding a new object in the array of objects snakeArr because we eat the target so its neccessary to append it behind the snake 
        // we adding the target position + inputdir to the array of objects in the starting
        // It does not take effect whether you adding it in starting or in ending 
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});

        // Increasing the Score by 1 and Reflecting it to HTML
        currScore++;
        changeScore();

        // If at any time our current Score passed the high Score then make the current score as high score and Reflect it to website or HTML
        if(currScore > highScore){
            highScore = currScore;
            changeHighScore();
        }
    }

    // This part is very very important
    // Moving the snake
    //This will moveing all the snake 
    // In normal condition when we are not eating at all or target is not at this condition 
    // Then it working fine we just move the index to 1 index next which generally we want to do it with our snake also 
    // In that condition when it eats the target then we gonna move it to + 1 because a new div is also added 
    for (let i = snakeArr.length - 2; i>=0; i--) { 
        snakeArr[i+1] = {...snakeArr[i]};
    }

    // after moving with 1 index now we have to change our head also as per the direction 
    // so here in this we change the head as per the direction s
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;
    console.log(snakeArr[0]);


    // Part 2 :- displaying the snake and Target 
    // a.) Display the snake
    // Emptying the game area before displaying because we have to display only one snake
    gameArea.innerHTML = "";

    // Accessing every object from the snakeArr array of objects 
    snakeArr.forEach((elm, index)=>{
        // creating a new div
        let newElm = document.createElement('div');

        // Setting the position of the Newelement in the grid by using grid-row-start and grid-column-start
        // reverse value just think and u will understand this concept because when we are going down then we add 1 in the y but in real this we are going to next row thats why reverse 
        newElm.style.gridRowStart = elm.y;
        newElm.style.gridColumnStart = elm.x;

        // setting the color of the div or simply distinguish between head and target eated part
        // making the first index of the array to head and other as snake eaten part 
        if(index === 0){
            newElm.classList.add('head');
        }
        else{
            newElm.classList.add('snake');
        }
        gameArea.appendChild(newElm);
    });

    // b.)  display the food
    let targetElement = document.createElement('div');
    targetElement.style.gridRowStart = target.y;
    targetElement.style.gridColumnStart = target.x;
    targetElement.classList.add('target')
    gameArea.appendChild(targetElement);
}



// ----------->   Our Global Constants and Variables  <------------
// Sound Constants because we don't want to change this at all
const moveSound = new Audio("music/move.mp3");
const gameSound = new Audio("music/music.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const targetEatenSound = new Audio("music/food.mp3");

// used for storing the current score by the user 
let currScore = 0;

// used for storing the last repainting time helps us in running the request animation after desired time 
// because requestAnimationFrame runs so fast 
let lastPaintTime = 0;

// speed of requestAnimationFrame or mainly time handler 
let speed = 15;

// Object for getting the enquiry about which direction we have to move 
// 0 0 means not move at all and you know that in javascript y : 1 means going downwards
let inputDir = { x : 0, y : 0};

// An Array of Objects for storing the full snake positions 
let snakeArr = [{ x : 13, y : 15}];

// An Object for storing the target location 
let target = { x : 5, y : 7};

// just getting gameArea by id in javascript 
let gameArea = document.getElementById('game-area');

// Getting high Score and reflect the changes in HTML or Website 
let highScore = gettingHighScore();
changeHighScore();

// running the game sound
gameSound.play();

// Starting calling animations when the page is loaded in the window 
window.requestAnimationFrame(animation);

// Listening the user Keyboard Activities and changing the direction of x and y according to that in the inputDir object
document.onkeydown = function(e){
    // Going Down when any other key is pressed
    inputDir = {x : 0, y : 1};

    // Playing Move Sound
    moveSound.play();

    // setting inputDir object as per user pressed the key 
    switch(e.key){
        case "ArrowUp":
            console.log("Arrow Up");
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            console.log("Arrow Down");
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            console.log("Arrow Left");
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            console.log("Arrow Right");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
    console.log(inputDir);
};



// The JavaScript which i write is generally working on the top and left position the idea of inputing the snake target position in a array in that you can work also 
// and creating a game loop and then repainting it every time is also a good idea of working 
// generally i used setTimeout inside the requestanimationframe to achieve the FPS or animation time control but repainting the screen in every animation frame is also a good idea ;
// This is all summary about this project i am happy that you tried to make it by yourself but making the array of objects u can implement in your project then this  work fine 

// More features that you can add is :- 
// showing 3 highest score of user 
// or adding users in game user 1 or user 2 
// and that one increase when the eaten can also be deal 
// or some more features are requested if anyone want to tell !!!!!



// // we know that call back function can not accept arguement but when we call requestAnimationFrame then this return a integer of seconds
// function animation(ctime){
//     // Calling this again create a game loop and we are going to use it 
//     // request animation frame is better because of no flicker and no frame skips and also CPU friendly
//     // This is going to render very fast but you can able to control FPS
//     window.requestAnimationFrame(animation);
//     // console.log(performance.now());
//     // console.log(ctime);

//     // This is for controlling FPS
//     // ctime gives the milliseconds when we run this callBack 
//     // after dividing with 1000 it converts it to seconds 
//     // now we can use this to perform a operation after some time 
//     // this will going to run recursively and you know the recursives calls are very fast i think 
//     // if this time is greater than 4 seconds then this will go else it can not go next 
//     // if((ctime-lastPaintTime)/1000 < 4){
//     if((ctime-lastPaintTime)/1000 < 1/speed){
//         return;
//     }

//     // assigning ctime to last paint time so that next time this will run after the time is fulfilled you understand i think what i want to say
//     lastPaintTime = ctime;

//     // calling repainting of the screen function 
//     gameEngine();
//     // console.log("True");
// }

