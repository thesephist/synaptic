#!/usr/bin/env node

/* Project Synaptic 2.0: General Intelligence Project
 * Main thread build
 * Copyright Linus Lee 2015-2016, All rights reserved.
 *
 * For inquires please contact linus@thelifelongtraveler.com
 *
 */

var Syn = require("./synaptic.js");
var PNG = require("pngjs");

var pixelArray = [0, 0, 0]; // right now, a black and white 3 * 1 PNG

// each neuron index associated with its key
Syn.keys = {
    0: "draw", // only input neuron actually getting data -- idk what this stands for yet, but think biologically
    1: "px0", // first pixel
    2: "px1", // first pixel
    3: "px2", // first pixel
    4: "x" // for now, let's only have one input for how good the image is
};

// this as array of arrays
// for DRAW.JS, it's basically 1 - diag - [1](n * n) - diag - 1
// to begin, we're going for a 3 * 1 PNG
Syn.map = [
 [1, 0, 0, 0, 0],
 [0, 1, 1, 1, 0],
 [0, 1, 1, 1, 0],
 [0, 1, 1, 1, 0],
 [0, 0, 0, 0, 0]
];

Syn.actions = {
    "x": function() {
        mind.learn();
        console.log("Lesson acknowledged!");
    },
    
    "draw": function() {
        // console functions...
    },

    "px0": function() {
        pixelArray[0] += 0.1;
    },
    
    "px1": function() {
        pixelArray[1] += 0.1;
    },
  
    "px2": function() {
        pixelArray[2] += 0.1;
    }

};

// I need to pose this as a situation with a world and an agent
Syn.world.respond = function() {
    // I don't know what should go here, but the input should ...
    // ... probably come from uh the human feedback provider?

    return 0; // neutral
}

// verbose for now
Syn.quiet = false;
Syn.cyclesPerResponse = 1;

// generate network
var neuronlist = [];
var mind = new Syn.Mind();

for (i = 0; i < Syn.scale; i++) {
    neuronlist.push(new Syn.Neuron(i, Syn.keys[i], mind));
};

mind.init(neuronlist);

mind.tick();

