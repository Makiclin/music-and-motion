var chime;

var sounds = [];
var circles = [];
var grids = [];
var myZip;

function preload() {
  soundFormats('m4a');
  for (var i = 0; i < 10; i++) {
    sounds.push(loadSound('1.m4a'));
  }



  console.log(zipCode);
  console.log(myZip);
}

var windSpeed;

function setup() {
  createCanvas(400, 400);

  var zipCode = "12345";
  var ID = "cCwZev898Zi3smWp8nR6d";
  var SECRET = "0Jj8KHwRc2DBuTAHzHZD1pLgL1EhNqx9dBmpsCht";
  weather = loadJSON(
    'https://api.aerisapi.com/observations/' + zipCode +
    '?client_id=' + ID + '&client_secret=' + SECRET);


  windSpeed = weather.response.ob.windMPH;
  print("speed:", windSpeed);

  for (var i = 0; i < sounds.length; i++) {
    let r = 10; // round(random(10, 28));
    let sound = sounds[i];



    for (var o = 50; o < 400; o = o + 60) {
      for (var p = 50; p < 400; p = p + 60) {

        grids.push({
          pos: createVector(o, p),
          vel: createVector(0, 0),
          chime: sound,
          r: 15,

        });
      }
    }

    circles.push({
      r: r,
      pos: createVector(200, 200),
      vel: createVector(random(.1, .2)+windSpeed/20, random(.1, .2)+windSpeed/20),
      chime: sound
    });

  }

}




function draw() {


  var mouseVel = map(mouseX, 0, width, 0.1, 2.0);
  background(220);
  noStroke();
  var t = millis();
  let circle = circles[0];


  circle.pos.add(circle.vel);


  if (circle.pos.x > width - circle.r) {
    circle.vel.x = -abs(circle.vel.x);
    circle.triggered = t;
  }
  if (circle.pos.x < circle.r) {
    circle.vel.x = abs(circle.vel.x);
    circle.triggered = t;
  }
  if (circle.pos.y > height - circle.r) {
    circle.vel.y = -abs(circle.vel.y);
    circle.triggered = t;
  }
  if (circle.pos.y < circle.r) {
    circle.vel.y = abs(circle.vel.y);
    circle.triggered = t;
  }

  for (var j = 0; j < grids.length; j++) {
    let other = grids[j];
    let d = circle.r + other.r;
    if (circle.pos.dist(other.pos) < d) {
      circle.triggered = t;
      other.triggered = t;

      // bounce circles off each other. yay math!
      let col = p5.Vector.lerp(circle.pos, other.pos, circle.r / d);

      let cn = p5.Vector.sub(circle.pos, col).normalize();
      let on = p5.Vector.sub(other.pos, col).normalize();
      circle.vel.sub(p5.Vector.mult(cn, 2 * circle.vel.dot(cn)));
      other.vel.sub(p5.Vector.mult(on, 2 * other.vel.dot(on)));
      while (circle.pos.dist(other.pos) < d) {
        circle.pos.add(p5.Vector.mult(circle.vel, 0.01));
        other.pos.add(p5.Vector.mult(other.vel, 0.01));
      }
    }
    fill(255);
    ellipse(other.pos.x, other.pos.y, 2 * other.r);

  }

  if (circle.triggered == t) {
    circle.chime.rate(random(0.2, 0.8));
    circle.chime.play();
  }

  if (millis() - circle.triggered < 200) {
    fill('rgba(0,255,0, 0.25)');
  }

  ellipse(circle.pos.x, circle.pos.y, 2 * circle.r);


	// circle.chime.setVolume(panning);

}
