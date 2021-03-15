function renderDelConfirm (projects, index) {

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

    return {index, modalBackground, modal, okButton, cancelButton}
}
export default renderDelConfirm