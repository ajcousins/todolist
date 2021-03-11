
import newTaskExpand from './newTaskExpand';
import renderProjectsList from './renderProjectsList';



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
}
const defaultProject = new Project('Default');
projects.add(defaultProject);
const codingProject = new Project('Coding');
projects.add(codingProject);



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
// Make new filler tasks
const example1 = new Task ('Heat pan', 'First thing in the morning', '21-03-09', 'high', 'Default');
const example2 = new Task ('Make pancakes', '...', '21-03-09', 'low', 'Default');
defaultProject.add(example1);
defaultProject.add(example2);



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
                renderProjectsList(projects);
                projectsListListeners();
                renderTaskList();
                newProjectButton();
            });
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
            let projectInput = document.createElement("div");
            projectInput.classList.add("projectNewButtonPressed");
            anchor.appendChild(projectInput);

            let input = document.createElement("input");
            input.setAttribute("class", "projectInput");
            input.setAttribute("type", "text");
            input.setAttribute("id", "newProject");
            projectInput.appendChild(input);
            input.focus();
            input.addEventListener("keypress", function (e) {
                if (e.key === "Enter") {
                    addToProjectsList (input.value);  
                }
            }) 
            let buttonAdd = document.createElement("div");
            buttonAdd.setAttribute("class", "addButton");
            buttonAdd.setAttribute("id", "projectSubmit");
            buttonAdd.textContent = "Add";
            anchor.appendChild(buttonAdd);
            buttonAdd.addEventListener("click", () => {
                console.log(input.value);
                addToProjectsList(input.value);
            })
        })
        anchor.appendChild(newButton);
    }


    function addToProjectsList (input) {
        //console.log(projects.projectsList.length);
        projects.activeProjectIndex = projects.projectsList.length;
        let value = input;
        let newProject = new Project(value);
        projects.add(newProject);
        renderProjectsList(projects);
        projectsListListeners();
        renderTaskList();
        newProjectButton();
    }

    function renderTaskList() {
        //debugger;
        let anchor = document.querySelector("#content")

        // 1. Clear current renderTaskList.
        anchor.innerHTML = "";
        
        // 2. Check which project is currently active.
        let index = projects.activeProjectIndex;

        // 3. Populate renderTaskList with tasks from current/ active project.
        for (let i = 0; i < projects.projectsList[index].itemList.length; i++) {
            let item =  document.createElement("li");
            item.textContent = projects.projectsList[index].itemList[i].title;
            item.classList.add("listItem");
            anchor.appendChild(item);
        }

        // 4. Add new task button to end of list.
        newTaskButton();
    }

    return {
        addToList: addToList,
        // Add other public functions here.
    }

})();





