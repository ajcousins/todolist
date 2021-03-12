function newTaskExpand(domElement, listItem, index) {

    let anchor;
    let form;

    if (!domElement && !listItem) {
        //// Creating a New Task.
        // Remove newTaskButton
        anchor = document.querySelector("#content");
        let newTaskButton = document.getElementById("newTaskButton");
        anchor.removeChild(newTaskButton);

        // Create and replace with form
        form = document.createElement("li");
        anchor.appendChild(form);
    } else {
        //// Editing an Existing Task.
        anchor = domElement;
        form = domElement;
    }
    form.setAttribute("class", "addNewItemExpand")
    
    let inputa = document.createElement("input");
    inputa.setAttribute("class", "main")
    inputa.setAttribute("type", "text")
    form.appendChild(inputa);

    let labela = document.createElement("label");
    labela.textContent = "Due Date";
    form.appendChild(labela);
    
    let currentDate = new Date();
    currentDate = currentDate.toISOString().slice(0,10)

    let inputb = document.createElement("input");
    inputb.setAttribute("class", "date")
    inputb.setAttribute("type", "date")
    inputb.setAttribute("placeholder", "Date")
    form.appendChild(inputb);

    let labelb = document.createElement("label");
    labelb.textContent = "Priority";
    form.appendChild(labelb);

    let selecta = document.createElement("select");
    selecta.setAttribute("class", "priority");
    form.appendChild(selecta);

    let optiona = document.createElement("option");
    optiona.setAttribute("value", "High");
    optiona.textContent = "High";
    if (listItem && listItem.priority === "High") optiona.setAttribute("selected", "selected");
    selecta.appendChild(optiona);

    let optionb = document.createElement("option");
    optionb.setAttribute("value", "Medium");
    optionb.textContent = "Medium";
    if (listItem && listItem.priority === "Medium") optionb.setAttribute("selected", "selected");
    selecta.appendChild(optionb);

    let optionc = document.createElement("option");
    optionc.setAttribute("value", "Low");
    optionc.textContent = "Low";
    if (listItem && listItem.priority === "Low") optionc.setAttribute("selected", "selected");
    selecta.appendChild(optionc);

    let br = document.createElement("br");
    form.appendChild(br);

    let textArea = document.createElement("textarea");
    textArea.setAttribute("class", "notes");
    textArea.setAttribute("rows", "4");
    textArea.setAttribute("cols", "50");
    textArea.setAttribute("placeholder", "Notes");
    form.appendChild(textArea);

    let buttonAdd = document.createElement("div");
    buttonAdd.setAttribute("class", "addButton");
    form.appendChild(buttonAdd);

    if (listItem) {
        // Updating an existing task.
        inputa.setAttribute("id", `titleInputEdit-${index}`);
        inputa.setAttribute("value", `${listItem.title}`);
        inputb.setAttribute("id", `dateDueEdit-${index}`);
        inputb.setAttribute("value", `${listItem.dateDue}`);
        selecta.setAttribute("id", `priorityEdit-${index}`);
        textArea.setAttribute("id", `notesEdit-${index}`);
        textArea.innerHTML = `${listItem.notes}`;
        buttonAdd.setAttribute("id", `editSubmit-${index}`);
        buttonAdd.textContent = "Update";
        document.getElementById(`titleInputEdit-${index}`).focus();
    } else {
        // Creating a new task.
        inputa.setAttribute("id", "titleInput");
        inputb.setAttribute("id", "dateDue")
        inputb.setAttribute("value", `${currentDate}`);
        selecta.setAttribute("id", "priority");
        textArea.setAttribute("id", "notes");
        buttonAdd.setAttribute("id", "submit");
        buttonAdd.textContent = "Add";
        document.getElementById("titleInput").focus();
    }
}

export default newTaskExpand
