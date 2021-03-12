import newTaskExpand from './newTaskExpand';
import newProjectExpand from './newProjectExpand';
import renderProjectsList from './renderProjectsList';
import expandTask from './expandTask';
import colapseTask from './colapseTask';



// Project list module. ONE list of projects, where each project contains a list of tasks.
const projects = {
    projectsList: [],
    activeProjectIndex: 0,
    add: function (project) {
        this.projectsList.push(project);
    },
    activeProjectName: function () {
        return this.projectsList[this.activeProjectIndex].projectTitle;
    }
}


class Project {
    constructor (projectTitle) {
        this.projectTitle = projectTitle;
        this.itemList = [];
    }

    add (item) {
        this.itemList.push(item);
    }

    delete (index) {
        this.itemList.splice(index, 1);
    }

    update(item, index) {
        console.log("update");
        this.itemList.splice(index, 1, item)


    }

}



class Task {
    constructor (title, notes, dateDue, priority, projectName) {
        this.title = title;
        this.notes = notes;
        this.dateDue = dateDue;
        this.priority = priority;
        this.projectName = projectName;
        this.done = false;
    }
}
// Make new filler projects and tasks.
const defaultProject = new Project('Default');
const musicProject = new Project('Music Project');
const example1 = new Task ('Heat pan', 'First thing in the morning', '2021-03-09', 'High', 'Default');
const example2 = new Task ('Make pancakes', '...', '2021-03-09', 'Low', 'Default');
const example3 = new Task ('Eat pancakes', '...', '2021-03-09', 'Low', 'Default');
const example4 = new Task ('Play concert', 'Before bed.', '2021-03-19', 'High', 'Music Project');
const example5 = new Task ('Smash guitar', '...', '2021-03-19', 'High', 'Music Project');
projects.add(defaultProject);
projects.add(musicProject);
defaultProject.add(example1);
defaultProject.add(example2);
defaultProject.add(example3);
musicProject.add(example4);
musicProject.add(example5);


// Interface Module. Revealing module pattern.
const front = (function () {

    renderProjectsList(projects);
    projectsListListeners();
    renderTaskList();
    newProjectButton();

    function projectsListListeners() {
        let domProjectsList = document.querySelectorAll(".projectButton");
        domProjectsList = Array.from(domProjectsList);
        for (let i = 0; i < domProjectsList.length; i++) {
            domProjectsList[i].addEventListener("click", () => {
                projects.activeProjectIndex = i;
                updateProjectListTitle(i);
                renderProjectsList(projects);
                projectsListListeners();
                renderTaskList();
                newProjectButton();
            });
        }
    }

    function updateProjectListTitle(index) {
        let projectLabel = document.querySelector(".projectLabel");
        if (!index) {
            projectLabel.innerHTML = "To Do List"
        } else {
            projectLabel.innerHTML = projects.projectsList[index].projectTitle;
        }
    }

    function addToList(value) {
        let title;
        let notes;
        let dateDue;
        let priority;
        let projectName = projects.activeProjectName();
        if (value.type === "click" || value.key === "Enter") {
            title = document.querySelector("#titleInput").value;
            notes = document.querySelector("#notes").value;
            dateDue = document.querySelector("#dateDue").value;
            priority = document.querySelector("#priority").value;
            if (!title) return;
        } else {
            title = value
        }
        let item = new Task (title, notes, dateDue, priority, projectName);
        let index = projects.activeProjectIndex;
        projects.projectsList[index].add(item);
        document.querySelector("#titleInput").value = "";
        renderTaskList();
    }

    function newTaskButton() {
        let anchor = document.querySelector("#content");
        let newButton = document.createElement("li");
        newButton.id = "newTaskButton";
        newButton.classList.add("addNewItem");
        newButton.textContent = "Add new task";
        anchor.appendChild(newButton);
        newButton.addEventListener("click", () => {
            newTaskExpand();
            submit.addEventListener("click", addToList);
            titleInput.addEventListener("keypress", function (e) {
                if (e.key === "Enter") {
                    addToList(e);
                }
            });
        })
    }

    function newProjectButton() {
        let anchor = document.querySelector(".projectWrapper");
        let newButton = document.createElement("div");
        newButton.id = "newProjectButton";
        newButton.classList.add("projectNewButton");
        newButton.textContent = "Add New Project";
        newButton.addEventListener("click", () => {
            anchor.removeChild(newButton);
            
            let events = newProjectExpand(anchor);
            events.input.addEventListener("keypress", function (e) {
                if (e.key === "Enter") {
                    if (!events.input.value) return;
                    addToProjectsList (events.input.value);  
                }
            }) 
            events.buttonAdd.addEventListener("click", () => {
                if (!events.input.value) return;
                addToProjectsList(events.input.value);
            })
        })
        anchor.appendChild(newButton);
    }


    function addToProjectsList (input) {
        projects.activeProjectIndex = projects.projectsList.length;
        let value = input;
        let newProject = new Project(value);
        projects.add(newProject);
        updateProjectListTitle(projects.activeProjectIndex)
        renderProjectsList(projects);
        projectsListListeners();
        renderTaskList();
        newProjectButton();
    }

    function renderTaskList() {
        //debugger;
        let anchor = document.querySelector("#content")
        //let expandedList = [];

        // 1. Clear current renderTaskList.
        anchor.innerHTML = "";
        
        // 2. Check which project is currently active.
        let index = projects.activeProjectIndex;

        // 3. Populate renderTaskList with tasks from current/ active project.
        for (let i = 0; i < projects.projectsList[index].itemList.length; i++) {
            let item =  document.createElement("li");
            item.classList.add("listItem");

            let listUpper = document.createElement("div");
            listUpper.classList.add("listUpper");
            listUpper.textContent = projects.projectsList[index].itemList[i].title;
            item.appendChild(listUpper);

            let pressZone = document.createElement("div");
            pressZone.classList.add("pressZone");

            let triangle = document.createElement("div");
            triangle.classList.add("itemTriangle");
            pressZone.appendChild(triangle);
            listUpper.appendChild(pressZone);

            let listLowerSecton = document.createElement("div");
            listLowerSecton.classList.add("listLowerSecton");
            item.appendChild(listLowerSecton);

            pressZone.addEventListener("click", ()=> {
                if (triangle.classList.contains("flipped")) {
                    triangle.classList.remove("flipped");
                    colapseTask(listLowerSecton);
                } else {
                    triangle.classList.add("flipped");
                    expandTask(listLowerSecton, projects.projectsList[index].itemList[i], i);
                    
                    // Add event listener for delete button.
                    let deleteButton = item.querySelector(".deleteButton");
                    deleteButton.addEventListener("click", () => {
                        let deleteIndex = deleteButton.id.split("-");
                        projects.projectsList[index].delete(deleteIndex[1]);
                        renderTaskList();
                    })

                    // Add event listener for edit button.
                    let editButton = item.querySelector(".editButton");
                    editButton.addEventListener("click", () => {
                        let editIndex = editButton.id.split("-");
                        editTask(item, projects.projectsList[index].itemList[i], i);
                    })
                }
            })
            anchor.appendChild(item);
        }
        // 4. Add new task button to end of list.
        newTaskButton();
    }

    return {
        addToList: addToList,
        renderTaskList: renderTaskList,
        // Add other public functions here.
    }

})();




function editTask(domElement, listItem, index) {
    const anchor = domElement;
    anchor.innerHTML = "";

    newTaskExpand(domElement, listItem, index);

    // Add event listeners here.
    let updateButton = document.querySelector(`#editSubmit-${index}`)
    let titleInput = document.getElementById(`titleInputEdit-${index}`)
    updateButton.addEventListener("click", (e) => {
        editToList(e, index);
    })
    titleInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            editToList(e, index);
        }
    });
}


function editToList(value, index) {
    let title;
    let notes;
    let dateDue;
    let priority;
    let projectName = projects.activeProjectName();
    if (value.type === "click" || value.key === "Enter") {
        title = document.querySelector(`#titleInputEdit-${index}`).value;
        notes = document.querySelector(`#notesEdit-${index}`).value;
        dateDue = document.querySelector(`#dateDueEdit-${index}`).value;
        priority = document.querySelector(`#priorityEdit-${index}`).value;
        if (!title) return;
    } 
 
    let item = new Task (title, notes, dateDue, priority, projectName);
    console.log(item);
    
    let projectIndex = projects.activeProjectIndex;
    projects.projectsList[projectIndex].update(item, index);

    front.renderTaskList();
}
