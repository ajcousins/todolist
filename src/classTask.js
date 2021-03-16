class Task {
  constructor(title, notes, dateDue, priority, projectName, done) {
    this.title = title;
    this.notes = notes;
    this.dateDue = dateDue;
    this.priority = priority;
    this.projectName = projectName;
    this.done = done;
  }

  changeStatus() {
    if (this.done === false) {
      this.done = true;
    } else {
      this.done = false;
    }
  }
}

export default Task;
