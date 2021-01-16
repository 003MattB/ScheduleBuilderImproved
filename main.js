import * as Course from './modules/course.js';
import * as Matrix from './modules/matrix.js';
import {UI} from './modules/ui.js';
import {Term} from './modules/terms.js';

let courses = [];
export {courses};
class Card extends HTMLElement{

    constructor() {
        super();
    }
    init (subject_id, catalog_number, section_num, title, tstart, tend, height) {
        this.cardTitle = `${subject_id}${catalog_number}`;
        this.name = title;
        this.section_num = section_num;
        this.time = `${tstart}-${tend}`;
        this.style.height = height;
        // this.style.backgroundColor = "#F78888";
        this.classList.add("card","overflow-auto");
        this.innerHTML = this.getInnerHTML();
        this.addEventListener('click', (event) => {
            if ($(event.target).hasClass('bi-x')) {
                // this.parentNode.removeChild(this);
                UI.toggleCardVisibility(this.cardTitle, this.section_num);

                Matrix.toggleVisibility(Matrix.getLayerSection(this.cardTitle, this.section_num),
                    false,UI.getCardColorClass(this.cardTitle, this.section_num));
            }
        });
        // this.addEventListener('mouseenter', (event) => {
        //     this.style.zIndex = "9999";
        //     this.style.backgroundColor = "#24de7e";
        // });
        // this.addEventListener('mouseleave', (event) => {
        //     this.style.zIndex = "5";
        //     this.style.backgroundColor = "#F78888";
        // });
    }

    getInnerHTML () {
        return "<div class=\"card-body p-1\">\n" +
                 "<div class=\"border-bottom\">\n" +
                   `<h6 class=\"text-left card-title mb-0 pb-0\">${this.cardTitle}</h6>\n` +
                   "<svg class=\"bi bi-x\" width=\"1em\" height=\"1em\" viewBox=\"0 0 16 16\" fill=\"currentColor\"" +
                    " xmlns=\"http://www.w3.org/2000/svg\">\n" +
                   "  <path fill-rule=\"evenodd\" d=\"M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0" +
                      " 01-.708-.708l7-7a.5.5 0 01.708 0z\" clip-rule=\"evenodd\"/>\n" +
                   "  <path fill-rule=\"evenodd\" d=\"M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0" +
                      " 00-.708 0z\" clip-rule=\"evenodd\"/>\n" +
                   "</svg>" +
                   `<span class=\"text-left text-muted card-time my-0 py-0\">${this.section_num}</span>\n` +
                   `<span class=\"text-left text-muted card-time my-0 py-0\">${this.time}</span>\n` +
               " </div>\n" +
                `<h6 class=\"card-subtitle my-2 text-muted\">${this.name}</h6>\n` +
               "</div>";
    }
}

customElements.define('my-card', Card);
// create the "table" of divs for the cards
const rows = document.querySelectorAll('.row');

for (let y = 1; y < rows.length; y++) {

    for (let x = 1; x < 8; x++) {
        const col = document.createElement('div');
        if (x % 2 === 0) {
            col.classList.add("border-left", "border-right");
        }
        if (y % 2 === 0) {
            col.classList.add("border-top", "border-bottom");
        }
        col.classList.add("col", "p-1");
        col.id = `r${y}c${x}`;
        col.style.zIndex = "0";
        rows[y].appendChild(col);
    }
}

//
// const card = document.createElement('my-card');
// const card2 = document.createElement('my-card');
// const card3 = document.createElement('my-card');
//
//
// card.init("CSCI", "4061", "Intro to operating systems", "8:00", "9:05","60px");
// card2.init("CSCI", "4061", "Intro to operating systems", "8:00", "9:05","60px");
// card3.init("CSCI", "4061", "Intro to operating systems", "8:00", "9:05","60px");
// console.log(card);
// document.querySelector('#r1c1').classList.remove("border-bottom");
// document.querySelector('#r2c1').classList.remove("border-top");
// document.querySelector('#r1c1').appendChild(card);
// document.querySelector('#r3c3').classList.remove("border-bottom");
// document.querySelector('#r4c3').classList.remove("border-top");
// document.querySelector('#r3c3').appendChild(card2);
// document.querySelector('#r7c5').classList.remove("border-bottom");
// document.querySelector('#r8c5').classList.remove("border-top");
// document.querySelector('#r7c5').appendChild(card3);






document.querySelector('.modal-footer').addEventListener('click', (event) => {
    if (event.target.textContent.toLowerCase() === "submit") {
        let xhr = new XMLHttpRequest();
        const c = UI.getInput("inputCatalog");
        const s = UI.getInput("inputSubject");
        /*
            The term is calculated as such:
            str(year - 1900) + 'code' // + is string concatination
            codes are as follows
            spring = 3
            fall = 9
            summer = 5
            for example: spring 2020 =
            2020 - 1900 + 3 = '120' + '3' = '1203'
         */
        let t = document.getElementById('term-select').value;
        let campus = document.getElementById('campus-select').value;
        const url = `https://courses.umn.edu/campuses/${campus}/terms/${t}/courses.json?q=catalog_number=${c},subject_id=${s}`
        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {
                if (myJson["courses"].length === 0) {
                    alert(`no class found for ${s}${c}`);
                } else {
                    //console.log(`${myJson["courses"].length} courses found for ${s}${c}`);
                    let course = new Course.Course(myJson["courses"][0]);
                    courses.push(course);
                    let color_index = localStorage.color_index ? parseInt(localStorage.color_index) : 0;
                    const color_class = `card-bg${((color_index) % Course.CARD_COLORS.length) + 1}`;
                    localStorage.setItem("color_index", (color_index + 1));
                    UI.createCards(course, color_class);
                    UI.addCourseToMatrix(course);
                    Matrix.changeLayerColor(course.subject,course.catalog_number,color_class);
                    UI.updateCredits(courses);
                }
                // const t = myJson["courses"][0]["title"];
                // const st = myJson["courses"][0]["sections"][0]["meeting_patterns"][0]["start_time"];
                // const et = myJson["courses"][0]["sections"][0]["meeting_patterns"][0]["end_time"];
                // const card = document.createElement('my-card');
                // card.init(s, c, t, st, et,"60px");
                // document.querySelector('#r6c3').appendChild(card);
            });

        // clear the form when done
        UI.clearInput("inputSubject");
        UI.clearInput("inputCatalog");
    } else if (event.target.textContent.toLowerCase() === "close") {
        UI.clearInput("inputSubject");
        UI.clearInput("inputCatalog");
    }
});



/**
 * Initializes the list of semesters to the previous, current, and next semester
 */
function initTermSelect() {
    let select = document.getElementById('term-select');
    let first = document.createElement('option');
    let second = document.createElement('option');
    let third = document.createElement('option');
    let today = new Date();
    let term = new Term(today.getFullYear(), today.getMonth() + 1);
    first.text = term.getPreviousTerm().toString();
    second.text = term.toString();
    third.text = term.getNextTerm().toString();
    first.value = term.getPreviousTerm().STERM();
    second.value = term.STERM();
    third.value = term.getNextTerm().STERM();
    select.add(first);
    select.add(second);
    select.add(third);
    select.value = second.value;
    select.addEventListener('change', () => {
        // TODO remove all the cards, clear the matrix, and set credits to 0
        console.log("the term changed. time to clean up the DOM");
    });
}
$(document).ready(function () {
    initTermSelect();
});


