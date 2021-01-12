import * as Course from "./course.js";
import * as Matrix from "./matrix.js";

export class UI {

    static clearInput(id) {
        const e = document.querySelector(`#${id}`).value = '';
    }
    static getInput(id) {
        return document.querySelector(`#${id}`).value;
    }

    static createCards(course, color_class) {
        // let color_index = localStorage.color_index ? parseInt(localStorage.color_index) : 0;
        // const color = Course.CARD_COLORS[((color_index) % Course.CARD_COLORS.length)];
        // const color_class = `card-bg${((color_index) % Course.CARD_COLORS.length) + 1}`;
        // localStorage.setItem("color_index", (color_index + 1));
        //console.log("next color index: " + localStorage.color_index);
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