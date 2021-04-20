// ctx is for practice mode context and ctx2 is for fight mode context
let ctx;
let ctx2;

// this function is to change the ui when it is clicked on practice mode
$("#first-image").on("click",function() {
    $("#first, #fight").css("display", "none");
    $("#practice").css("display","block");
    $("body").css({"background-image" :"url('images/others/3.jpg')","background-size" : "cover"});
    let canvas = document.getElementById('c1');
    ctx = canvas.getContext('2d');
    waitForCall(true);
});

// this function is to change the ui when it is clicked on fight mode 
$("#second-image").on("click",function() {
  $("#first, #practice").css("display", "none");
  $("#fight").css("display","block");
  $("body").css({"background-image" :"url('images/others/4.jpg')","background-size" : "cover"});
  let canvas2 = document.getElementById('c2');
  ctx2 = canvas2.getContext('2d');
  waitForCall(false);
});

// when clicked on previous button hide the practice mode or home mode and change the ui to home page
$(".previous").on("click",function() {
   $("#practice, #fight").css("display", "none");
   $("#first").css("display","block");
   $("body").css({"background-image" :"url('images/others/1.jpg')","background-size" : "auto"});
}); 

// to load a single image by accepting the source and a callback function as parameters
let loadImage = (src, callback) => {
  let img = document.createElement('img');
  img.onload = () => callback(img);
  img.src = src;
};

// accepts frame number and a animation to return the image path
let imagePath = (frameNumber,animation) => {
  return "images/" + animation + "/" + frameNumber + ".png";
};

// keys are the animations that are to be loaded and values of the keys are the file name of the images
let frames = {
  idle: [1,2,3,4,5,6,7,8],
  kick: [1,2,3,4,5,6,7],
  punch: [1,2,3,4,5,6,7],
  forward: [1,2,3,4,5,6],
  backward: [1,2,3,4,5,6],
  block: [1,2,3,4,5,6,7,8,9]
};

/* before drawing a image to canvas it should be loaded to load all the images by accepting a callback 
   function and return an object with the loaded images in it */
let loadImages = (callback) => {

   // this object is to store the loaded images 
   let images = {idle: [], kick: [], punch: [], forward:[], backward:[], block: []};
   let imagesToLoad = 0;

   ["idle","kick","punch","forward","backward","block"].forEach((animation) => {
      let animationFrame = frames[animation];
      imagesToLoad = imagesToLoad + animationFrame.length;

      animationFrame.forEach((frameNo) => {
         let path = imagePath(frameNo,animation);
         loadImage(path, (image) => {
            images[animation][frameNo - 1] = image;
            imagesToLoad = imagesToLoad - 1;

            if(imagesToLoad === 0) {
               callback(images);
            }
         });
      })
   });
};

/* dx and dx1 are used to change the position of human in martial-arts. dx is for practice mode 
   and dx1 is for fight mode */ 
let dx = -40;
let dx1 = -40;

/* "humanLife" stores the life percentage of the human in fight mode and "dragonLife" stores 
    the life percentage of the dragon in fight mode */
let humanLife = 100;
let dragonLife = 100;

// this function is called once the user clicks on the practice mode or fight mode
let waitForCall = (detection) => {

      /* detection is used to check whether the player clicked on practice mode or fight mode. if the
      player clicked on practice mode detection will be true if the player clicked on fight mode
      detection will be false */
   if(detection) {

      // this animate function is used to draw the images when an event occurs
      let animate = ( images, animation, callback) => {
         images[animation].forEach((image, index) => {
            setTimeout(() => {
                  ctx.clearRect(0, 0, 900, 450);
                  if(animation === "forward") {
                     dx = (dx > 850) ? -40 : dx+90;
                     ctx.drawImage(image,dx,-20,500,500);
                  } 
                  else if(animation === "backward") {
                     dx = (dx < -20) ? 900 : dx-90;
                     ctx.drawImage(image,dx,-20,500,500);
                  }
                  else {
                     ctx.drawImage(image, dx, -20, 500, 500);
                  }
            }, index * 120);
          });
          setTimeout(callback, images[animation].length * 120);
      };
      
      // this will load all the images and then start working according to the event.
      loadImages((images) => {
         let queueAnimations = [];
      
         let aux = () => {
            let selectedAnimation;
            if(queueAnimations.length === 0) {
               selectedAnimation = "idle"
            } else {
               selectedAnimation = queueAnimations.shift();
            }
            animate(images, selectedAnimation, aux);
         };
      
         aux();
         document.addEventListener('keyup', function(event) {
            const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
            if(key === "ArrowUp") {
               queueAnimations.push("forward");
            } 
            else if(key === "ArrowDown"){
               queueAnimations.push("backward");
            }
         });
         
         $("#kick,#kk").click(function(){
               queueAnimations.push("kick");
         });
      
         $("#punch,#ph").click(function(){
               queueAnimations.push("punch");
         });
      
         $("#block").click(function(){
               queueAnimations.push("block");
         });
      });
   }
   else { 

      // this will load the dragon.
      let creature = new Image();
      creature.src = 'images/others/5.png';
      creature.onload = () => {};

      // this will load the fire effect
      let fire = new Image();
      fire.src = 'images/others/fire1.png';
      fire.onload = () => {};

      /* this function is to draw the fire image to the canvas and to check whether the user
      is in the fire range and to reduce the life percentage of the human if he is in the range */
      function wait() {
         ctx2.drawImage(fire,300,32,300,150);
         if(dx1 >= 140) {
             humanLife -= 3;
             if(humanLife <= 0) {
               window.location.assign("index.html");
               alert("You Lost");
                  // this will reload the document once the user lose 
                  
             }
             else {
                  $("#player").css("width",humanLife+"%");
                  $('#player').html(humanLife+"%");
             }
         }
      };
      
      // this will draw the images according to the event
      let dragonAnimation = (images, animation,callback) => {
         images[animation].forEach((image, index) => {
            setTimeout(() => {
                  ctx2.clearRect(0, 0, 900, 450);
                  ctx2.drawImage(creature,500,-20,500,500);
                  if(animation === "forward") {
                     dx1 = (dx1 >= 170) ? 140 : dx1+40;
                     ctx2.drawImage(image,dx1,-20,500,500);
                  }
                  else if(animation === "backward") {
                     dx1 = (dx1 < -20) ? -40 : dx1-40;
                     ctx2.drawImage(image,dx1,-20,500,500);
                  }
                  else {
                     ctx2.drawImage(image,dx1,-20,500,500);
                  }
            }, index * 120);
         });
         if(dragonLife <= 0) {
            alert("You Won!!!!");
            window.location.assign("index.html");
         }
         else {
            if(dx1 > -40) {
               if(animation === "kick")
                  dragonLife -= 7
               else if(animation === "punch")
                  dragonLife -= 3
               $("#creature").css("width",dragonLife+"%");
               $('#creature').html(dragonLife+"%");
            }
         }
         setTimeout(wait,1000);     
         setTimeout(callback, images[animation].length * 120);
      };

      loadImages((images) => {
         let queueAnimations = [];
      
         let aux = () => {
            let selectedAnimation;
            if(queueAnimations.length === 0) {
               selectedAnimation = "idle"
            } else {
               selectedAnimation = queueAnimations.shift();
            }
            dragonAnimation(images, selectedAnimation, aux);
         };
         
         aux();
         document.addEventListener('keyup', function(event) {
            const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
            if(key === "ArrowUp") {
               queueAnimations.push("forward");
            } 
            else if(key === "ArrowDown"){
               queueAnimations.push("backward");
            }
         });
         
         $("#kk").click(function(){
               queueAnimations.push("kick");
         });
      
         $("#ph").click(function(){
               queueAnimations.push("punch");
         });

      });
   }  
}