import { Tablero } from "./js/Tablero.js";

const miTablero = new Tablero();

console.log(miTablero);

miTablero.imprimir();

window.miTablero = miTablero;

// funcion para mover las box
// funcion para barajear la matriz
// crear una matriz

let divBox = document.querySelectorAll("box");

const tablero = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, null],
];
