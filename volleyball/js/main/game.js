function start_game(Physics) {
  Physics(function(world) {
    var viewWidth = window.innerWidth
      ,viewHeight = window.innerHeight
    // center of the window
      ,center = Physics.vector(viewWidth, viewHeight).mult(0.5)
    // bounds of the window
      ,viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight)
      ,attractor
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

    // move the attractor position to match the mouse coords
    renderer.el.addEventListener('mousemove', function( e ){
      attractor.position({ x: e.pageX, y: e.pageY });
    });

    // some fun colors
    var colors = [
      '#b58900',
      '#cb4b16',
      '#dc322f',
      '#d33682',
      '#6c71c4',
      '#268bd2',
      '#2aa198',
      '#859900'
    ];
    // create some bodies
    var bodies = [];
    var v = Physics.vector(0, 300);
    var circle, r;

    r = 20;
    var right_x=1300;
    ball = Physics.body('circle', {
      radius: r
      ,mass: r
      ,x: right_x
      ,y: 200
      ,vx: v.perp().mult(0.0001).x
      ,vx: v.y
      ,styles: {
    fillStyle: colors[ 0 ]
      }
    });
    var player1 = Physics.body('rectangle', {
      // place the centroid of the rectangle at (300, 200)
      x: 300,
      y: 200,
      width: 30,
      height: 90
    });
    var player2 = Physics.body('rectangle', {
      // place the centroid of the rectangle at (300, 200)
      x: (right_x + 20),
      y: 200,
      width: 30,
      height: 90
    });
    bodies.push(ball);
    bodies.push(player1);
    bodies.push(player2);
    v.perp(true)
    .mult(10000)
    .rotate(1 / 3);

    // add things to the world
    world.add( bodies );
    world.add([
      Physics.behavior('constant-acceleration', {
      strength: 0.005
      ,min: 10
    })
      ,Physics.behavior('body-impulse-response')
      ,edgeBounce
      ,attractor
    ]);

    // subscribe to ticker to advance the simulation
    Physics.util.ticker.on(function( time ) {
      world.step( time );
    });

    // start the ticker
    Physics.util.ticker.start();
  });
}
//function keyMove() {
//  keys.forEach(function(value, key) {
//
//    if(value == true) {
//      switch (key) {
//        case 65:
//          // a key (left)
//
//          moveLeft(p2);
//        break;
//
//        case 68:
//          // d key (right)
//
//          moveRight(p2);
//        break;
//
//        case 87:
//          // w key (up)
//
//          //jump(p2);
//        break;
//
//        default:
//          break;
//      }
//    }
//  }
//}
//
//var keys = [];
//gameLoop();
//
//function gameLoop(){
//  setTimeout(function(){
//    keyMove();
//    gameLoop();
//  },1000/refreshRate);
//}
//
//function moveRight(noun) {
//  noun.x += 50;
//}
//
//function moveLeft(noun) {
//  noun.x -= 50;
//}
