export class Tablero {
  piezas = [];
  matriz = [];

  constructor() {
    for (let fila = 1; fila <= 4; fila++) {
      this.matriz.push([]);

      for (let col = 1; col <= 4; col++) {
        const pieza = new Pieza(4 * (fila - 1) + col, new Posicion(col, fila));
        this.piezas.push(pieza);
      }
    }

    shuffle(this.piezas);
    const posRandom = Math.ceil(Math.random() * 16);
    this.piezas[posRandom] = null;

    this.matriz = splitInChunks(this.piezas, 4);
  }

  mover(numeroDePieza) {
    for (let fila = 1; fila <= 4; fila++) {
      for (let columna = 1; columna <= 4; columna++) {
        const piezaCandidata = this.matriz[fila - 1][columna - 1];
        const piezaCorrecta = piezaCandidata?.numero === numeroDePieza;
        if (piezaCorrecta) {
          // Check arriba
          if (fila > 1 && this.matriz[fila - 2][columna - 1] === null) {
            console.log("sube");
            this.matriz[fila - 2][columna - 1] = piezaCandidata;
            this.matriz[fila - 1][columna - 1] = null;
            return;
          }
          // Check abajo
          else if (fila < 4 && this.matriz[fila][columna - 1] === null) {
            console.log("baja");
            this.matriz[fila][columna - 1] = piezaCandidata;
            this.matriz[fila - 1][columna - 1] = null;
            return;
          }
          // Check izquierda
          else if (columna > 1 && this.matriz[fila - 1][columna - 2] === null) {
            console.log("izquierda");
            this.matriz[fila - 1][columna - 2] = piezaCandidata;
            this.matriz[fila - 1][columna - 1] = null;
            return;
          }
          // Check derecha
          else if (columna < 4 && this.matriz[fila - 1][columna] === null) {
            console.log("derecha");
            this.matriz[fila - 1][columna] = piezaCandidata;
            this.matriz[fila - 1][columna - 1] = null;
            return;
          }
        }
      }
    }
  }

  imprimir() {
    console.table(
      this.matriz.map((fila) => fila.map((pieza) => pieza?.numero ?? "(vacio)"))
    );
  }

  comprobar() {
    for (let fila = 1; fila <= 4; fila++) {
      for (let columna = 1; columna <= 4; columna++) {
        const pieza = this.matriz[fila - 1][columna - 1];
        const estaEnLaPosicionGanadora =
          pieza &&
          pieza.posGanadora.columna === columna &&
          pieza.posGanadora.fila === fila;
        // Verificamos si no está en su posición ganadora
        if (!estaEnLaPosicionGanadora) {
          return false;
        }
      }
    }
    return true;
  }

  moverImprimirYComprobar(numeroDePieza) {
    this.mover(numeroDePieza);
    this.imprimir();
    if (this.comprobar()) {
      console.log("Has ganado!");
    }
  }
}

class Pieza {
  numero = 0;
  posGanadora = new Posicion(0, 0);

  constructor(numero, posGanadora) {
    this.numero = numero;
    this.posGanadora = posGanadora;
  }
}

class Posicion {
  columna = 0;
  fila = 0;

  constructor(columna, fila) {
    this.columna = columna;
    this.fila = fila;
  }
}

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

function splitInChunks(array, chunkSize = 1) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
}
