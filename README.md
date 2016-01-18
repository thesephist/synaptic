# Synaptic

Event-driven neural network on NodeJS\*

## Operating principles

Synaptic's neural network is designed less to be a take-input-give-output style problem-solving tool _a la_ PyBrain and more a semi-authentic real-time smulation of a brain, processing information and _responding_ instead, _a la_ the SpiNNaker project.

To this end, Synaptic follows several core principles. 

1. __Event-driven firing activity__ - rather than the more traditional loop-based model, an event-driven model of firing neurons (that is, neurons firing in real time in response to respective inputs) is much more suitable for real-time simulations and authenticity of the network simulation.
2. __Dissolution of discrete layers and back-propagation of errors__ - discrete layers and back propagation are effective, but artifacts of systems that are not event-driven, and, rather designed to be problem-solving, not to be a general intelligence responding holistically to the environment. Synaptic abandons this model for a more direct way of responding to input in both firing (1) and the learning algorithm (3)
3. __Learning algorithm based on positive / negative feedback__ - 
4. __Environment state-based learning algorithm__ - a good general intelligence must be developed with the environment in mind. At a later stage of development learning algorithms will be tested inside a specifically designed simulated "environment"

(_more to be added here soon in a later commit_)

- - -

\* In retrospect, having such a data-intensive simulation based on node was probably not the most intelligent decision I've made. But Synaptic was designed less as a practical application and more as a proof-of-concept prototype, and as concepts are validated to work, Synaptic's core ideas will be ported to be either SQL- or C++-based in the future.


