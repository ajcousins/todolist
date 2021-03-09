console.log("Working");


// Project list module. ONE list of projects, where each project contains a list of tasks.
const projects = {
    projectsList: [],
    activeProjectIndex: 0,
    add: function (project) {
        this.projectsList.push(project);
    },
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


class Task {
    constructor (title, notes, dueDate, priority, projectName) {
        this.title = title;
        this.notes = notes;
        this.dueDate = dueDate;
        this.priority = priority;
        this.projectName = projectName;
        this.done = false;
    }
}
// Make new filler tasks
const example1 = new Task ('Wash dishes', 'Clean all of the dishes', '09/03/21', 'high', 'Default');
const example2 = new Task ('Shower', '...', '09/03/21', 'low', 'Default');
defaultProject.add(example1);
defaultProject.add(example2);



// Interface Module
const interface = {
    init: function() {
        this.cacheDom();
        this.display();
        
    },
    cacheDom: function() {
        //this.submitButton = document.querySelector("#submit");
        submit.addEventListener("click", this.submitB);
    },
    submitB: function() {
        this.item = document.querySelector("#item").value;
        let item = new Task (this.item, "", "", "", "");
        defaultProject.add(item);
        document.querySelector("#item").value = "";
        console.log(defaultProject);
        interface.display();
    },
    display: function() {
        //debugger;
        let anchor = document.querySelector("#content")

        console.log("Display Function called");
        // 1. Clear current display.
        anchor.textContent = "";
        
        // 2. Check which project is currently active.
        let index = projects.activeProjectIndex;

        // 3. Populate display with tasks from current/ active project.
        
        for (let i = 0; i < projects.projectsList[index].itemList.length; i++) {
            console.log(projects.projectsList[index].itemList[i]);
            
            
            
            let item =  document.createElement("li");
            item.textContent = projects.projectsList[index].itemList[i].title;
            anchor.appendChild(item);
            
            
        }


    }


}
interface.init();


