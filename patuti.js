var curPos = 0;
var curSp = 0;
var jumping = false;
var docking = false;
var life = 100;
var isGameOver = false;
var bulletsDodged = 0;
var prevBulletsDodged = 0;
var moves = [["moves/idle-1.png","moves/idle-2.png"],
    ["moves/left-1.png","moves/left-2.png","moves/left-3.png","moves/left-4.png","moves/left-6.png"],
    ["moves/right-1.png","moves/right-2.png","moves/right-3.png","moves/right-4.png","moves/right-5.png"],
    ["moves/jump-1.png","moves/jump-2.png","moves/jump-3.png","moves/jump-4.png","moves/jump-5.png",
    "moves/jump-5.png","moves/jump-5.png","moves/jump-5.png", "moves/jump-5.png", "moves/jump-5.png",
    "moves/jump-6.png", "moves/jump-6.png", "moves/jump-7.png", "moves/jump-7.png"],
    ["moves/dock-1.png","moves/dock-2.png","moves/dock-3.png","moves/dock-4.png","moves/dock-4.png",
    "moves/dock-4.png","moves/dock-4.png","moves/dock-4.png","moves/dock-4.png", "moves/dock-4.png",
    "moves/dock-4.png", "moves/dock-4.png", "moves/dock-5.png"]];
const bulletArray = [];
var audioBg = document.getElementById("bgMusic");
var audioShoot = document.getElementById("bulletSound");
var audioGameOver = document.getElementById("gameOverSound");
var audioSquish = document.getElementById("squish");
var audioJump = document.getElementById("jump");

function startGame(){
    audioBg.play();
    setInterval("spawnBullets()",2000);
    $("#lifeBar").show();
    $("#scoreDiv").show();
    $("#welcomeScreen").hide();
    $("#startButton").hide();
}

function gameOver(){
    audioBg.pause();
    audioGameOver.play();
    $("#platform").hide();
    $("#char1").hide();
    $("#lifeBar").hide();
    $("#gameOverScreen").show()
    $("#youDied").toggleClass("fade-in")
    $("#tryAgain").toggleClass("fade-in")
    $("#prevDodged").toggleClass("fade-in").text('Previous Bullets Dodged: ' + prevBulletsDodged)
    $("#currDodged").toggleClass("fade-in").text('Current Bullets Dodged: ' + bulletsDodged)
    isGameOver = true;
}

function retry(){
    audioBg.play();
    var lifeBar = document.getElementById("currLife");
    life = 100;
    isGameOver = false;
    $("#platform").show();
    $("#char1").show().css({position: "absolute", left: 600, top: 260, height: 100});
    $("#lifeBar").show();
    $("#gameOverScreen").hide();
    $("#youDied").removeClass("fade-in");
    $("#tryAgain").removeClass("fade-in");
    $("#prevDodged").removeClass("fade-in");
    $("#currDodged").removeClass("fade-in");
    lifeBar.style.width = "100%";
    prevBulletsDodged = bulletsDodged;
    bulletsDodged = 0;
    $("#bulletsDodged").text('Bullets Dodged: ' + bulletsDodged);
}

function dodgeBullets(){
    bulletsDodged += 1;
    $("#bulletsDodged").text('Bullets Dodged: ' + bulletsDodged);
}

function reduceLife(){
    audioSquish.play();
    var lifeBar = document.getElementById("currLife");
    life -= 10;
    lifeBar.style.width = life + "%";
    
    if(life <= 0){
        gameOver();
    }
}

function actIt(){
    $("#char1").attr("src",moves[curPos][curSp]);
    curSp = (curSp + 1) % moves[curPos].length;
    if(curPos==1){
        if(curSp > 2)
            $("#char1").css("left",($("#char1").position().left - 25)+"px");
        if(curSp==0){curPos=0; curSp=1;}
    }
    if(curPos==2){
        if(curSp > 2)
            $("#char1").css("left",($("#char1").position().left + 25)+"px");
        if(curSp==0){curPos=0; curSp=1;}
    }
    if(curPos==3){
        audioJump.play();
        jumping = true;
        if(curSp < 3)
            $("#char1").css("top",($("#char1").position().top - 0)+"px");
        else if(curSp > 3){
            if(curSp > 3 && curSp < 5){
                $("#char1").css("top",($("#char1").position().top - 150)+"px");
            }
            else if(curSp < 11){
                $("#char1").css("top",($("#char1").position().top)+"px");
            }
            else
                $("#char1").css("top",($("#char1").position().top + 50)+"px");
        }
        if(curSp==0){curPos=0; curSp=1; jumping = false;}
    }
    if(curPos==4){
        docking = true;
        if(curSp > 2 && curSp < 5){
            $("#char1").css("top",($("#char1").position().top + 20)+"px");
            $("#char1").css("height",($("#char1").height() - 15)+"px");
        }
        else if(curSp < 12){
            $("#char1").css("top",($("#char1").position().top)+"px");
            $("#char1").css("height",($("#char1").height())+"px");
        }
        else if(curSp == 12){
            $("#char1").css("top",($("#char1").position().top - 40)+"px");
            $("#char1").css("height",($("#char1").height() + 30)+ "px");
        }
        if(curSp==0){curPos=0; curSp=1; docking = false;}
    }

    for(i = 0; i < bulletArray.length; i++){
        if(bulletArray[i].axis == 1){
            bulletArray[i].bullet.appendTo($('#gameScreen'));
            bulletArray[i].bullet.css("top", (bulletArray[i].bullet.position().top + 20) + "px");
            if(bulletArray[i].bullet.offset().top > $("#bgImage").height() - 10){
                bulletArray[i].bullet.remove();
                bulletArray.splice(i, 1);
                dodgeBullets();
            }
        }
        else{
            bulletArray[i].bullet.appendTo($('#gameScreen'));
            bulletArray[i].bullet.css("left", (bulletArray[i].bullet.position().left - 20) + "px");
            if(bulletArray[i].bullet.offset().left < $("#bgImage").offset().left){
                bulletArray[i].bullet.remove();
                bulletArray.splice(i, 1);
                dodgeBullets();
            }
        }
    }

    if(bulletArray.length > 0){
        for(i = 0; i < bulletArray.length; i++){
            if(bulletArray[i].bullet.offset().left < $("#char1").offset().left + ($("#char1").width()) &&
            bulletArray[i].bullet.offset().left + bulletArray[i].bullet.width() > $("#char1").offset().left &&
            bulletArray[i].bullet.offset().top < $("#char1").offset().top + ($("#char1").height()) &&
            bulletArray[i].bullet.offset().top + bulletArray[i].bullet.height() > $("#char1").offset().top){
                bulletArray[i].bullet.remove();
                bulletArray.splice(i, 1);
                reduceLife();
            }
        }
    }

}

function spawnBullets(){
    if(isGameOver == false){
        var axis = Math.floor(Math.random() * (2 - 1 + 1)) + 1;

        if(axis == 1){
            //For Vertical Bullets
            var left_location = Math.floor(Math.random() * (780 - 450 + 1) + 450) ;
            var bullet = $('<img>', {id: "bullet", src: "moves/bullet_v.png",}).css({position:"absolute",height:"50px",left: left_location+"px",top:"10px"});
            var bulletObj = {
                bullet: bullet,
                axis: axis,
            }
            audioShoot.play();
            bulletArray.push(bulletObj);
        }
        else{
            //For Horizontal Bullets
            var top_location = Math.floor(Math.random() * (350 - 250 + 1) + 250) ;
            var bullet = $('<img>', {id: "bullet", src: "moves/bullet_h.png",}).css({position:"absolute",width:"50px",left: "1103px",top:top_location+"px"});
            var bulletObj = {
                bullet: bullet,
                axis: axis,
            }
            audioShoot.play();
            bulletArray.push(bulletObj);
        }
    }
}

function moveIt(i){
    curPos = i;
    curSp = 0;
}

$(document).ready(function(){
    setInterval("actIt()",50);

    $("#startButton").click(function(e){
        startGame();
    })

    $("#gameOverScreen").click(function(e){
        retry();
    })

    $(document).keydown(function(e){
        switch(e.which){
            case 37:
                if(docking == false && jumping == false)
                    if($("#char1").position().left + 25 > $("#platform").offset().left)
                        moveIt(1);
                break;
            case 38:
                if(docking == false && jumping == false)
                    moveIt(3);
                break;
            case 39:
                if(docking == false && jumping == false)
                    if($("#char1").position().left < ($("#platform").offset().left + $("#platform").width()) -70)
                        moveIt(2);
                break;
            case 40:
                if(docking == false && jumping == false)
                    moveIt(4);
                break;
        }
    })
})