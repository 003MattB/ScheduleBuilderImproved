export class Term {
    constructor(year, month) {
        this.year = year;
        this.month = month;
        this.semesters = {'3': 'Spring', '5': 'Summer', '9': 'Fall'};
    }

    STERM() {
        return (this.year - 1900).toString() + this.getSemester();
    }

    getPreviousTerm() {
        let nextSemesterMonth = {'3': 10, '5': 1, '9': 7}
        let month = nextSemesterMonth[this.getSemester()];
        if (month == 10) {
            return new Term(this.year - 1, month);
        }
        return new Term(this.year, month);
    }

    getNextTerm() {
        let nextSemesterMonth = {'3': 7, '5': 10, '9': 1}
        let month = nextSemesterMonth[this.getSemester()];
        if (month == 1) {
            return new Term(this.year + 1, month);
        }
        return new Term(this.year, month);
    }

    getSemester() {
        // spring : 3
        // summer : 5
        // fall   : 9

        if (this.month < 6) {
            return '3';  // Spring
        } else if (this.month < 9) {
            return '5';  // Summer
        }
        return '9';  // Fall
    }

    getSemesterString() {
        return this.semesters[this.getSemester()];
    }

    toString() {
        return this.getSemesterString() + " - " + this.year.toString();
    }

}