import Task from './classTask';
import newTaskExpand from './newTaskExpand';
import newProjectExpand from './newProjectExpand';
import renderProjectsList from './renderProjectsList';
import expandTask from './expandTask';
import colapseTask from './colapseTask';
import renderDelConfirm from './renderDelConfirm';

// Project list module. ONE list of projects, where each project contains a list of tasks.
const projects = {
  projectsList: [],
  activeProjectIndex: 0,
  add(project) {
    this.projectsList.push(project);
  },
  delete(index) {
    this.projectsList.splice(index, 1);
  },
  activeProjectName() {
    return this.projectsList[this.activeProjectIndex].projectTitle;
  },
};

class Project {
  constructor(projectTitle) {
    this.projectTitle = projectTitle;
    this.itemList = [];
  }

  add(item) {
    this.itemList.push(item);
  }

  delete(index) {
    this.itemList.splice(index, 1);
  }

  update(item, index) {
    this.itemList.splice(index, 1, item);
  }

  markAsDone(index) {
    this.itemList[index].changeStatus();
  }

  sortItemsByDate() {
    this.itemList = this.itemList.sort((a, b) => {
      const tmpA = parseInt(a.dateDue.split('-').join(''));
      const tmpB = parseInt(b.dateDue.split('-').join(''));
      if (tmpA > tmpB) return 1;
      return -1;
    });
  }

  sortItemsByPriority() {
    this.itemList = this.itemList.sort((a, b) => {
      let tmpA;
      let tmpB;
      switch (a.priority) {
        case 'High':
          tmpA = 3;
          break;
        case 'Medium':
          tmpA = 2;
          break;
        default:
          tmpA = 1;
      }
      switch (b.priority) {
        case 'High':
          tmpB = 3;
          break;
        case 'Medium':
          tmpB = 2;
          break;
        default:
          tmpB = 1;
      }
      if (tmpA < tmpB) return 1;
      return -1;
    });
  }
}

// Make new filler projects and tasks.
const defaultProject = new Project('Default');
projects.add(defaultProject);

// Interface Module. Revealing module pattern.
(() => {
  // Functions below executed at first run.
  renderProjectsList(projects);
  projectsListListeners();
  renderTaskList();
  newProjectButton();
  updateProjectListTitle(0);
  getLocalStorage();

  function getLocalStorage() {
    // First run
    if (localStorage.length === 0) {
      // Add to program projects.
      const example1 = new Task(
        'Make pancakes',
        'Mix flour, eggs and milk in a bowl.',
        '2021-03-11',
        'Low',
        'Default',
        false
      );
      const example2 = new Task(
        'Heat pan',
        'First thing in the morning',
        '2021-03-10',
        'High',
        'Default',
        false
      );
      const example3 = new Task(
        'Eat pancakes',
        'Remember lemon and sugar.',
        '2021-03-12',
        'Low',
        'Default',
        false
      );
      defaultProject.add(example1);
      defaultProject.add(example2);
      defaultProject.add(example3);
      // Add to local storage.
      updateLocalStorage();
    } else {
      // Load up contents from local storage.
      for (let i = 0; i < localStorage.length; i += 1) {
        const deSerialised = JSON.parse(localStorage.getItem(`project-${i}`));
        if (i === 0) {
          // Pass default project. Already exists.
        } else {
          const project = new Project(deSerialised.projectTitle);
          projects.add(project);
        }
        for (let j = 0; j < deSerialised.itemList.length; j += 1) {
          const item = new Task(
            deSerialised.itemList[j].title,
            deSerialised.itemList[j].notes,
            deSerialised.itemList[j].dateDue,
            deSerialised.itemList[j].priority,
            deSerialised.itemList[j].projectName,
            deSerialised.itemList[j].done
          );
          projects.projectsList[i].add(item);
        }
        const serialised = JSON.stringify(projects.projectsList[i]);
        localStorage.setItem(`project-${i}`, serialised);
      }
    }
    renderProjectsList(projects);
    projectsListListeners();
    renderTaskList();
    newProjectButton();
    updateProjectListTitle(0);
  }

  function updateLocalStorage() {
    for (let i = 0; i < projects.projectsList.length; i += 1) {
      const serialised = JSON.stringify(projects.projectsList[i]);
      localStorage.setItem(`project-${i}`, serialised);
    }
  }

  function projectsListListeners() {
    let domProjectsList = document.querySelectorAll('.projectButton');
    domProjectsList = Array.from(domProjectsList);
    for (let i = 0; i < domProjectsList.length; i += 1) {
      domProjectsList[i].addEventListener('click', () => {
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
    const upperPanel = document.querySelector('.upperPanel');
    const projectLabel = document.querySelector('.projectLabel');

    if (index === 0) {
      upperPanel.innerHTML = '';
      projectLabel.textContent = 'To Do List';
      upperPanel.appendChild(projectLabel);
      addSortingButtons();
    } else {
      upperPanel.innerHTML = '';
      projectLabel.textContent = projects.projectsList[index].projectTitle;
      upperPanel.appendChild(projectLabel);
      addSortingButtons();

      const deleteButton = document.createElement('div');
      deleteButton.classList.add('projectDeleteButton');
      deleteButton.textContent = 'Delete';
      upperPanel.appendChild(deleteButton);
      deleteButton.addEventListener('click', () => {
        deleteProjectConfirmation();
      });
    }

    function addSortingButtons() {
      const projIndex = projects.activeProjectIndex;
      const sortButtonA = document.createElement('div');
      sortButtonA.classList.add('projectSortButton');
      sortButtonA.textContent = 'Sort by Date';
      upperPanel.appendChild(sortButtonA);
      sortButtonA.addEventListener('click', () => {
        projects.projectsList[projIndex].sortItemsByDate();
        updateLocalStorage();
        renderTaskList();
      });

      const sortButtonB = document.createElement('div');
      sortButtonB.classList.add('projectSortButton');
      sortButtonB.textContent = 'Sort by Priority';
      upperPanel.appendChild(sortButtonB);
      sortButtonB.addEventListener('click', () => {
        projects.projectsList[projIndex].sortItemsByDate();
        projects.projectsList[projIndex].sortItemsByPriority();
        updateLocalStorage();
        renderTaskList();
      });
    }
  }

  function amendList(value, index) {
    let title;
    let notes;
    let dateDue;
    let priority;
    const projectName = projects.activeProjectName();
    let indexSub;
    if (index === undefined) {
      indexSub = '';
    } else {
      indexSub = `Edit-${index}`;
    }

    if (value.type === 'click' || value.key === 'Enter') {
      title = document.querySelector(`#titleInput${indexSub}`).value;
      notes = document.querySelector(`#notes${indexSub}`).value;
      dateDue = document.querySelector(`#dateDue${indexSub}`).value;
      priority = document.querySelector(`#priority${indexSub}`).value;
      if (!title) return;
    }
    const item = new Task(title, notes, dateDue, priority, projectName, false);
    const projectIndex = projects.activeProjectIndex;

    if (index === undefined) {
      projects.projectsList[projectIndex].add(item);
      document.querySelector('#titleInput').value = '';
    } else {
      projects.projectsList[projectIndex].update(item, index);
    }
    updateLocalStorage();
    renderTaskList();
  }

  function editTask(domElement, listItem, index) {
    const anchor = domElement;
    anchor.innerHTML = '';
    newTaskExpand(domElement, listItem, index);

    // Add event listeners.
    const updateButton = document.querySelector(`#editSubmit-${index}`);
    const cancelButton = document.querySelector(`#editCancel-${index}`);
    const titleInput = document.getElementById(`titleInputEdit-${index}`);
    updateButton.addEventListener('click', (e) => {
      amendList(e, index);
    });
    cancelButton.addEventListener('click', () => {
      cancelForm(index);
    });
    titleInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        amendList(e, index);
      }
    });
  }

  function newTaskButton() {
    const anchor = document.querySelector('#content');
    const newButton = document.createElement('li');
    newButton.id = 'newTaskButton';
    newButton.classList.add('addNewItem');
    newButton.textContent = 'Add new task';
    anchor.appendChild(newButton);
    newButton.addEventListener('click', () => {
      newTaskExpand();
      const submit = document.querySelector('#submit');
      const cancel = document.querySelector('#cancel');
      const titleInput = document.querySelector('#titleInput');
      submit.addEventListener('click', (e) => {
        amendList(e);
      });
      cancel.addEventListener('click', () => cancelForm());
      titleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          amendList(e);
        }
      });
    });
  }

  function newProjectButton(value) {
    if (!value) {
      const anchor = document.querySelector('.projectWrapper');
      const newButton = document.createElement('div');
      newButton.id = 'newProjectButton';
      newButton.classList.add('projectNewButton');
      newButton.textContent = 'Add New Project';
      newButton.addEventListener('click', () => {
        anchor.removeChild(newButton);

        const events = newProjectExpand(anchor);
        events.input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            if (!events.input.value) return;
            addToProjectsList(events.input.value);
          }
        });
        events.buttonAdd.addEventListener('click', () => {
          if (!events.input.value) return;
          addToProjectsList(events.input.value);
        });
      });
      anchor.appendChild(newButton);
    }
  }

  function addToProjectsList(input) {
    projects.activeProjectIndex = projects.projectsList.length;
    const value = input;
    const newProject = new Project(value);
    projects.add(newProject);
    const serialised = JSON.stringify(newProject);
    localStorage.setItem(`project-${projects.activeProjectIndex}`, serialised);
    updateProjectListTitle(projects.activeProjectIndex);
    renderProjectsList(projects);
    projectsListListeners();
    renderTaskList();
    newProjectButton();
  }

  function deleteProjectConfirmation() {
    const index = projects.activeProjectIndex;
    // Render confirmation and get objects for event listeners.
    const domObjects = renderDelConfirm(projects, index);

    domObjects.modalBackground.addEventListener('click', () => {
      document.body.removeChild(domObjects.modal);
      document.body.removeChild(domObjects.modalBackground);
    });
    domObjects.okButton.addEventListener('click', () => {
      projects.delete(index);

      localStorage.removeItem(`project-${projects.activeProjectIndex}`);
      // project indexes on local storage need to be reset 0, 1, 2... no gaps.
      for (let i = 0; i < localStorage.length; i += 1) {
        if (localStorage.getItem(`project-${i}`)) {
          localStorage.removeItem(`project-${i}`);
        }
        if (projects.projectsList[i]) {
          const serialised = JSON.stringify(projects.projectsList[i]);
          localStorage.setItem(`project-${i}`, serialised);
        }
      }

      projects.activeProjectIndex = 0;
      updateProjectListTitle(0);
      renderProjectsList(projects);
      document.body.removeChild(domObjects.modal);
      document.body.removeChild(domObjects.modalBackground);
      projectsListListeners();
      renderTaskList();
      newProjectButton();
    });

    domObjects.cancelButton.addEventListener('click', () => {
      document.body.removeChild(domObjects.modal);
      document.body.removeChild(domObjects.modalBackground);
    });
  }

  function renderTaskList() {
    const anchor = document.querySelector('#content');
    anchor.innerHTML = '';
    const index = projects.activeProjectIndex;

    for (let i = 0; i < projects.projectsList[index].itemList.length; i += 1) {
      const item = document.createElement('li');
      item.classList.add('listItem');
      const listUpper = document.createElement('div');
      listUpper.classList.add('listUpper');
      listUpper.id = `list-${i}`;
      listUpper.textContent = projects.projectsList[index].itemList[i].title;
      listUpper.addEventListener('click', (e) => {
        if (e.path[0] === listUpper) {
          projects.projectsList[index].markAsDone(i);
          updateLocalStorage();
          renderTaskList();
        }
      });
      item.appendChild(listUpper);

      if (projects.projectsList[index].itemList[i].done === true) {
        listUpper.classList.add('taskDoneText');
      }

      const pressZone = document.createElement('div');
      pressZone.classList.add('pressZone');

      const triangle = document.createElement('div');
      triangle.classList.add('itemTriangle');
      pressZone.appendChild(triangle);
      listUpper.appendChild(pressZone);

      const listLowerSecton = document.createElement('div');
      listLowerSecton.classList.add('listLowerSecton');
      item.appendChild(listLowerSecton);

      pressZone.addEventListener('click', () => {
        if (triangle.classList.contains('flipped')) {
          triangle.classList.remove('flipped');
          colapseTask(listLowerSecton);
        } else {
          triangle.classList.add('flipped');
          expandTask(
            listLowerSecton,
            projects.projectsList[index].itemList[i],
            i
          );

          // Add event listener for delete button.
          const deleteButton = item.querySelector('.deleteButton');
          deleteButton.addEventListener('click', () => {
            const deleteIndex = deleteButton.id.split('-');
            projects.projectsList[index].delete(deleteIndex[1]);
            updateLocalStorage();
            renderTaskList();
          });

          // Add event listener for edit button.
          const editButton = item.querySelector('.editButton');
          editButton.addEventListener('click', () => {
            editTask(item, projects.projectsList[index].itemList[i], i);
          });
        }
      });
      anchor.appendChild(item);
    }
    newTaskButton();
  }

  function cancelForm() {
    renderTaskList(projects);
  }
})();
