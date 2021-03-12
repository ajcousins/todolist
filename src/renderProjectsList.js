function renderProjectsList (projectsList) {

  
    const listArray = projectsList.projectsList;
    const activeProjectIndex = projectsList.activeProjectIndex;

    const anchor = document.querySelector(".projectWrapper");

    anchor.innerHTML = "";

    for (let i = 0; i < listArray.length; i++) {
 
        let labelElement = document.createElement("div");
        labelElement.setAttribute("class", "projectButton");
        labelElement.textContent = listArray[i].projectTitle;
        if (activeProjectIndex === i) {
            labelElement.classList.add("pressed");
        }
        anchor.appendChild(labelElement);
    }
}


export default renderProjectsList