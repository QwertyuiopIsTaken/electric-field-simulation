# electric-field-simulation

A [webpage simulation](https://qwertyuiopistaken.github.io/electric-field-simulation/) of a dynamic electric field.

It simulates a dynamic field through wave propagations that enforces the finite speed of light.
Particles can be moved around to change the gradient of the electric field.

This simulation works by applying electrostatic forces to every field point when a particle is placed. When a particle is moved, an anti-propagation wave is produced to nullify its original influence in the electric field.

Currently working on a grid system to improve runtime performance. Instead of updating every point, it can just check the points that are in the same grid.

Any suggestions to improve the code are welcome. Just send a PR, or create an [issue](https://github.com/QwertyuiopIsTaken/electric-field-simulation/issues/new).