#!/usr/bin/env node

/* Project Synaptic 2.0: General Intelligence Project
 * Main thread build
 * Copyright Linus Lee 2015-2016, All rights reserved.
 *
 * For inquires please contact linus@thelifelongtraveler.com
 *
 */

var Syn = require("./synaptic.js");

var dx, dy, ds;
dx = dy = ds = 0;

// each neuron index associated with its key
Syn.keys = {
    0: "w",
    1: "a",
    2: "s",
    3: "d",
    4: "x" // x marks the spot; the more the x in the next input, the closer it was
};

// this as array of arrays
Syn.map = [
 [1, 0, 1, 0, 0],
 [0, 1, 0, 1, 0],
 [1, 0, 1, 0, 0],
 [0, 1, 0, 1, 0],
 [1, 1, 1, 1, 1], // these endorphin neurons might not need to be connected to anything, really
];

Syn.actions = {
    "x": function() {
        mind.learn();
        console.log("Lesson acknowledged!");
    },
    
    "w": function() {
        dy += 1;
        console.log("^");
    },
    
    "a": function() {
        dx -= 1;
        console.log("<");
    },
    
    "s": function() {
        dy -= 1;
        console.log("v");
    },
 
    "d": function() {
        dx += 1;
        console.log(">");
    }
};

Syn.world.respond = function() {
    // executed after the input has been processed, so has nonzero dx, dy
    ds = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    if (ds > 20) ds = 20;

    console.log(dx, dy, ds);
    
    dx = dy = 0;

    // returns 0 <= result <= 1;
    return ((20 - ds) / 10 - 1);
}

// no debugging messages are needed here...
Syn.quiet = false;

Syn.generateRKeys();
Syn.cyclesPerResponse = 3;

// generate netwiork
var neuronlist = [];

for (i = 0; i < Syn.scale; i++) {
    neuronlist.push(new Syn.Neuron());
    neuronlist[i].init(i, Syn.keys[i]);
};

mind = new Syn.Mind();
mind.init(neuronlist);

mind.tick();



