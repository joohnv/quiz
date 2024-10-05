let questions = [];
let current_question = 0;
const quiz_div = document.querySelector(".quiz");
const user_div = document.querySelector(".user");

let playerName = '';
let correctAnswers = 0;
let wrongAnswers = 0;

// Mostrar json
function show_json() {
    let question_div = document.querySelector(".question");
    let options_div = document.querySelector(".options");
    let show_result = document.querySelector(".showResult p");

    // Limpiar los div anteriores
    question_div.innerHTML = "";
    options_div.innerHTML = "";
    show_result.innerHTML = ""; // Asegúrate de que esto se ejecute

    // Recorrer objeto por objeto el json
    if (current_question < questions.length) {
        let item = questions[current_question];
        question_div.innerHTML = `${current_question + 1}. ${item.pregunta}`;

        item.opciones.forEach(option => {
            let option_btn = document.createElement("button");
            option_btn.textContent = option;
            //obtenemos el primer caracter que es la letra
            option_btn.value = option.charAt(0);
            options_div.appendChild(option_btn);

            // Mirar si es correcta o no la respuesta
            check_answer(option_btn, item.respuesta_correcta);
        });
    } else {
        show_final_results();
    }
}

// Corregir las respuestas
function check_answer(btn, correctAnswer) {
    btn.addEventListener("click", () => {
        let resultElement = document.querySelector("p");
        //obtener la letra de la respuesta correcta
        const selectedValue = btn.value.charAt(0);

        if (selectedValue === correctAnswer) {
            resultElement.innerHTML = "Correcto!";
            btn.style.background = "green";
            correctAnswers++;
        } else {
            resultElement.innerHTML = "Error!";
            btn.style.background = "red";
            wrongAnswers++;
        }

        current_question++;
        //si no se anade el setTimeOut los textos de Correcto o Error no se cargarian.
        setTimeout(() => {
            show_json(); 
        }, 500); 
    });
}

//guardar la informacion en un json para luego mostrarlo
function show_final_results() {
    let h = document.querySelector(".quizWinner");
    
    // Corrected the logic for winning/losing
    if (correctAnswers >= 10) {
        h.innerHTML = "HAS GANADO EL CONCURSO!";
    } else {
        h.innerHTML = "HAS PERDIDO EL CONCURSO!";
    }
    
    quiz_div.innerHTML = `
        <h2>Quiz finalizado!</h2>
        <p>Jugador: ${playerName}</p>
        <p>Aciertos: ${correctAnswers}</p>
        <p>Fallos: ${wrongAnswers}</p>
    `;

    document.querySelector('.results').style.display = 'block';
}

// Cargar json
const load_json = async () => {
    let response = await fetch("./json/questions.json");
    let data = await response.json();
    questions = data.preguntas;

    show_json();
}

// Una vez escrito el nombre mostrar el quiz_div y ocultar el user_div
function show_quiz() {
    let input_user = document.getElementById("username");

    input_user.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            playerName = input_user.value;
            user_div.style.display = "none";
            quiz_div.style.display = "block";
            load_json();
        }
    });
}

show_quiz();
