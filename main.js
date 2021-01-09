import * as Course from './modules/course.js';
import * as Matrix from './modules/matrix.js';

const courses = [];
let color_index = 0;


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
                this.parentNode.removeChild(this);
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


class UI {

    static clearInput(id) {
        const e = document.querySelector(`#${id}`).value = '';
    }
    static getInput(id) {
        return document.querySelector(`#${id}`).value;
    }

    static createCards(course) {
        // keep the courses around for later
        courses.push(course);
        color_index = localStorage.color_index ? parseInt(localStorage.color_index) : 0;
        const color = Course.CARD_COLORS[((color_index) % Course.CARD_COLORS.length)];
        const color_class = `card-bg${((color_index) % Course.CARD_COLORS.length) + 1}`;
        localStorage.setItem("color_index", (color_index + 1));
        console.log("next color index: " + localStorage.color_index);
        for (let i = 0; i < course.sections.length; i++) {
            const section = course.sections[i];
            for (let d = 0; d < section.meet_days.length; d++) {
                const id = UI.getSectionLocationID(section.meet_days[d],section.startTimeAsNumber());
                const height = UI.cardHeightFromSection(section);
                const card = document.createElement('my-card');
                card.init(course.subject,
                          course.catalog_number,
                          section.section_number,
                          course.title,
                          section.meet_start_time,
                          section.meet_end_time,
                          `${height}px`);
                //card.style.backgroundColor = color;
                card.classList.add(color_class);
                document.querySelector(`#${id}`).appendChild(card);
                document.querySelector(`#${id}`).classList.remove('border-bottom');
                //console.log(`creating card for ${section.meet_days[d]} ${section.meet_start_time} id: ${id}`);
            }
        }
    }

    static addCourseToMatrix(course) {
        // let heading = course.subject + course.catalog_number;
        // let sub_id = heading + "menu";
        // let li = `<li><a href="#${sub_id}" data-toggle="collapse" aria-expanded="true">${heading}</a></li>`;
        // li += `<li><ul id="${sub_id}" class="collapse list-unstyled">`;
        // for (let i = 0; i < course.sections.length; i++) {
        //     li += `<li>${course.sections[i].section_number}</li>`;
        // }
        // li += "</ul></li>";
        let li = "<li>" + Matrix.createCourseLayer(course) + "</li>";
        let item = document.createElement("li");
        item.innerHTML = li;
        document.getElementById("homeSubmenu").appendChild(item);
    }

    static cardHeightFromSection(section) {
        let duration = section.endTimeAsNumber() - section.startTimeAsNumber();
        // get the height of one of the rows
        let height = document.querySelector("#r1c0").clientHeight;
        // each row is 1 hour so multiply the duration by the height to get the card height
        return duration * height;
    }

    static getSectionLocationID(day, startTime) {
        let col = "c" + Course.DAY_CODES[day];
        let row = "r" + Course.TIME_CODES[parseInt(startTime)];
        return row + col;
    }

    static updateCredits() {
        console.log("updating the total credits for " + courses.length + " courses");
        let total = 0;
        for (let i = 0; i < courses.length; i++) {
            total += courses[i].credits;
        }
        console.log("total credits is: " + total);
        document.getElementById("creditsTotal").innerText = total;
    }
}



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
        let semester = getCurrentSemester();
        let t = getNextSTRM(semester);
        console.log(`next strm is ${t}`)
        const url = `https://courses.umn.edu/campuses/umntc/terms/${t}/courses.json?q=catalog_number=${c},subject_id=${s}`
        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {
                if (myJson["courses"].length === 0) {
                    alert(`no class found for ${s}${c}`);
                } else {
                    console.log(`${myJson["courses"].length} courses found for ${s}${c}`);
                    let course = new Course.Course(myJson["courses"][0]);
                    UI.createCards(course);
                    UI.addCourseToMatrix(course);
                    Matrix.changeLayerColor(course.subject,course.catalog_number,"#F3D250");
                    UI.updateCredits();
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

function getCurrentSemester () {
    /*
    spring : 3
    summer : 5
    fall   : 9
     */
    let date = new Date();
    let month = date.getMonth();
    if (month < 6) {
        return '3';
    } else if (month < 9) {
        return '5';
    }
    return '9';
}

function getNextSTRM(curSemester) {
    return '1213'; // temp for testing - remove for production
    let date = new Date();
    let year = date.getFullYear();
    let sn = parseInt(curSemester);
    if (sn < 5) { // summer is the next term
        return (year - 1900).toString() + '5';
    } else if (sn < 9) { // fall is the next term
        return (year - 1900).toString() + '9';
    }
    // spring of following year
    return (year - 1899).toString() + '3';
}