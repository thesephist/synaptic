#!/usr/bin/env node
/* Project Synaptic 2.0: General Intelligence Project
 */

/* project outline
 *
 * Event-driven, massively parallel system
 */

// each neuron index associated with its stimulus, KEY
var keys = {
        0: "a", // this is the first neuron in any network
        1: "0",
        2: "1"
};
var rkeys = {}, 
    scale = 0;

for (j in keys){
  if(!Object.prototype.hasOwnProperty.call(keys, j)){continue}
  rkeys[keys[j]] = j;
  scale+=1;
}

// init variables
var supervised = true, // if true, prompt for each input
    input_type = "text", // type of environmental input
    threshold = 2, // firing threshold
    mind = [], // array of all neurons
    pace = 1.3, // learning pace, with 1 being static; nothing learned
    depreciation_c = 0.8, // how fast individual neurons (and thus the system) loses neurotransmitters
    variation = 0.3, // some preset value
    n_dist = 0.5; // neurotransmitter distribution, a float (0,1]

// define which neurons are connected to which
var map = [
    "000",
    "001",
    "010"
]
 
// define class Neuron (N)
function N (index, key) {
    // basic properties
    this.state = 0; // integer neuron states
    this.index = index; // numerical index in system, starts at 0
    this.key = key; // responds to KEY or activates response
    this.s = []; // strengths
    this.c = map[index].split(""); // connected neurons log
    this.h = parseFloat(0); // history
}

N.prototype.init = function(){
    mod_length = 0;
    this.c.forEach(function(link){
        if(link=='1'){mod_length+=1;}
    });
    for(i=0;i<scale;i++){
        if(this.c[i]=='1'){
            this.s.push(parseFloat(1) / mod_length);
        }else{
            this.s.push(parseFloat(0));
        }
    }
}

// define actions on class N
N.prototype.on = function(val) {
    this.state += val;
}
N.prototype.clear = function() {
    this.state = 0;
}

// firing function on N
N.prototype.fire = function() {

    // check threshold
    if(this.state >= threshold) {

        // state * weight added to neuron
        for(i=0;i<scale;i++){
            if(this.c[i]=='1'){
                click = this.state * this.s[i] + (Math.random() - 1.0) * variation;
                mind[i].on(click);
                this.clear();
                this.h += click;
            }
        }

        // fire neurons just connected
        for(i=0;i<scale;i++){
            if(this.c[i]=='1'){
                mind[i].fire();
            }
        }


        // learn for this neuron
        this.a();

        // for now, output is printing its key
        console.log("Firing " + this.key.toString());
    }
}

// learning function on N
N.prototype.a = function(){
    // shouldn't really fire immediately, though. Figure this out later.
    this.state = this.h * n_dist; // just restore the previous thing, I suppose, with ambient weight
}

// generate network
for (i=0; i<scale; i++){
    console.log("Added to mind: neuron #" + keys[i]);
    mind.push(new N(i, keys[i]));
}
mind.forEach(function(neuron){
    neuron.init();
});

console.log(mind);

// begin accepting input
var input="101000110";

// and then do so every few intervals, whatever that ends up being
// this event may also be called by a neuron fire
function take_input(){
    input = input.split("");
    // turn on neurons
    input.forEach(function(bit){
        mind[parseInt(rkeys[bit])].on(0.8);
    });
    // begin firing cascade
    mind.forEach(function(neuron){
        neuron.fire();
    });
}

take_input();

