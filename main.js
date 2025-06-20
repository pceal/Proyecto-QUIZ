// //  Variables Globales y DOM 
// // Arrays para almacenar datos del quiz

const API_URL = "https://opentdb.com/api.php?amount=10&category=27&type=multiple";
const botonGo = document.getElementById("buttom-go");
const botonHome = document.getElementById("button-home");
const vista1 = document.getElementById("vista1");
const vista2 = document.getElementById("vista2");
const preguntas = document.getElementById("preguntas");
const respuesta1Btn = document.getElementById("respuesta1");
const respuesta2Btn = document.getElementById("respuesta2");
const respuesta3Btn = document.getElementById("respuesta3");
const respuesta4Btn = document.getElementById("respuesta4");
const startButton = document.getElementById("buttom-start");
const botonAnterior = document.getElementById("btn-anterior");
const botonSiguiente = document.getElementById("btn-siguiente");
const preguntaTitulo = document.getElementById("preguntas");
const botonResultado = document.getElementById("btn-resultados");
const vista3 = document.getElementById("vista3")
const botonVolverInicio = document.getElementById("btn-volver-inicio");
const totalAcertadas = document.getElementById("total-acertadas");
const botonRestart = document.getElementById("btn-restart");
const contadorPreguntas = document.getElementById('contadorPreguntas');
const botonesRespuesta = [respuesta1Btn, respuesta2Btn, respuesta3Btn, respuesta4Btn];
let respuestasUsuario = [];
let respuestasCorrectasUsuario = [];
let preguntasArray = [];


//vista 2
const mostrarJuego = () => {
    vista1.classList.add("d-none")
    vista2.classList.remove("d-none")
    vista3.classList.add("d-none")
    botonGo.classList.add("btn-btn-primary")
    botonHome.classList.remove("btn-btn-danger")
    indicePreguntaActual = 0

}

const resetearJuego = () => {
    vista1.classList.add("d-none")
    vista2.classList.remove("d-none")
    vista3.classList.add("d-none")
    botonGo.classList.add("btn-btn-primary")
    botonHome.classList.remove("btn-btn-danger")
    botonRestart.classList.remove("d-none")
    indicePreguntaActual = 0
    botonAnterior.classList.add('d-none');
    botonSiguiente.classList.add('d-none');
    botonResultado.classList.add('d-none');


}


// vista 1
const mostrarHome = () => {
    vista1.classList.remove("d-none")
    vista2.classList.add("d-none")
    vista3.classList.add("d-none")
    botonGo.classList.remove("btn-btn-primary")
    botonHome.classList.add("btn-btn-danger")
    botonResultado.classList.add("btn-btn-success")

}
// vista 3
const mostrarResultados = () => {
    vista1.classList.add("d-none")
    vista2.classList.add("d-none")
    vista3.classList.remove("d-none")
    botonGo.classList.remove("btn-btn-primary")
    botonHome.classList.remove("btn-btn-danger")

    totalAcertadas.textContent = `¡Acertaste ${respuestasCorrectasUsuario.length} de ${preguntasArray.length} preguntas!`;

}

let estaCargandoPreguntas = false

const getQuestions = async () => {
    if (estaCargandoPreguntas) {
        return;
    }
    estaCargandoPreguntas = true;
    startButton.disabled = true;
    try {
        const res = await axios.get(API_URL);
        preguntasArray = res.data.results;
        mostrarPregunta(indicePreguntaActual);
    } catch (error) {
        console.error("Error al obtener las preguntas:", error);
    } finally {
        estaCargandoPreguntas = false;
        startButton.disabled = false;
    }
};

const mostrarPregunta = (indice) => {
    resetearEstadoBotones();
    resetearEstilosBotones();
    resetearBotonesActivos();
    actualizarContadorPreguntas();
    botonAnterior.disabled = true;
    botonSiguiente.classList.remove('d-none');

    if (indice >= 0 && indice < preguntasArray.length) {
        const preguntaActual = preguntasArray[indice];
        preguntaTitulo.textContent = preguntaActual.question;
        const correcta = preguntaActual.correct_answer;
        const incorrectas = preguntaActual.incorrect_answers;
        const todasLasRespuestas = [correcta, ...incorrectas].sort(() => Math.random() - 0.5);
        const botonesRespuesta = [respuesta1Btn, respuesta2Btn, respuesta3Btn, respuesta4Btn];
        botonesRespuesta.forEach((btn, i) => {
            btn.textContent = todasLasRespuestas[i] || '';
            btn.dataset.correcta = (btn.textContent === correcta).toString();
        });
    } else {
        botonesRespuesta.forEach(btn => {
            btn.textContent = "";
            btn.disabled = true;
        });
    }
};
startButton.addEventListener('click', () => {
    indicePreguntaActual = 0;
    preguntaTitulo.textContent = "Preguntas";
    getQuestions();
    startButton.classList.add('d-none');

});

botonRestart.addEventListener('click', () => {
    indicePreguntaActual = 0;
    preguntaTitulo.textContent = "Preguntas";
    getQuestions();
    botonRestart.classList.add('d-none');
    botonSiguiente.disabled = false;
    botonSiguiente.classList.remove('d-none');
    respuestasCorrectasUsuario = [];
    totalAcertadas.textContent = `¡Acertaste 0 de ${preguntasArray.length} preguntas!`;
});


const siguientePregunta = () => {
    indicePreguntaActual++;
    console.log("Índice de pregunta actual:", indicePreguntaActual);
    mostrarPregunta(indicePreguntaActual);
    if (indicePreguntaActual > 0) {
        botonAnterior.disabled = false;
        botonAnterior.classList.remove('d-none');
    }
    if (indicePreguntaActual === preguntasArray.length - 1) {
        botonSiguiente.disabled = true;
        botonResultado.classList.remove('d-none');
    }
};

const resetearEstilosBotones = () => {
    botonesRespuesta.forEach(btn => {
        btn.classList.remove('btn-success', 'btn-danger');
        btn.style.backgroundColor = '';
        btn.style.boxShadow = 'none';
    });
};

const resetearBotonesActivos = () => {
    botonesRespuesta.forEach(btn => {
        btn.classList.remove('active');
    });
};

const resetearEstadoBotones = () => {
    resetearEstilosBotones();
    botonesRespuesta.forEach(btn => {
        btn.disabled = false;
    });
};


const anteriorPregunta = () => {
    indicePreguntaActual--;
    console.log("Índice de pregunta actual:", indicePreguntaActual);
    mostrarPregunta(indicePreguntaActual);
};




const aplicarEstilosRespuesta = (botonSeleccionado, correcta) => {
    botonesRespuesta.forEach(btn => {
        btn.classList.remove('active');
        btn.style.backgroundColor = '';
        btn.disabled = true;
        if (btn.textContent === correcta) {
            btn.style.backgroundColor = 'lightgreen';
        } else if (btn === botonSeleccionado) {
            btn.style.backgroundColor = 'salmon';
        }
        botonSeleccionado.classList.add('active');
    });


};

botonesRespuesta.forEach(button => {
    button.addEventListener('click', function () {
        const preguntaActual = preguntasArray[indicePreguntaActual];
        const correcta = preguntaActual.correct_answer;
        guardarRespuestaSeleccionada(this.textContent);
        if (this.dataset.correcta === "true") {
            respuestasCorrectasUsuario.push(this.textContent);
            console.log("Respuesta correcta:", this.textContent);
        }
        aplicarEstilosRespuesta(this, correcta);

    });
}
);

const guardarRespuestaSeleccionada = (respuesta) => {
    respuestasUsuario[indicePreguntaActual] = respuesta;
    console.log("Respuestas del usuario:", respuestasUsuario);
};

function actualizarContadorPreguntas() {
    contadorPreguntas.textContent = (preguntasArray && preguntasArray.length > 0) ?
        `${indicePreguntaActual + 1} / ${preguntasArray.length}` :
        'Cargando preguntas...';
}


botonGo.addEventListener("click", mostrarJuego);
botonHome.addEventListener("click", mostrarHome);
botonResultado.addEventListener("click", mostrarResultados);
botonVolverInicio.addEventListener("click", resetearJuego);
botonSiguiente.addEventListener('click', siguientePregunta);
botonAnterior.addEventListener('click', anteriorPregunta);
totalAcertadas.innerHTML = ''; 