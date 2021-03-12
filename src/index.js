
import newTaskExpand from './newTaskExpand';
import newProjectExpand from './newProjectExpand';
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
const example1 = new Task ('Heat pan', 'First thing in the morning', '2021-03-09', 'High', 'Default');
const example2 = new Task ('Make pancakes', '...', '2021-03-09', 'Low', 'Default');
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
                    expandTask(listLowerSecton, projects.projectsList[index].itemList[i]);
                }

            })



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



function expandTask (domItem, listObject) {
    console.log("Expand task");
    console.log(domItem, listObject);
    
    const anchor = domItem;

    const dateDue = listObject.dateDue;
    const dateFormat = `${dateDue[8]}${dateDue[9]}/${dateDue[5]}${dateDue[6]}/${dateDue[2]}${dateDue[3]}`

    let listLowerA = document.createElement("div");
    listLowerA.classList.add("listLower");

    let dueDate = document.createElement("div");
    dueDate.classList.add("dueDate");
    dueDate.innerHTML = `<em>Date: </em>${dateFormat}`

    let priority = document.createElement("div");
    priority.classList.add("priority");
    priority.innerHTML = `<em>Priority: </em>${listObject.priority}`

    listLowerA.appendChild(dueDate);
    listLowerA.appendChild(priority);
    anchor.appendChild(listLowerA);

    ////
    let listLowerB = document.createElement("div");
    listLowerB.classList.add("listLower");

    let notes = document.createElement("div");
    notes.classList.add("notes");
    notes.innerHTML = `${listObject.notes}`

    listLowerB.appendChild(notes);
    anchor.appendChild(listLowerB);

    ////
    let listLowerC = document.createElement("div");
    listLowerC.classList.add("listLower");

    let editButton = document.createElement("div");
    editButton.classList.add("editButton");
    editButton.textContent = "Edit";

    let deleteButton = document.createElement("div");
    deleteButton.classList.add("deleteButton");
    deleteButton.textContent = "Delete";

    listLowerC.appendChild(editButton);
    listLowerC.appendChild(deleteButton);
    anchor.appendChild(listLowerC);


}


function colapseTask (domItem) {
    const anchor = domItem;
    anchor.innerHTML = "";
}

