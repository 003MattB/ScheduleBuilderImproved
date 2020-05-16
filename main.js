const courses = [];
const DAY_CODES = {"m": "1", "t": "2", "w": "3", "th": "4", "f": "5","sa": "6", "su": "7"};
const TIME_CODES = {8: 1, 9: 2, 10: 3, 11: 4, 12: 5, 13: 6, 14: 7, 15: 8, 16: 9, 17: 10, 18: 11, 19: 12, 20: 13};
const CARD_COLORS = ["#F78888",
    "#F3D250",
    "#ECECEC",
    "#90CCF4",
    "#9FEDD7"];
let color_index = 0;


class Card extends HTMLElement{

    constructor() {
        super();
    }
    init (subject_id, catalog_number, title, tstart, tend, height) {
        this.cardTitle = `${subject_id}${catalog_number}`;
        this.name = title;
        this.time = `${tstart}-${tend}`;
        this.style.height = height;
        this.style.backgroundColor = "#F78888";
        this.classList.add("card","overflow-auto");
        this.innerHTML = this.getInnerHTML();
        this.style.zIndex = "1";
    }

    getInnerHTML () {
        return "<div class=\"card-body p-1\">\n" +
            "<div class=\"border-bottom\">\n" +
            `<h6 class=\"text-left card-title mb-0 pb-0\">${this.cardTitle}</h6>\n` +
            `<span class=\"text-left text-muted card-time my-0 py-0\">${this.time}</span>\n` +
            " </div>\n" +
            `<h6 class=\"card-subtitle my-2 text-muted\">${this.name}</h6>\n`;
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
        const color = CARD_COLORS[((color_index) % CARD_COLORS.length)];
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
                          course.title,
                          section.meet_start_time,
                          section.meet_end_time,
                          `${height}px`);
                card.style.backgroundColor = color;
                document.querySelector(`#${id}`).appendChild(card);
                console.log(`creating card for ${section.meet_days[d]} ${section.meet_start_time} id: ${id}`);
            }
        }
    }

    static cardHeightFromSection(section) {
        let duration = section.endTimeAsNumber() - section.startTimeAsNumber();
        // get the height of one of the rows
        let height = document.querySelector("#r1c0").clientHeight;
        // each row is 1 hour so multiply the duration by the height to get the card height
        return duration * height;
    }

    static getSectionLocationID(day, startTime) {
        let col = "c" + DAY_CODES[day];
        let row = "r" + TIME_CODES[parseInt(startTime)];
        return row + col;
    }
}

class CourseSection {
    constructor(coursesJsonObjectElement) {
        this.class_number = coursesJsonObjectElement["class_number"];
        this.section_number = coursesJsonObjectElement["number"];
        this.type = coursesJsonObjectElement["component"];
        this.instruction_mode = coursesJsonObjectElement["instruction_mode"]["instruction_mode_id"];
        this.meet_start_time = coursesJsonObjectElement["meeting_patterns"][0]["start_time"];
        this.meet_end_time = coursesJsonObjectElement["meeting_patterns"][0]["end_time"];
        this.meet_days = [];
        for(let i = 0; i < coursesJsonObjectElement["meeting_patterns"][0]["days"].length; i++) {
            this.meet_days.push(coursesJsonObjectElement["meeting_patterns"][0]["days"][i]["abbreviation"]);
        }
        this.instructors = coursesJsonObjectElement["instructors"];
    }

    startTimeAsNumber () {
        return this.timeAsNumber(this.meet_start_time);
    }

    endTimeAsNumber () {
        return this.timeAsNumber(this.meet_end_time);
    }

    timeAsNumber (timeString) {
        const sparts = timeString.split(":");
        return (parseInt(sparts[0]) + (parseInt(sparts[1]) / 60));
    }

}

class Course {
    constructor(coursesJsonObject) {
        this.couse_id = coursesJsonObject["course_id"];
        this.catalog_number = coursesJsonObject["catalog_number"];
        this.description = coursesJsonObject["description"];
        this.title = coursesJsonObject["title"];
        this.subject = coursesJsonObject["subject"]["subject_id"];
        this.subject_description = coursesJsonObject["subject"]["description"];
        this.sections = [];
        for (let i = 0; i < coursesJsonObject["sections"].length; i++) {
            this.sections.push(new CourseSection(coursesJsonObject["sections"][i]));
        }
    }
}

document.querySelector('.modal-footer').addEventListener('click', (event) => {
    if (event.target.textContent.toLowerCase() === "submit") {
        let xhr = new XMLHttpRequest();
        const c = UI.getInput("inputCatalog");
        const s = UI.getInput("inputSubject");
        const url = `https://courses.umn.edu/campuses/umntc/terms/1203/courses.json?q=catalog_number=${c},subject_id=${s}`
        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {
                if (myJson["courses"].length === 0) {
                    alert(`no class found for ${s}${c}`);
                } else {
                    console.log(`${myJson["courses"].length} courses found for ${s}${c}`);
                    UI.createCards(new Course(myJson["courses"][0]));
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