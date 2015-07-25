function Engine(canvasId) {

    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");
    var requestId;
    var updateHandler;
    var sprites = [];
    var useCollisionDetector = false;
    var that = this;

    this.addSprite = function (sprite) {
        sprites.push(sprite);
    };

    this.addSprites = function (_sprites) {
        sprites = sprites.concat(_sprites);
    };

    var updateHandler = function (context, now, keyEvents) {

    };

    var collisionHandler = function () {

    };

    var destructionHandler = function (sprite) {

    };
    
    var offScreenHandler = function(sprite){
        
    };
    
    var offScreenDetector = function (screenWidth, screenHeight, position) {
        if (position.x < 0 || position.x > screenWidth) {
            return true;
        }
        if (position.y < 0 || position.y > screenHeight) {
            return true;
        }
    };    

    var keyEvents = {};
    document.addEventListener("keydown", function (e) {
        keyEvents[e.keyCode] = e;
    }, true);

    document.addEventListener("keyup", function (e) {
        delete keyEvents[e.keyCode];
    }, true);

    this.registerUpdateHandler = function (fun) {
        updateHandler = fun;
        return this;
    };

    this.registerCollisionHandler = function (fun) {
        collisionHandler = fun;
        return this;
    };

    this.registerDestructionHandler = function (fun) {
        destructionHandler = fun;
        return this;
    };
    
    this.registerOffScreenDetector = function(fun){
        offScreenDetector= fun;
        return this;
    };
    
    this.registerOffScreenHandler = function(fun){
        offScreenHandler = fun;
        return this;
    };

    this.withCollisionDetector = function () {
        useCollisionDetector = true;
        return this;
    };



    this.start = function () {
        var runner = function (now) {
            var screenWidth = canvas.width;
            var screenHeight = canvas.height;
            context.clearRect(0, 0, canvas.width, canvas.height);
            updateHandler(context, now, keyEvents);
            sprites.forEach(function (sprite) {
                sprite.handleKeyEvents(keyEvents);
                sprite.handleUpdate(now);
                sprite.draw(context);
            });
            if (useCollisionDetector) {
                that.detectCollisions();
                sprites.forEach(function (sprite) {
                    if (sprite.isDestroyed()) {
                        sprite.handleDestruction();
                        destructionHandler(sprite);
                    }
                });
                sprites.forEach(function(sprite){
                    if(offScreenDetector(screenWidth, screenHeight, sprite.getPosition())){
                        offScreenHandler(sprite);
                    }
                });
                sprites = sprites.filter(function (each) {
                    return !each.isDestroyed();
                });
            }
            console.log(sprites.length);
            requestId = requestAnimationFrame(runner);
        };


        requestId = requestAnimationFrame(runner);
    };

    this.detectCollisions = function () {
        for (var i1 = 0; i1 < sprites.length; i1++) {
            for (var i2 = i1; i2 < sprites.length; i2++) {
                if (sprites[i1].collision(sprites[i2]) && i1 !== i2) {
                    sprites[i1].handleCollision(sprites[i2]);
                    collisionHandler(sprites[i1]);
                    sprites[i2].handleCollision(sprites[i1]);
                    collisionHandler(sprites[i1]);
                }
            }
        }
    };

    this.forEach = function(fun){
        sprites.forEach(fun);
    }


}


