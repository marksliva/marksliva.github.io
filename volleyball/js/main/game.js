var player1, player2, ball, refreshRate = 30;
function start_game(Physics) {
  Physics(function(world) {
    var viewWidth = window.innerWidth
      ,viewHeight = window.innerHeight
    // center of the window
      ,center = Physics.vector(viewWidth, viewHeight).mult(0.5)
    // bounds of the window
      ,viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight)
      ,edgeBounce
      ,renderer
    ;

    // create a renderer
    renderer = Physics.renderer('canvas', {
      el: 'viewport'
      ,width: viewWidth
      ,height: viewHeight
    });

    // add the renderer
    world.add(renderer);
    // render on each step
    world.on('step', function () {
      world.render();
    });

    // constrain objects to these bounds
    edgeBounce = Physics.behavior('edge-collision-detection', {
      aabb: viewportBounds
      ,restitution: 0.2
      ,cof: 0.8
    });

    // resize events
    window.addEventListener('resize', function () {

      viewWidth = window.innerWidth;
      viewHeight = window.innerHeight;

      renderer.el.width = viewWidth;
      renderer.el.height = viewHeight;

      viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);
      // update the boundaries
      edgeBounce.setAABB(viewportBounds);

    }, true);

    //renderer.el.addEventListener('mousemove', function( e ){

    // create some bodies
    var bodies = [];
    var v = Physics.vector(0, 300);
    var circle, r;

    var r = 33;
    var right_x=1300;
    var player_start_y = 500;
    ball = Physics.body('circle', {
      radius: r
      ,x: (right_x - 15)
      ,y: 100
      ,mass: 5
      ,cof: 0
    });
    ball.view = new Image();
    ball.view.src = 'images/volleyball.png'
    player1 = Physics.body('circle', {
      // place the centroid of the rectangle at (300, 200)
      radius: 150,
      x: 300,
      y: player_start_y,
      mass: 100000,
      number: 1,
      cof: 0
    });
    player1.view = new Image();
    player1.view.src = 'images/p1.png';
    player2 = Physics.body('circle', {
      // place the centroid of the rectangle at (300, 200)
      radius: 150,
      x: (right_x + 20),
      y: player_start_y,
      mass: 100000,
      number: 2,
      cof: 0
    });
    player2.view = new Image();
    player2.view.src = 'images/p2.png';
    bodies.push(ball);
    bodies.push(player1);
    bodies.push(player2);

    // add things to the world
    world.add( bodies );
    world.add([
      Physics.behavior('constant-acceleration', {
      strength: 0.005
      ,min: 10
    })
      ,Physics.behavior('body-impulse-response')
      ,Physics.behavior('body-collision-detection')
      ,Physics.behavior('sweep-prune')
      ,edgeBounce
    ]);

    // subscribe to ticker to advance the simulation
    Physics.util.ticker.on(function( time ) {
      world.step( time );
    });

    // start the ticker
    Physics.util.ticker.start();
  });
}

function keyMove() {
  keys.forEach(function(value, key) {

    if(value == true) {
      switch (key) {
        case 38:
          // up key
          jump(player1);
        break;

        case 37:
        case 97:
          // left key

          moveLeft(player1);
          break;

        case 39:
        case 100:
          // right key

          moveRight(player1);
          break;

        case 65:
          // a key (left)

          moveLeft(player2);
        break;

        case 68:
          // d key (right)

          moveRight(player2);
        break;

        case 87:
          // w key (up)

          jump(player2);
        break;

        default:
          break;
      }
    }
  });
}

function groundCheck() {
  var ground_threshold = 780;
  if(ball.state.pos.y > ground_threshold) {
    if(ball.state.pos.x < 610) {
      ball.state.vel.set(.15, -.8);
      playerScored(player2);
    }
    else {
      ball.state.vel.set(-.15, -.8);
      playerScored(player1);
    }
  }
  if(ball.state.pos.x < 40) {
    ball.state.vel.set(.1, -.3);
  }
  else if(ball.state.pos.x > 1400) {
    ball.state.vel.set(-.1, -.3);
  }
}

var moveSpeed = .003;
var keys = [];

function gameLoop(){
  setTimeout(function(){
    //player2 695
    //player1 530
    keyMove();
    groundCheck();
    gameLoop();
  },1000/refreshRate);
}

function moveRight(noun) {
  var x_position = noun.state.pos.x;
    noun.state.acc.set(moveSpeed,null);
}

function moveLeft(noun) {
  noun.state.acc.set((-1 * moveSpeed),null);
}

function jump(noun) {
  noun.state.acc.set(null,-1*(moveSpeed));
}

function keyChangeHandler(e){
  keys[e.keyCode] = e.type == 'keydown';
  e.preventDefault();
}
function playerScored(player) {
  player_id = '#score-player' + player.number;
  old_score = parseInt($(player_id).html());
  new_score = old_score + 1;
  $(player_id).html(new_score);
}

// Listen for when the user presses a key down or up
window.addEventListener("keydown", keyChangeHandler, true);
window.addEventListener("keyup", keyChangeHandler, true);
gameLoop();
