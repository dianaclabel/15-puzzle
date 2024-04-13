export class Tablero {
  piezas = [];
  matriz = [];
  elemento;
  counter = 0;
  size = 4;

  constructor(elementoId, counterId) {
    this.elemento = document.getElementById(elementoId);
    if (!this.elemento) {
      throw new Error("El elemento no existe");
    }
    this.elemento.innerHTML = "";
    this.elementoCounter = document.getElementById(counterId);

    for (let fila = 1; fila <= 4; fila++) {
      for (let col = 1; col <= 4; col++) {
        const pieza = new Pieza(4 * (fila - 1) + col, fila, col);
        pieza.elemento.addEventListener("click", () => {
          this.moverImprimirYComprobar(pieza.numero);
        });
        this.piezas.push(pieza);
      }
    }
    this.piezas[this.piezas.length - 1] = null;

    this.elemento.append(...this.piezas.filter(Boolean).map((p) => p.elemento));
    shuffle(this.piezas);

    this.matriz = splitInChunks(this.piezas, 4);
    this.refrescarVista();
  }

  refrescarVista() {
    for (let fila = 1; fila <= 4; fila++) {
      for (let columna = 1; columna <= 4; columna++) {
        const pieza = this.matriz[fila - 1][columna - 1];
        if (pieza) {
          pieza.setPosicion(fila, columna);
        }
      }
    }
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
            piezaCandidata.setPosicion(fila - 1, columna);
            this.incrementCounter();
            return;
          }
          // Check abajo
          else if (fila < 4 && this.matriz[fila][columna - 1] === null) {
            console.log("baja");
            this.matriz[fila][columna - 1] = piezaCandidata;
            this.matriz[fila - 1][columna - 1] = null;
            piezaCandidata.setPosicion(fila + 1, columna);
            this.incrementCounter();
            return;
          }
          // Check izquierda
          else if (columna > 1 && this.matriz[fila - 1][columna - 2] === null) {
            console.log("izquierda");
            this.matriz[fila - 1][columna - 2] = piezaCandidata;
            this.matriz[fila - 1][columna - 1] = null;
            piezaCandidata.setPosicion(fila, columna - 1);
            this.incrementCounter();
            return;
          }
          // Check derecha
          else if (columna < 4 && this.matriz[fila - 1][columna] === null) {
            console.log("derecha");
            this.matriz[fila - 1][columna] = piezaCandidata;
            this.matriz[fila - 1][columna - 1] = null;
            piezaCandidata.setPosicion(fila, columna + 1);
            this.incrementCounter();
            return;
          }
        }
      }
    }
  }

  incrementCounter() {
    this.counter += 1;
    this.elementoCounter.innerText = this.counter;
  }

  imprimir() {
    console.table(
      this.matriz.map((fila) => fila.map((pieza) => pieza?.numero ?? "(vacio)"))
    );
    console.log("Movimiento:", this.counter);
  }

  comprobar() {
    for (let fila = 1; fila <= 4; fila++) {
      for (let columna = 1; columna <= 4; columna++) {
        const pieza = this.matriz[fila - 1][columna - 1];
        const estaEnLaPosicionOriginal =
          pieza &&
          pieza.columnaOriginal === columna &&
          pieza.filaOriginal === fila;
        // Verificamos si no está en su posición ganadora
        if (!estaEnLaPosicionOriginal) {
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
  // Posicion original
  filaOriginal = 0;
  columnaOriginal = 0;
  // Posicion actual
  fila = 0;
  columna = 0;
  elemento;

  constructor(numero, filaOriginal, columnaOriginal) {
    this.numero = numero;
    this.filaOriginal = filaOriginal;
    this.columnaOriginal = columnaOriginal;
    // DOM
    this.elemento = document.createElement("div");
    this.elemento.classList.add("box");

    const img = document.createElement("img");
    img.src = "./assets/gatito.webp";

    img.style.borderRadius = "10px";
    img.style.width = "400%";
    img.style.height = "400%";
    img.style.top = -(filaOriginal - 1) * 100 + "%";
    img.style.left = -(columnaOriginal - 1) * 100 + "%";

    const span = document.createElement("span");
    span.textContent = numero;

    this.elemento.append(img, span);
  }

  setPosicion(fila, columna) {
    this.fila = fila;
    this.columna = columna;
    this.elemento.style.top = (fila - 1) * 25 + "%";
    this.elemento.style.left = (columna - 1) * 25 + "%";
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
