function renderProjectsList (projectsList) {

  
    const listArray = projectsList.projectsList;
    const activeProjectIndex = projectsList.activeProjectIndex;

    const anchor = document.querySelector(".projectWrapper");
    // console.log(anchor);
    anchor.innerHTML = "";

    for (let i = 0; i < listArray.length; i++) {
        let label = listArray[i].projectTitle;
        
        let labelElement = document.createElement("div");
        labelElement.setAttribute("class", "projectButton");
        labelElement.textContent = listArray[i].projectTitle;
        if (activeProjectIndex === i) {
            labelElement.classList.add("pressed");
        }




        anchor.appendChild(labelElement);

        
        console.log();
    }

    // Where I left off 10/03/21

}
//renderProjectsList()

export default renderProjectsList