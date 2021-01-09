
export const DAY_CODES = {"m": "1", "t": "2", "w": "3", "th": "4", "f": "5","sa": "6", "su": "7"};
export const TIME_CODES = {8: 1, 9: 2, 10: 3, 11: 4, 12: 5, 13: 6, 14: 7, 15: 8, 16: 9, 17: 10, 18: 11, 19: 12, 20: 13};
export const CARD_COLORS = ["#F78888",
    "#F3D250",
    "#ECECEC",
    "#90CCF4",
    "#9FEDD7"];

export class CourseSection {
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

export class Course {
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
        this.credits = parseInt(coursesJsonObject["credits_maximum"]);
    }

    /**
     * Returns a subset of sections which are lecture sections.
     * @return {[CourseSection]}
     */
    lectureSections() {
        let sections = [];
        for (let i = 0; i < this.sections.length; i++) {
            if (this.sections[i].type === 'LEC') {
                sections.push(this.sections[i]);
            }
        }
        return sections;
    }

    /**
     * Returns the inverse subset of lecture sections. They could be called LAB sections or Discussion sections.
     * @return {[CourseSection]}
     */
    labSections() {
        let sections = [];
        for (let i = 0; i < this.sections.length; i++) {
            if (this.sections[i].type != 'LEC') {
                sections.push(this.sections[i]);
            }
        }
        return sections;
    }
}