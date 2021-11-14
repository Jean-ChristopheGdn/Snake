const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

//Variables 

let score = 0
let correctionDirection = false;
let arretJeu = false;
let vitesseRafranchissement = 100;
// Vitesse sur x et y

vx = 10; 
vy = 0;

// Pomme sur x et y

let pommeX = 0;
let pommeY = 0;


let serpent = [ {x:40, y:150}, {x:30, y:150}, {x:20, y:150}, {x:10, y:150} ];

/*----------------------- Serpent  -------------------*/ 

function animationSerpent() {
    if(arretJeu === true) {
        return;
    } else {
        setTimeout(function() {
            correctionDirection = false;
            rafraichirCanvas();
            dessinerPomme();
            faireAvancerSerpent();
            dessinerSerpent();
            //récursion
            animationSerpent();
    
        }, vitesseRafranchissement);
    }
}

animationSerpent();
creerPomme();

function rafraichirCanvas() {
    context.fillStyle = "#d8f5ff";
    context.strokeStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(0, 0, canvas.width, canvas.height);
}

function dessinerCarrés(carré) {
    context.fillStyle = "#00fe14";
    context.strokeStyle = "black";
    context.fillRect(carré.x, carré.y, 10, 10);
    context.strokeRect(carré.x, carré.y, 10, 10);
}

function dessinerSerpent(){
    serpent.forEach(carré => {
        dessinerCarrés(carré);
    })
}


function faireAvancerSerpent() {
    const tête = {x: serpent[0].x + vx, y: serpent[0].y + vy};
    serpent.unshift(tête);                                                     /*Ajouter un element au début du tableau*/
    
    if(partieTerminee()){
        serpent.shift(tête);
        nouvellePartie();
        arretJeu = true;
        return;
    }

    const serpentMangePomme = serpent[0].x === pommeX && serpent[0].y === pommeY;
    
    if(serpentMangePomme) {
        score += 10;
        document.getElementById('score').innerHTML = score
        creerPomme();
    }else{
        serpent.pop();
    }

}

dessinerSerpent();

document.addEventListener('keydown', changerDirection);

/*---------------------- Direction serpent ---------------------*/

function changerDirection(e) {
  // console.log(e)

    /*Evite de se manger quand on actionne trop vite les touches du au temps de rafraichissement*/

    if(correctionDirection) return;
    correctionDirection = true; 

   const fleche_gauche = 37;
   const fleche_droite = 39;             /* KeyCodes */ 
   const fleche_haut = 38;
   const fleche_bas = 40;

   const direction = e.keyCode;
    
    //console.log(e.keyCode)

   // Empécher le retour arrière du serpent
   const monter = vy === -10;
   const descendre = vy === 10;
   const gauche = vx === -10;
   const droite = vx === 10;

    
   if(direction === fleche_gauche && !droite) {
       vx = -10;
       vy = 0; 
   }
   if(direction === fleche_droite && !gauche) {
    vx = 10;
    vy = 0; 
    }
    if(direction === fleche_haut && !descendre) {
        vx = 0;
        vy = -10; 
    }
    if(direction === fleche_bas && !monter) {
        vx = 0;
        vy = 10; 
    }
}


function aleatoire() {
    return Math.round((Math.random() * 290) / 10) * 10;
}

/*--------------------- Pomme ---------------------------*/

function creerPomme() {
    pommeX = aleatoire();
    pommeY = aleatoire();

    // on verifie que la pomme n'est pas sous le serpent
    serpent.forEach(function(carré) {
        const pommeSousSerpent = carré.x == pommeX && carré.y == pommeY;
        if(pommeSousSerpent) {
            creerPomme();
        }
    })

}

function dessinerPomme() {
    context.fillStyle = "red";
    context.strokeStyle = "darkred";
    context.beginPath();
    context.arc(pommeX + 5, pommeY + 5, 5, 0, 2 *Math.PI);
    context.fill();
    context.stroke();
}

/*--------------------Fin du jeu--------------------------------*/

function partieTerminee(){
    let serpentSansTete = serpent.slice(1, -1);
    let mordu = false;

    serpentSansTete.forEach(carré => {
        if(carré.x === serpent[0].x && carré.y === serpent[0].y){
            mordu =true;
        }            
    })
    const murGauche = serpent[0].x < -1;
    const murDroite = serpent[0].x > canvas.width -10;
    const murHaut = serpent[0].y < -1;
    const murBas = serpent[0].y > canvas.height- 10;

    let perdu = false;
    if(mordu || murHaut || murDroite || murBas || murGauche) {
       perdu = true;
    }

    return perdu;
}

function nouvellePartie() {
    const recommencer = document.getElementById('restart');
    recommencer.style.display = "block";

    document.addEventListener('keydown', (e) => {
        if(e.keyCode === 32) {
            document.location.reload(true);
        }
    })
}