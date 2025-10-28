// --- Global Data and Setup ---

let name = "Kacy Souvanna";
let downloadCount = 0;
let skillsArray = ["C", "Python", "Linux", "Git", "VS Code", "Teamwork", "Problem-Solving"];

const projects = [
    {
        title: "Personal Website",
        description: "A personal website with small animations and design. Built with HTML, CSS, and Bootstrap.",
        deadline: new Date("2024-06-01"),
        imageSrc: "personal-website.jpg",
        imageAlt: "Personal Website Welcome Page"
    },
    {
        title: "Local Home Server",
        description: "A fun project to host media with Jellyfin, accessible to my local network.",
        deadline: new Date("2024-08-15"),
        imageSrc: "jellyfin.1280x720.png",
        imageAlt: "Local Home Server Jellyfin Interface"
    },
    {
        title: "Ongoing Project: AI Chatbot",
        description: "Developing an AI chatbot for educational purposes.",
        deadline: new Date("2025-11-30"),
        imageSrc: null, 
        imageAlt: null
    }
];
const originalProjectsOrder = [...projects];

const navItems = [
    { text: "Summary", target: "#summary" },
    { text: "Skills", target: "#skills" },
    { text: "Projects", target: "#projects" },
    { text: "Education", target: "#education" },
    { text: "Experience", target: "#experience" },
    { text: "Contact Information", target: "#contact" }
];

const educationData = [
    { institution: "Northern Arizona University", major: "Computer Science", duration: "2024 - 2028" }
];

const experienceData = [
    { company: "Little Caesars", position: "Crew Member - Making pizza, handling the oven, taking orders, cleaning", duration: "June 2023 - Dec 2023" }
];

// --- Helper Functions ---

function renderSkills(animation = 'none') {
    const $list = $('#dynamic-skills-list').empty();

    skillsArray.forEach((skill, index) => {
        const $li = $(`<li class="list-group-item d-flex justify-content-between align-items-center" data-index="${index}">
            <span class="skill-text">${skill}</span>
            <button class="btn btn-sm btn-danger delete-skill-btn">Delete</button>
        </li>`);

        if (animation === 'slideDown') {
            // Step 1: Add smooth animations for adding skills
            $li.hide().appendTo($list).slideDown(400);
        } else {
            $li.appendTo($list);
        }
    });
}

function createProjectCard(project) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let statusText = '';
    let statusClass = '';

    if (project.deadline > today) {
        statusText = 'Ongoing';
        statusClass = 'text-primary';
    } else if (project.deadline < today) {
        statusText = 'Completed';
        statusClass = 'text-success';
    } else {
        statusText = 'Due Today!';
        statusClass = 'text-warning';
    }

    const deadlineString = project.deadline.toLocaleDateString();

    return `
        <div class="col-md-6 mb-3 project-card">
            <div class="card h-100 shadow">
                ${project.imageSrc ? `<img src="${project.imageSrc}" alt="${project.imageAlt}" class="card-img-top">` : ''}
                <div class="card-body">
                    <h4 class="card-title">${project.title}</h4>
                    <p>${project.description}</p>
                    <p>
                        <small class="${statusClass} fw-bold">Status: ${statusText}</small>
                        <br>
                        <small class="text-muted">Deadline: ${deadlineString}</small>
                    </p>
                </div>
            </div>
        </div>
    `;
}

function renderProjects(projectList) {
    const $container = $('#projects-grid-container').empty();
    
    projectList.forEach(project => {
        $container.append(createProjectCard(project));
    });
}

function generateTable(data, tableBodyId, keys) {
    const tableBody = document.getElementById(tableBodyId);
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        keys.forEach(key => {
            const cell = document.createElement('td');
            cell.textContent = item[key];
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
}


// --- DOM Ready / Main Execution ---

$(document).ready(function() {

    $('#greeting').text(`Hello, my name is ${name}! Welcome to my portfolio!`);

    generateTable(educationData, 'education-table-body', ['institution', 'major', 'duration']);
    generateTable(experienceData, 'experience-table-body', ['company', 'position', 'duration']);
    
    renderSkills();
    renderProjects(projects);
    
    $('#download-count-display').text(`Downloaded: ${downloadCount} time(s)`);


    // Step 2: Dynamically Rendering the Navigation Menu
    const $navList = $('#dynamic-nav-list');
    
    $.each(navItems, function(index, item) {
        const $li = $(`<li class="nav-item"><a class="nav-link" href="${item.target}">${item.text}</a></li>`);
        $li.find('a').on('click', function(e) {
            e.preventDefault();
            const target = $(this).attr('href');
            // Step 2: Smooth scrolling using jQuery's animate()
            $('html, body').animate({
                scrollTop: $(target).offset().top - $('header').outerHeight()
            }, 800);
        });
        $navList.prepend($li);
    });
    

    // Step 1: Dynamic Skills Form with Validation and Array Management
    $('#add-skill-form').on('submit', function(e) {
        e.preventDefault();
        const newSkill = $('#new-skill-input').val().trim();

        if (!newSkill) {
            alert("Please enter a skill.");
            return;
        }

        // Step 1: Use higher-order functions (Array.map, Array.includes) for validation
        if (skillsArray.map(s => s.toLowerCase()).includes(newSkill.toLowerCase())) {
            alert(`Skill "${newSkill}" already exists!`);
            return;
        }

        skillsArray.push(newSkill);
        // Step 1: Add new skill and display with .slideDown() animation
        renderSkills('slideDown');
        $('#new-skill-input').val('');
        alert(`Skill "${newSkill}" added successfully!`);
    });

    // Step 1: Remove Skill
    $('#dynamic-skills-list').on('click', '.delete-skill-btn', function() {
        const $li = $(this).closest('li');
        const skillText = $li.find('.skill-text').text();

        // Step 1: Use jQuery .slideUp() animation for removal
        $li.slideUp(400, function() {
            // Step 1: Use callbacks to update the array
            const skillIndex = parseInt($li.data('index'));
            skillsArray.splice(skillIndex, 1);
            
            renderSkills(); 
            alert(`Skill "${skillText}" removed.`);
        });
    });

    // Step 1: Edit Skill
    $('#dynamic-skills-list').on('click', '.skill-text', function() {
        const $span = $(this);
        const oldSkill = $span.text();
        const $li = $span.closest('li');
        const skillIndex = parseInt($li.data('index'));
        
        const $input = $(`<input type="text" class="form-control form-control-sm edit-input" value="${oldSkill}">`);
        $span.replaceWith($input);
        $input.focus();

        $input.on('blur keydown', function(e) {
            if (e.type === 'keydown' && e.which !== 13) return;

            const newSkill = $(this).val().trim();
            $(this).replaceWith($span);

            if (newSkill && newSkill !== oldSkill) {
                // Step 1: Update array using callbacks
                skillsArray[skillIndex] = newSkill;
                $span.text(newSkill);
                alert(`Skill updated to "${newSkill}"`);
            } else {
                $span.text(oldSkill);
            }
        });
    });


    // Step 3: Projects Section with Sorting by Deadline
    $('#sort-projects').on('change', function() {
        const sortType = $(this).val();
        let sortedProjects = [...projects];

        if (sortType === 'earliest') {
            // Step 3: Comparator function (Array.sort()) for earliest to latest
            sortedProjects.sort((a, b) => a.deadline - b.deadline);
        } else if (sortType === 'latest') {
            // Step 3: Comparator function (Array.sort()) for latest to earliest
            sortedProjects.sort((a, b) => b.deadline - a.deadline);
        } else {
            sortedProjects = originalProjectsOrder;
        }

        // Step 3: Dynamically reflect sorted order with a fade animation
        $('#projects-grid-container').fadeOut(400, function() {
            renderProjects(sortedProjects);
            $(this).fadeIn(400);
        });
    });


    // Step 4: Keyboard Event Listener with Custom Actions
    $('#new-skill-input').on('keydown', function(e) {
        
        // Step 4: When user presses "Enter" (Key code 13), submit the form
        if (e.which === 13) {
            e.preventDefault();
            // Step 4: Use callback function to execute action
            $('#add-skill-form').trigger('submit');
        } 
        
        // Step 4: When user presses "Escape" (Key code 27), clear input fields
        if (e.which === 27) {
            e.preventDefault();
            // Step 4: Use jQuery to clear the input
            $('#new-skill-input').val('');
        }
    });

    // Download Tracker (reusing from previous HW, adapted for jQuery)
    $('#download-resume-btn').on('click', function() {
        downloadCount++; 
        $('#download-count-display').text(`Downloaded: ${downloadCount} time(s)`);
    });
});
