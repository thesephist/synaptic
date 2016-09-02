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

var mind = new Syn.Mind();
mind.motion = "";

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
    [0, 0, 0, 0, 1]
];

Syn.actions = {
    "x": function() {
        mind.learn(Syn.world.respond());
        console.log("Lesson acknowledged!");
    },
    
    "w": function() {
        dy ++;
        console.log("^");
        mind.motion += "^";
    },
    
    "a": function() {
        dx --;
        console.log("<");
        mind.motion += "<";
    },
    
    "s": function() {
        dy --;
        console.log("v");
        mind.motion += "v";
    },
 
    "d": function() {
        dx ++;
        console.log(">");
        mind.motion += ">";
    }
};

Syn.world.respond = function() {
    // executed after the input has been processed, so has nonzero dx, dy
    ds = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    if (ds > 6) ds = 6;

    console.log(dx, dy, ds);
    
    dx = dy = 0;

    // returns 0 <= result <= 1;
    return ((6 - ds) / 3 - 1);
}

// verbose for now
Syn.quiet = false;
Syn.cyclesPerResponse = 3;

// generate network
var neuronlist = [];

for (i = 0; i < Syn.map.length; i ++) {
    neuronlist.push(new Syn.Neuron(i, Syn.keys[i], mind));
}

mind.init(neuronlist);

// for iterators
var module;
module.exports = exports = {
    Syn: Syn,
    mind: mind
}

 mind.tick();
