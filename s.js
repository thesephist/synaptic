#!/usr/bin/env node

/* Project Synaptic 2.0: General Intelligence Project
 * Main thread build
 * Copyright Linus Lee 2015, All rights reserved.
 *
 * For inquires please contact linus@thelifelongtraveler.com
 *
 */

var Syn = require("./synaptic.js");

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
        console.log("^");
    },
    
    "a": function() {
        console.log("<");
    },
    
    "s": function() {
        console.log(">");
    },
 
    "d": function() {
        console.log("v");
    }
};

// no debugging messages are needed here...
Syn.quiet = true;

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

/* World design as JS object
 *
 * init: this.benefit: function
 *       this.harm: function
 *
 * simulate: function
 * respond: function
 */

