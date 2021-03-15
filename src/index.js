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
    delete: function (index) {
        this.projectsList.splice(index, 1);
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
        this.itemList.splice(index, 1, item)
    }

    markAsDone (index) {
        this.itemList[index].changeStatus();
    }

    sortItemsByDate () {
        this.itemList = this.itemList.sort((a, b) => {
            let tmpA = parseInt(a.dateDue.split("-").join(""));
            let tmpB = parseInt(b.dateDue.split("-").join(""));
            if (tmpA > tmpB) return 1;
            else return -1;
        })
    }

    sortItemsByPriority () {
        this.itemList = this.itemList.sort((a, b) => {
            let tmpA;
            let tmpB;
            switch(a.priority) {
                case "High":
                    tmpA = 3;
                    break;
                case "Medium":
                    tmpA = 2;
                    break;
                case "Low":
                    tmpA = 1;
                    break;
            }
            switch(b.priority) {
                case "High":
                    tmpB = 3;
                    break;
                case "Medium":
                    tmpB = 2;
                    break;
                case "Low":
                    tmpB = 1;
                    break;
            }
            if (tmpA < tmpB) return 1;
            else return -1;
        })
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

    changeStatus () {
        if (this.done === false) {
            this.done = true;
        } else {
            this.done = false;
        }
    }

}
// Make new filler projects and tasks.
const defaultProject = new Project('Default');
const musicProject = new Project('Music Project');
const example1 = new Task ('Make pancakes', '...', '2021-03-11', 'Low', 'Default');
const example2 = new Task ('Heat pan', 'First thing in the morning', '2021-03-10', 'High', 'Default');
const example3 = new Task ('Eat pancakes', '...', '2021-03-12', 'Low', 'Default');
const example4 = new Task ('Play concert', 'Before bed.', '2021-03-19', 'High', 'Music Project');
const example5 = new Task ('Tune guitar', '...', '2021-03-15', 'Medium', 'Music Project');
const example6 = new Task ('Practise music', '...', '2021-03-18', 'Low', 'Music Project');
projects.add(defaultProject);
projects.add(musicProject);
defaultProject.add(example1);
defaultProject.add(example2);
defaultProject.add(example3);
musicProject.add(example4);
musicProject.add(example5);
musicProject.add(example6);


// Interface Module. Revealing module pattern.
const front = (function () {

    renderProjectsList(projects);
    projectsListListeners();
    renderTaskList();
    newProjectButton();
    updateProjectListTitle(0);

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
        let upperPanel = document.querySelector(".upperPanel");
        let projectLabel = document.querySelector(".projectLabel");

        if (index === 0) {
            upperPanel.innerHTML = "";
            projectLabel.textContent = "To Do List";
            upperPanel.appendChild(projectLabel);
            addSortingButtons ()
        } else {
            upperPanel.innerHTML = "";
            projectLabel.textContent = projects.projectsList[index].projectTitle;
            upperPanel.appendChild(projectLabel);
            addSortingButtons ()

            let deleteButton = document.createElement("div");
            deleteButton.classList.add("projectDeleteButton");
            deleteButton.textContent = "Delete";
            upperPanel.appendChild(deleteButton);
            deleteButton.addEventListener("click", () => {
                deleteProjectConfirmation();
            })


        }

        function addSortingButtons () {
            let projIndex = projects.activeProjectIndex
            let sortButtonA = document.createElement("div");
            sortButtonA.classList.add("projectSortButton");
            sortButtonA.textContent = "Sort by Date";
            upperPanel.appendChild(sortButtonA);
            sortButtonA.addEventListener("click", () => {
                projects.projectsList[projIndex].sortItemsByDate();
                renderTaskList();
            })

            let sortButtonB = document.createElement("div");
            sortButtonB.classList.add("projectSortButton");
            sortButtonB.textContent = "Sort by Priority";
            upperPanel.appendChild(sortButtonB);
            sortButtonB.addEventListener("click", () => {
                projects.projectsList[projIndex].sortItemsByDate();
                projects.projectsList[projIndex].sortItemsByPriority();
                renderTaskList();
            })
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
            cancel.addEventListener("click", () => cancelForm());
            titleInput.addEventListener("keypress", function (e) {
                if (e.key === "Enter") {
                    addToList(e);
                }
            });
        })
    }

    function newProjectButton(value) {
        if (!value) {
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
            listUpper.id = `list-${i}`
            listUpper.textContent = projects.projectsList[index].itemList[i].title;
            listUpper.addEventListener("click", (e) => {
                if (e.path[0] === listUpper) {
                    projects.projectsList[index].markAsDone(i);
                    renderTaskList()
                }
            })
            item.appendChild(listUpper);

            if (projects.projectsList[index].itemList[i].done === true) {
                listUpper.classList.add("taskDoneText");
            }
            

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
        projectsListListeners: projectsListListeners,
        updateProjectListTitle: updateProjectListTitle,
        renderProjectsList: renderProjectsList,
        newProjectButton: newProjectButton,
        // Add other public functions here.
    }

})();




function editTask(domElement, listItem, index) {
    const anchor = domElement;
    anchor.innerHTML = "";

    newTaskExpand(domElement, listItem, index);

    // Add event listeners here.
    let updateButton = document.querySelector(`#editSubmit-${index}`)
    let cancelButton = document.querySelector(`#editCancel-${index}`)
    let titleInput = document.getElementById(`titleInputEdit-${index}`)
    updateButton.addEventListener("click", (e) => {
        editToList(e, index);
    })
    cancelButton.addEventListener("click", () => {
        cancelForm(index);
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
    
    let projectIndex = projects.activeProjectIndex;
    projects.projectsList[projectIndex].update(item, index);

    front.renderTaskList();
}


function deleteProjectConfirmation() {

    let index = projects.activeProjectIndex;
    let projectTitle = projects.projectsList[index].projectTitle;


    let modalBackground = document.createElement("div");
    modalBackground.classList.add("modalBackground");
    document.body.appendChild(modalBackground);
    

    let modal = document.createElement("div");
    modal.classList.add("modal");
    let textBox = document.createElement("div");
    textBox.innerHTML = `Are you sure you want to delete ${projectTitle}?<br>
    All tasks in this project will be deleted permanently.`
    textBox.classList.add("textBox");
    modal.appendChild(textBox);
    
    let okButton = document.createElement("div");
    okButton.classList.add("projectButton");
    okButton.classList.add("modalButtons");
    okButton.classList.add("ok");
    okButton.textContent = "OK";
    textBox.appendChild(okButton);

    let cancelButton = document.createElement("div");
    cancelButton.classList.add("projectButton");
    cancelButton.classList.add("modalButtons");
    cancelButton.textContent = "Cancel";
    textBox.appendChild(cancelButton);

    document.body.appendChild(modal);


    modalBackground.addEventListener("click", () => {
        document.body.removeChild(modal);
        document.body.removeChild(modalBackground);
    })

    okButton.addEventListener("click", () => {
        projects.delete(index);
        projects.activeProjectIndex = 0;
    
        front.updateProjectListTitle(0);
        renderProjectsList(projects);

        document.body.removeChild(modal);
        document.body.removeChild(modalBackground);
        
        front.projectsListListeners();
        front.renderTaskList();
        front.newProjectButton();

    })

    cancelButton.addEventListener("click", () => {
        document.body.removeChild(modal);
        document.body.removeChild(modalBackground);
    })
}


function cancelForm(index) {
    if (index === undefined) {
        front.renderTaskList(projects);
    } else {
        front.renderTaskList(projects);
    }
}