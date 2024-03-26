function start() {


    //Verifica se o usuário pressionou alguma tecla

    $(document).keydown(function(e) {
        playerPressed[e.which] = true;
    });

    $(document).keyup(function(e) {
        playerPressed[e.which] = false;
    });



    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");

    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");

    $("#fundoGame").append("<div id='inimigo2'></div>");

    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");

    $("#fundoGame").append("<div id='placar'></div>");

    $("#fundoGame").append("<div id='energia'></div>");

    var TECLA = {
        W: 87,
        S: 83,
        D: 68
    }
    
    playerPressed = []
    var velocity = 5;
    var positionY = parseInt(Math.random() * 334)
    var game = {}
    var positionX = null
    var canShoot = true;
    var endGame = false;
    var points = 0;
    var saved = 0;
    var lost = 0;
    var currentEnergy = 3
    var somDisparo = document.getElementById("somDisparo")
    var somExplosao = document.getElementById("somExplosao")
    var musica = document.getElementById("musica")
    var somGameover = document.getElementById("somGameover")
    var somPerdido = document.getElementById("somPerdido")
    var somResgate = document.getElementById("somResgate")

    musica.addEventListener("ended", function() {musica.curretTime = 0; musica.play();}, false)
    musica.play()

    game.timer = setInterval(loop,30);



    function loop() {
        moveBackground();
        movePlayer();
        moveEnemy1();
        moveEnemy2();
        moveFriend();
        colision();
        scoreBoard();
        energy();
    }


    function moveBackground() {
        left = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position",left-1);
    }


    function movePlayer() {
        if (playerPressed[TECLA.W]) {
            var top = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",top-10)

            if (top <= 0) {
                $("#jogador").css("top",top+10)
            }
        }

        if (playerPressed[TECLA.S]) {
            var top = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",top+10)

            if (top >= 434) {
                $("#jogador").css("top",top-10)
            }
        }

        if (playerPressed[TECLA.D]) {
            shoot();
        }
    }

    function moveEnemy1() {
        positionX = parseInt($("#inimigo1").css("left"))
        $("#inimigo1").css("left",positionX-velocity)
        $("#inimigo1").css("top",positionY)

        if (positionX <= 0) {
            positionY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694)
            $("#inimigo1").css("top",positionY)
        }
    }

    function moveEnemy2() {
        positionX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left",positionX-3)

        if (positionX <= 0) {
            $("#inimigo2").css("left",775)
        }
    }

    function moveFriend() {
        positionX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left",positionX+1)

        if (positionX > 906) {
            $("#amigo").css("left",0)
        }
    }

    function shoot() {
        if (canShoot == true) {

            somDisparo.play()
            canShoot = false;

            var top = parseInt($("#jogador").css("top"));
            positionX = parseInt($("#jogador").css("left"));
            shootX = positionX + 190;
            topShoot = top + 37;
            $("#fundoGame").append("<div id='disparo'></div");
            $("#disparo").css("top",topShoot);
            $("#disparo").css("left",shootX);

            timeShoot = window.setInterval(executeShoot, 30);
        }

        function executeShoot() {
            positionX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left",positionX + 15);

                if (positionX > 900) {
                    window.clearInterval(timeShoot);
                    timeShoot = null;
                    $("#disparo").remove();
                    canShoot = true;
                }
        }
    }

    function colision() {
        var colision1 = ($("#jogador").collision($("#inimigo1")));
        var colision2 = ($("#jogador").collision($("#inimigo2")));
        var colision3 = ($("#disparo").collision($("#inimigo1")));
        var colision4 = ($("#disparo").collision($("#inimigo2")));
        var colision5 = ($("#jogador").collision($("#amigo")));
        var colision6 = ($("#inimigo2").collision($("#amigo")));
        
        if (colision1.length > 0) {
            enemy1X = parseInt($("#inimigo1").css("left"))
            enemy1Y = parseInt($("#inimigo1").css("top"))
            explosion1 (enemy1X,enemy1Y);

            positionY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694)
            $("#inimigo1").css("top",positionY)

            currentEnergy--

        }

        if (colision2.length > 0) {
            enemy2X = parseInt($("#inimigo2").css("left"))
            enemy2Y = parseInt($("#inimigo2").css("top"))
            explosion2 (enemy2X,enemy2Y);

            $("#inimigo2").remove()

            repositionEnemy2();

            currentEnergy--

        }

        if (colision3.length > 0) {
            enemy1X = parseInt($("#inimigo1").css("left"))
            enemy1Y = parseInt($("#inimigo1").css("top"))
            explosion1 (enemy1X,enemy1Y);
            $("#disparo").css("left",950)

            positionY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694)
            $("#inimigo1").css("top",positionY)

            points += 100;

            velocity += 0.3
        }

        if (colision4.length > 0) {
            enemy2X = parseInt($("#inimigo2").css("left"))
            enemy2Y = parseInt($("#inimigo2").css("top"))
            $("#inimigo2").remove()

            explosion2 (enemy2X,enemy2Y);
            $("#disparo").css("left",950)

            repositionEnemy2();


            points += 50;
        }

        if (colision5.length > 0) {
            somResgate.play()
            repositionFriend();
            $("#amigo").remove();

            saved++
        }

        if (colision6.length > 0) {
            
            friendX = parseInt($("#amigo").css("left"))
            friendY = parseInt($("#amigo").css("top"))
            explosion3(friendX,friendY);
            $("#amigo").remove();

            repositionFriend();

            lost++

        }


    }

    function explosion1(enemy1X,enemy1Y) {
        somExplosao.play()
        $("#fundoGame").append("<div id='explosao1'></div");
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");
        var div=$("#explosao1");
        div.css("top",enemy1Y)
        div.css("left",enemy1X)
        div.animate({width:200, opacity:0}, "slow")

        var timeExplosion = window.setInterval(removeExplosion, 1000);

        function removeExplosion() {
            div.remove();
            window.clearInterval(timeExplosion)
            timeExplosion = null
        }
    }

    function explosion2(enemy2X,enemy2Y) {
        somExplosao.play()
        $("#fundoGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(imgs/explosao.png)");
        var div2=$("#explosao2");
        div2.css("top",enemy2Y)
        div2.css("left",enemy2X)
        div2.animate({width:200, opacity:0}, "slow")

        var timeExplosion = window.setInterval(removeExplosion2, 1000);

        function removeExplosion2() {
            div2.remove();
            window.clearInterval(timeExplosion)
            timeExplosion2 = null
        }
    }

    function explosion3(friendX,friendY) {
        somPerdido.play()
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top",friendY)
        $("#explosao3").css("left",friendX)
        
        var timeExplosion3 = window.setInterval(removeExplosion3, 1000);

        function removeExplosion3() {
            $("#explosao3").remove();
            window.clearInterval(timeExplosion3)
            timeExplosion3 = null
        }
    }

    function repositionEnemy2() {

        var timeColision4 = window.setInterval(reposition4, 5000);

        function reposition4() {
            window.clearInterval(timeColision4);
            timeColision4 = null

            if (endGame == false) {
            $("#fundoGame").append("<div id=inimigo2></div")
            }
        }
    }

    function repositionFriend() {
        var timeFriend = window.setInterval(reposition6, 6000)

        function reposition6() {
            window.clearInterval(timeFriend)
            timeFriend = null

            if (endGame == false) {

                $("#fundoGame").append("<div id='amigo' class='anima3'> </div")
            }
        }
    }

    function scoreBoard() {
        $("#placar").html("<h2> Pontos: " + points + " Salvos: " + saved + " Perdidos: " + lost + "</h2>")
    }

    function energy() {
        if (currentEnergy == 3) {
            $("#energia").css("background-image", "url(imgs/energia3.png")
        }    


        if (currentEnergy == 2) {
            $("#energia").css("background-image", "url(imgs/energia2.png")
        }    


        if (currentEnergy == 1) {
            $("#energia").css("background-image", "url(imgs/energia1.png")
        }    


        if (currentEnergy == 0) {
            $("#energia").css("background-image", "url(imgs/energia0.png")

            gameOver()
        }    
    }

    function gameOver() {
        endGame = true
        musica.pause()
        somGameover.play()

        window.clearInterval(game.timer);
        game.timer = null

        $("#jogador").remove()
        $("#inimigo1").remove()
        $("#inimigo2").remove()
        $("#amigo").remove()

        $("#fundoGame").append("<div id='fim'></div")

        $("#fim").html("<h1> Game Over </h1><p> Sua pontuação foi:  Pontos: " + points + "</p>" + "<div id='reinicia' onClick=resetGame()><h3>Jogar Novamente</h3></div>")
    }

}

function resetGame() {
    somGameover.pause()
    $("#fim").remove()
    start()
}
