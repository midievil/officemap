var clicks = 0;

$(document).ready(function(){
    $(document).on('click', function(ev){
        if(ev.target.id == 'imgPlan')
            clicks++;
        else
            clicks = 0;

        if(clicks >= 10) {
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
    

    y=68;   
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

    if(x>100) x=0;
    if(x<0) x=100;
    if(y>100) y=0;
    if(y<0) y=100;

    $pacman.css({ left: x + '%', top: y + '%'});
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

    var floorId = getCurrentFloorId();
    var map = mapList.find(function(emp){
        return !emp.IsEaten && emp.FloorId == floorId && Math.abs(emp.X - x)<1 && Math.abs(emp.Y - y)<1;
    });
    
    if(typeof map !== 'undefined'){
        map.IsEaten = true;
        $point = $("#point"+map.Id);
        $point.hide();
        points++;
        $("div.points span.pts").text(points);

        if($point.hasClass("you")){
            window.clearTimeout(t);
            $pacman.remove();
            drawMap();
        }
    }
}

function keyPressed(keyCode){
    switch(keyCode){
        case up:
            dy = -0.5;
            dx = 0;
            $pacman.rotate(-90);
            break;
        case down:
            dy = 0.5;
            dx = 0;
            $pacman.rotate(90);
            break;
        case left:
            dx = -0.5;
            dy = 0;
            $pacman.rotate(-180);
            break;
        case right:
            dx = 0.5;
            dy = 0;
            $pacman.rotate(0);
            break;
        default:
            return false;
    }
    return true;
}

var dx=0.5;
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