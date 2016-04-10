#!/usr/bin/env node

// getting food when it's provided with one

// this controls the tick sequences, manages ticks
var ticker = setInterval(tick, 1000);

// World design as a JS Object
function World (benefit, harm) {
    // init function
    
    this.benefit = benefit;
    this.harm = harm;

    return this;
}

World.prototype.simulate = function(){
    
    console.log("Simulated");
}

World.prototype.respond = function(){

    console.log("Responded");
}
