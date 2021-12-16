var clicks = 0;

$(document).ready(function() {

    var clicksLimit = 10;

    $(document).on('click', function(ev){
        if(ev.target.id == 'imgPlan')
            clicks++;
        else
            clicks = 0;

        if(clicks >= clicksLimit) {
            if(t != null)
                window.clearTimeout(t);
            clicks = 0;
            pacman();
        }
    });
});


function pacman(){
    cancelEmployeeEdit();

    $field = $("#divMainContainer");
    $field.append('<div class="pacman"><img src="/img/pacman.gif"></div>');
    $field.append('<div class="points">Points: <span class="pts">0</span></div>')
    $pacman = $("div.pacman");

    for(var i=0; i<mapList.length; i++)
        mapList[i].IsEaten = false;
    

    y=10;   
    x=10;
    keyPressed(right);

    $(document).keydown(function(e){
        if(keyPressed(e.keyCode))
            e.preventDefault();
    })

    move();
}

function move(){

    if(t != null)
        window.clearTimeout(t);

    x = x + dx;
    y = y + dy;

    var w = $("#imgPlan")[0].width;
    var h = $("#imgPlan")[0].height;

    if(x>w) x=0;
    if(x<0) x=w;
    if(y>h) y=0;
    if(y<0) y=h;

    $pacman.css({ left: x + 'px', top: y + 'px'});
    eat();

    t = window.setTimeout(() => {
        move();
    }, 100);
}

var eatRate = 3;
var eatCycle = 0;
function eat(){
    eatCycle++;
    if(eatCycle < eatRate)
        return;
    eatCycle = 0;

    var $allPoints = $(".point");
    var eatenId = null;
    for(var i = 0; i< $allPoints.length; i++){
        var point = $allPoints[i];
        var dX = Math.abs($pacman[0].getBoundingClientRect().left - point.getBoundingClientRect().left);
        var dY = Math.abs($pacman[0].getBoundingClientRect().top - point.getBoundingClientRect().top);
    
        if(dX < 16 && dY < 16) {
            eatenId = point.getAttribute('data-id');
            break;
        }
    }    

    var map = findEmployeeById(eatenId);
    
    if(typeof map !== 'undefined'){
        map.IsEaten = true;
        $point = $("#point" + map.Id);
        $point.remove();
        points++;
        $("div.points span.pts").text(points);

        var isOver = false;
        if(($(".point:not(.you)").length) == 0)
        {
            isOver = true
            log('You won!');
        }
        else if($point.hasClass("you"))
        {
            isOver = true;
            log('You lose!');
        }

        if(isOver){
            window.clearTimeout(t);
            $pacman.remove();
            drawMap();
        }
    }
}

function keyPressed(keyCode){
    switch(keyCode){
        case up:
            dy = -5;
            dx = 0;
            $pacman.rotate(-90);
            break;
        case down:
            dy = 5;
            dx = 0;
            $pacman.rotate(90);
            break;
        case left:
            dx = -5;
            dy = 0;
            $pacman.rotate(-180);
            break;
        case right:
            dx = 5;
            dy = 0;
            $pacman.rotate(0);
            break;
        default:
            return false;
    }
    return true;
}

function log(text)
{
    $(".logo-style").text(text);
}

var dx=5;
var dy=0;
var x=10;
var y=68;

var up=38;
var down=40;
var left=37;
var right=39;

var $field;
var $pacman;
var points = 0;

var t = null;

jQuery.fn.rotate = function(degrees) {
    $(this).css({'transform' : 'rotate('+ degrees +'deg)'});
    return $(this);
};