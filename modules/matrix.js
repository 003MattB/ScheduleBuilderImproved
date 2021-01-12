function addCourse(course) {
    return null;
}

function removeCourse(course) {
    return null;
}

function createCourseLayer(course) {
    let content = `<div class="card-body"> 
        <div class="top-container">
            <span>
                <h6>${course.subject}${course.catalog_number}</h6>
                <svg id="delete-layer" xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
                  <g id="Group_2" data-name="Group 2" transform="translate(-154 -322)">
                    <circle id="Ellipse_1" data-name="Ellipse 1" cx="10.5" cy="10.5" r="10.5" transform="translate(154 322)" fill="#bf5858"/>
                    <line id="Line_10" data-name="Line 10" x2="10.173" y2="10.173" transform="translate(159.369 327.369)" fill="none" stroke="#f0f0f0" stroke-linecap="round" stroke-width="3"/>
                    <line id="Line_11" data-name="Line 11" x2="10.173" y2="10.173" transform="translate(169.542 327.369) rotate(90)" fill="none" stroke="#f0f0f0" stroke-linecap="round" stroke-width="3"/>
                  </g>
                </svg>

            </span>
        </div>
        <div class="section-container">`;
    let lectures = course.lectureSections();
    for (let i = 0; i < lectures.length; i++) {
        let section = lectures[i];
        content += `<div class="lecture-center">Lecture ${section.section_number}</div>`;
    }
    let labs = course.labSections();
    for (let i = 0; i < labs.length; i ++) {
        let lab = labs[i];
        content += `<div class="discussion-head text-center">Section ${lab.section_number}</div>`
    }
    content += "</div>\n</div>";
    return content;
}

function changeLayerColor(course_subject, course_catalog_number, color_class) {
    let course_des = course_subject + course_catalog_number;
    let container = getLayer(course_des);
    let cl = '';
    for (let i = 0; i < container.children[0].children[0].classList.length; i++) {
        if (container.children[0].children[0].classList[i].startsWith('card-bg')) {
            cl = container.children[0].children[0].classList[i];
        }
    }
    try {
        container.children[0].children[0].classList.remove(cl);
    } catch (e) {}
        container.children[0].children[0].classList.add(color_class);
        for (let i = 0; i < container.children[1].childElementCount; i++) {
            try {
                container.children[1].children[i].classList.remove(cl);
            } catch (e) {}
            container.children[1].children[i].classList.add(color_class);
            //container.children[1].children[i].style.background = color;
        }


}

/**
 * Gets the element from the DOM which resides in the nav section which corresponds to the
 * course defined by course subject and course catalog number
 * @param course = course.subject + course.catalog_number
 * @return {null|Element}
 */
function getLayer(course) {
    let elements = document.getElementsByClassName("card-body");
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].childElementCount > 0 && elements[i].children[0].childElementCount > 0 && elements[i].children[0].children[0].childElementCount > 0) {
            if (elements[i].children[0].children[0].children[0].textContent === course) {
                return elements[i];
            }
        }
    }
    return null;
}

/**
 * Gets the first card from the layer
 * @param course
 * @return {null|Element}
 */
function getLayerHead(course) {
    let layer = getLayer(course);
    if (layer) {
        return layer.children[0];
    }
    return null;
}

/**
 * Gets the section card from the layer
 * @param course
 * @param section {string} - the section number in the format "xxx" ie "001" or "011"
 * @return {null|Element}
 */
function getLayerSection(course, section) {
    let layer = getLayer(course);
    if (layer) {
        for (let i = 0; i < layer.children[1].childElementCount; i++) {
            if (layer.children[1].children[i].textContent.includes(section)) {
                return layer.children[1].children[i];
            }
        }
    }
    return null;
}

function toggleVisibility(layerSection, visible, cardColorClass) {
    if (visible) {
        layerSection.classList.remove('card-bg_muted');
        layerSection.classList.add(cardColorClass);
    } else {
        layerSection.classList.add('card-bg_muted');
        layerSection.classList.remove(cardColorClass);
    }

}

export {createCourseLayer, changeLayerColor, getLayerSection, getLayerHead, getLayer,
toggleVisibility};