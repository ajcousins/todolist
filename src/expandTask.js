function expandTask(domItem, listObject, listIndex) {
  const anchor = domItem;
  const dateDue = listObject.dateDue;
  const dateFormat = `${dateDue[8]}${dateDue[9]}/${dateDue[5]}${dateDue[6]}/${dateDue[2]}${dateDue[3]}`;

  const listLowerA = document.createElement('div');
  listLowerA.classList.add('listLower');

  const dueDate = document.createElement('div');
  dueDate.classList.add('dueDate');
  dueDate.innerHTML = `<em>Date: </em>${dateFormat}`;

  const priority = document.createElement('div');
  priority.classList.add('priority');
  priority.innerHTML = `<em>Priority: </em>${listObject.priority}`;

  listLowerA.appendChild(dueDate);
  listLowerA.appendChild(priority);
  anchor.appendChild(listLowerA);

  // Middle
  const listLowerB = document.createElement('div');
  listLowerB.classList.add('listLower');

  const notes = document.createElement('div');
  notes.classList.add('notes');
  notes.innerHTML = `${listObject.notes}`;

  listLowerB.appendChild(notes);
  anchor.appendChild(listLowerB);

  // Lower
  const listLowerC = document.createElement('div');
  listLowerC.classList.add('listLower');

  const editButton = document.createElement('div');
  editButton.classList.add('editButton');
  editButton.id = `edit-${listIndex}`;
  editButton.textContent = 'Edit';

  const deleteButton = document.createElement('div');
  deleteButton.classList.add('deleteButton');
  deleteButton.id = `del-${listIndex}`;
  deleteButton.textContent = 'Delete';

  listLowerC.appendChild(editButton);
  listLowerC.appendChild(deleteButton);
  anchor.appendChild(listLowerC);
}
export default expandTask;
