#!/usr/bin/env node

/* Project Synaptic 2.0: General Intelligence Project
 * Main thread build
 * Copyright Linus Lee 2015-2016, All rights reserved.
 *
 * For inquires please contact linus@thelifelongtraveler.com
 *
 */

var Syn = require("../synaptic.js");

var record = false;

// each neuron index associated with its key
Syn.keys = {
    0: "0",
    1: "1",
    2: "x"
};

// this as array of arrays
Syn.map = [
  [1, 1, 0],
  [1, 1, 0],
  [0, 0, 0]
];

Syn.actions = {
    "0": function() {
        record = false;
        console.log("+ ");
    }, 
    "1": function() {
        record = true;
        console.log(" +");
    },
    "x": function() {
        mind.learn();
        console.log("Learned!");
    }
};

Syn.quiet = false; // not yet
Syn.cyclesPerResponse = 3;

// generate netwiork
var neuronlist = [];
var mind = new Syn.Mind();

for (i = 0; i < Syn.map.length; i++) {
    neuronlist.push(new Syn.Neuron(i, Syn.keys[i], mind));
};

mind.init(neuronlist);

mind.tick();

