#!/usr/bin/env node

// binary input differentiation

// this controls the tick sequences, manages ticks
var ticker = setInterval(tick, 1000);

// World design as a JS Object
function World (benefit, harm) {
    // init function

    // the neurons firing will modify these variables as necessary

    // each of these are floats 0 - 1
    this.benefit = benefit;
    this.harm = harm;

    return this;
}

World.prototype.simulate = function(){
    // normalize benefit and harm floats to linear scales
    // with bounds at 0 and upper limit of either attributes
    
    //console.log("Simulated");
}

World.prototype.respond = function(){
    //console.log("Responded");
    
    return benefit;
}

