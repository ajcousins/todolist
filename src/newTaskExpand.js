function newTaskExpand() {
    // Remove newTaskButton
    let anchor = document.querySelector("#content");
    let newTaskButton = document.getElementById("newTaskButton");
    anchor.removeChild(newTaskButton);

    // Create and replace with form
    let form = document.createElement("li");
    form.setAttribute("class", "addNewItemExpand")
    anchor.appendChild(form);

    let inputa = document.createElement("input");
    inputa.setAttribute("class", "main")
    inputa.setAttribute("type", "text")
    inputa.setAttribute("id", "titleInput");
    form.appendChild(inputa);

    let labela = document.createElement("label");
    labela.textContent = "Due Date";
    form.appendChild(labela);
    
    let currentDate = new Date();
    currentDate = currentDate.toISOString().slice(0,10)

    let inputb = document.createElement("input");
    inputb.setAttribute("class", "date")
    inputb.setAttribute("type", "date")
    inputb.setAttribute("id", "dateDue")
    inputb.setAttribute("placeholder", "Date")
    inputb.setAttribute("value", `${currentDate}`);
    form.appendChild(inputb);

    let labelb = document.createElement("label");
    labelb.textContent = "Priority";
    form.appendChild(labelb);

    let selecta = document.createElement("select");
    selecta.setAttribute("class", "priority");
    selecta.setAttribute("id", "priority");
    form.appendChild(selecta);

    let optiona = document.createElement("option");
    optiona.setAttribute("value", "high");
    optiona.textContent = "High";
    selecta.appendChild(optiona);

    let optionb = document.createElement("option");
    optionb.setAttribute("value", "medium");
    optionb.textContent = "Medium";
    selecta.appendChild(optionb);

    let optionc = document.createElement("option");
    optionc.setAttribute("value", "low");
    optionc.textContent = "Low";
    selecta.appendChild(optionc);

    let br = document.createElement("br");
    form.appendChild(br);

    let textArea = document.createElement("textarea");
    textArea.setAttribute("class", "notes");
    textArea.setAttribute("id", "notes");
    textArea.setAttribute("rows", "4");
    textArea.setAttribute("cols", "50");
    textArea.setAttribute("placeholder", "Notes");
    form.appendChild(textArea);

    let buttonAdd = document.createElement("div");
    buttonAdd.setAttribute("class", "addButton");
    buttonAdd.setAttribute("id", "submit");
    buttonAdd.textContent = "Add";
    form.appendChild(buttonAdd);

    // submit.addEventListener("click", front.addToList);
    // titleInput.addEventListener("keypress", function (e) {
    //     if (e.key === "Enter") {
    //         front.addToList(e);
    //     }
    // });

    document.getElementById("titleInput").focus();
}

export default newTaskExpand