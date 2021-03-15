function expandTask (domItem, listObject, listIndex) {
    
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
    editButton.id = `edit-${listIndex}`;
    editButton.textContent = "Edit";

    let deleteButton = document.createElement("div");
    deleteButton.classList.add("deleteButton");
    deleteButton.id = `del-${listIndex}`;
    deleteButton.textContent = "Delete";

    listLowerC.appendChild(editButton);
    listLowerC.appendChild(deleteButton);
    anchor.appendChild(listLowerC);
}
export default expandTask