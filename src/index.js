
import newTaskExpand from './newTaskExpand';
import renderProjectsList from './renderProjectsList';

console.log("Working");


// Project list module. ONE list of projects, where each project contains a list of tasks.
const projects = {
    projectsList: [],
    activeProjectIndex: 0,
    add: function (project) {
        this.projectsList.push(project);
    },
    activeProjectName: function () {
        return this.projectsList[0].projectTitle;
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

console.log(projects.projectsList);
console.log(projects.activeProjectName());


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
const example1 = new Task ('Wash dishes', 'Clean all of the dishes', '21-03-09', 'high', 'Default');
const example2 = new Task ('Shower', '...', '21-03-09', 'low', 'Default');
defaultProject.add(example1);
defaultProject.add(example2);



// Interface Module. Revealing module pattern.
const front = (function () {

    cacheDom();
    display();
    renderProjectsList(projects.projectsList);

    function cacheDom() {
        
    }

    function addToList(value) {
        let title;
        let notes;
        let dateDue;
        let priority;
        let projectName = projects.activeProjectName();
        //let projectName = projects.activeProjectName;
        //console.log(projectName);
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
        defaultProject.add(item);
        document.querySelector("#titleInput").value = "";
        console.log(projects.projectsList);
        display();
        
    }

    function newTaskButton() {
        let anchor = document.querySelector("#content");
        let newButton = document.createElement("li");
        newButton.id = "newTaskButton";
        newButton.classList.add("addNewItem");
        newButton.textContent = "Add new task";
        newButton.addEventListener("click", () => {
            newTaskExpand();
            submit.addEventListener("click", addToList);
            titleInput.addEventListener("keypress", function (e) {
                if (e.key === "Enter") {
                    addToList(e);
                }
            });
        })
        anchor.appendChild(newButton);
        
    }



    function display() {
        //debugger;
        let anchor = document.querySelector("#content")

        // console.log("Display Function called");
        // 1. Clear current display.
        anchor.innerHTML = "";
        
        // 2. Check which project is currently active.
        let index = projects.activeProjectIndex;

        // 3. Populate display with tasks from current/ active project.
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





