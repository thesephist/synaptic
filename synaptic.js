#!/usr/bin/env node

/* Project Synaptic 2.0: General Intelligence Project
 * Copyright Linus Lee 2015, All rights reserved.
 *
 * For inquires please contact linus@thelifelongtraveler.com
 *
 * * * * *
 * 
 * Project outline
 *
 * Event-driven, massively parallel system
 *    Changes in N.a: runs after an N.fire, then reflects any learning by filling from ambient right away over the next few intervals
 *    There is always a nonzero, exponentially decaying distribution of neurotransmitters
 */

// each neuron index associated with its stimulus, KEY
var keys = {
        0: "0",
        1: "1",
        2: "f"
};

var rkeys = {}, 
    scale = 0;

for (j in keys){
    if (!Object.prototype.hasOwnProperty.call(keys, j)) {
      continue;
    }

    rkeys[keys[j]] = j;
    
    scale += 1;
}

// init variables
var supervised = true, // if true, prompt for each input
    input_type = "text", // type of environmental input
    threshold = 2, // firing threshold
    mind, neuronlist,
    pace = 1.3, // learning pace, with 1 being static; nothing learned
    depreciation_c = 0.8, // how fast individual neurons (and thus the system) loses neurotransmitters
    variation = 0.05, // some preset value
    n_dist = 1.0; // neurotransmitter distribution, a float around the value of 1


// define which neurons are connected to which
var map = [
    "011",
    "101",
    "000"
];
 
// define class Neuron (N)
function N (index, key) {
    // basic properties
    this.state = 0.0; // float neuron states
    this.index = index; // numerical index in system, starts at 0
    this.key = key; // responds to KEY or activates response
    this.s = []; // strengths
    this.c = map[index].split(""); // connected neurons log

    return this;
}

N.prototype.init = function(){
    
    // how many neurons is this connected to?
    mod_length = 0;
    
    this.c.forEach(function(link){
        if (link) {
            mod_length += 1;
        }
    });

    // initialize this.s
    for(i = 0; i < scale; i++){
        if (this.c[i] == "1") {
            this.s.push(parseFloat(1) / mod_length);
        } else {
            this.s.push(parseFloat(0));
        }
    }

}

// define actions on class N
N.prototype.on = function(val) {
    this.state += val;
}

N.prototype.clear = function() {
    this.state = 0.0;
}

// learning function on N
N.prototype.a = function(){
    for (i = 0; i < scale; i++) {
        this.s[i] *= n_dist;
    }
}

// firing function on N
N.prototype.fire = function() {

    // check threshold
    if (this.state >= threshold) {

        // state * weight added to neuron
        for (i = 0; i < scale; i++){
            if (this.c[i] == "1") {
                click = this.state * this.s[i] + (Math.random()) * variation; 
                mind[i].on(click);
            }

            // the neuron is now cleared
            this.clear();
        }

        // learn for this neuron
        this.a();

        // for now, output is printing its key
        console.log("Fired: " + this.key);
    }

}

// mind object
function Mind (neuronlist) {
    this.network = neuronlist;
}

Mind.prototype.init = function() {
      // init all neurons
      this.network.forEach(function(neuron){
          neuron.init();
      });
};

Mind.prototype.cycle = function(input) {
        // set neurons from input on if there is input
        if (input) {
            input.split("").forEach(function(id){
                mind[parseInt(rkeys[id])].on(0.8) // this 0.8 is a very arbitrary amount
            });
        }
        this.network.forEach(function(neuron){
            neuron.fire();
        });
}

Mind.prototype.learn = function(response) {
    // change n_dist per response
}

// generate network
var mindlist = [];

for (i = 0; i < scale; i++){
    mindlist.push(new N(i, keys[i]));
}
mind = new Mind(mindlist);
console.log("Added total " + scale + " neurons to the network.");

// init network
mind.init();

// define a tick in the neural network
// might end up being a method on Mind
function tick() {
    
    // analogue of a time-unit of processing in the NN
    
    // receive input
    input = "";
    
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function(data) {

        // take input from stdin for now
        input += data;
        process.stdin.pause();

        // removing the last \n character
        input = input.substr(0, input.length - 1);

        // process input in network and fire all neurons
        mind.cycle(input);
        
        // get response from environment
        // (run world functions simulate() and respond(), with simulate() making the variable and respond() providing the variable
        // ...

        // change n_dist according to output
        // mind.learn(response);

        console.log(mind);
        
    });
}

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

// We're implementing a progressive, Iterative Abstraction Leraning (IAL) technique detailed on the ToDo list

tick();



