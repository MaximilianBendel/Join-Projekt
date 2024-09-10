function loadTaskHTML(i, title, description, category, subtaskCount, subtaskCountDone, subtaskDoneInPercent, priority) {
    const { width: categoryWidth, height: categoryHeight } = getCategorySize(category);
    const { width: priorityWidth, height: priorityHeight } = getPrioritySize(priority);
    return `
      <div onclick="openTaskDialog(${i})" draggable="true" ondragstart="startDragging(${i})" class="card">
          <img class="categorySmallTask" src="./assets/img/${category}" alt="" style="width: ${categoryWidth}; height: ${categoryHeight};">
          <h3>${title}</h3>
          <p class="openTaskParagraph">${description}</p>
          <div id="subtasks${i}">
          <div id="progressbar">
              <div style="width:${subtaskDoneInPercent}%"></div>
          </div>
          <div class="subtaskText">${subtaskCountDone}/${subtaskCount} Subtasks</div>
          </div>
          <div class="ContactsAndPriorityContainer">
              <div class="authorityIcon" id="authorityIcon${i}"></div> 
              <img class="priorityImgOnBigTask" src="./assets/img/${priority}Priority.png" alt="" style="width: ${priorityWidth}; height: ${priorityHeight};">
          </div>
      </div>
    `;
  }

function loadAuthorityHTML(name, lastNameInitial,color) {
    return `
    <div class="authorityImageContainer" style="background-color: ${color};">
    <span class="initials1">${name.charAt(0)}</span>
    <span class="initials2">${lastNameInitial}</span>
    </div>
    `;
  }

function loadTaskDialogHTML(title, description, date, category, priority, i) {
    return `
  <div class="categoryandexitbuttoncontainer">
  <img class="categoryOnBigTask" src="./assets/img/${category}" alt="">
  <img class="exitButtonBigTask" onclick="closeTask()" src="./assets/img/crossIcon.png" alt="">
  </div>
  
  <h2 class="titleOnBigTask">${title}</h2>
  <p class="paragraphOnBigTask">${description}</p>
   
      <div class="dateBigTaskContainer">
      <span class="spanDateBigTask">Due date:</span>
      <span>${date}</span>
      </div>
  
      <div class="priorityBigTaskContainer">
      <span class="spanBigTaskPriorityText">Priority:</span>
      <span class="priorityBigTaskSmallContainer">${priority} <img class="priorityImgOnBigTask" src="./assets/img/${priority}Priority.png" alt=""></span>
       </div>
       
      <div class="contactBigTaskContainer">
      <span class="spanTextBigTask">Assigned To:</span>
      <div class="contactsBigTask" id="contactAtBigTask"> 
          
      </div>
      </div>
   
   
      <div class="subtaskBigTaskContainer">
      <span class="subtaskTextBigTask">Subtask:</span>
      <div class="subtaskcontactsContainer" id="loadSubtasksOnBigTask"></div>
      </div> 
   
  <div class="buttonsBigTaskContainer">
  <span class="buttonsGapBigTask" onclick="deleteTask(${i})"><img class="iconDeleteBigTask" src="./assets/img/deleteIcon.png" alt="">Delete</span> 
  <span class="buttonsGapBigTask" onclick="editTask(${i})"><img class="iconEditBigTask" src="./assets/img/editIcon.png" alt="">Edit</span>
  <div>
  `;
  }

function loadContactOnBigTaskHTML(contact, lastNameInitial,color) {
    return `
      <div class="verticalCenter">
      <div class="image_container" style="background-color: ${color};">
      <span class="initials1">${contact.charAt(0)}</span>
      <span class="initials2">${lastNameInitial}</span>
      </div>
      <div>${contact}</div>
      </div>
      `;
  }

function loadEditTaskHTML(i, title, description, date) {
    return `
    <div class="editContainer">
    <div class="closeEditTask"><img class="exitButtonBigTask" onclick="closeTask()" src="./assets/img/crossIcon.png" alt=""></div>
    <form onsubmit="changeTask(${i}); return false">
      <label for="title">Title<span class="colorRed">*</span></label>
        <div class="fake-input">
          <input required id="title" type="text" value="${title}" placeholder="Enter a Title">
        </div>
      <label for="description">Description</label>
        <div class="fake-textarea">
            <textarea id="description" class="textarea" placeholder="Enter a description">${description}</textarea>
        </div>
        <label for="date">date<span class="colorRed">*</span></label>
           <div class="fake-input">
            <input required id="date" value="${date}" type="date">
            </div>
  
            <label for="priority">Priority</label>
            <div id="priority" class="distanceBetweenIput"></div>
  
            <label for="assignContact">Assign to</label>
            <div class="fake-input">
                <input id="assignContact" oninput="showContacts()" placeholder="Select contacts to assign" type="text">
               <div id="contactSection" class="flexbox">  <img onclick="removeAddContactSection()" class="taskIcon" src="./assets/img/extensionIcon.png" alt=""></div>
            </div>
            
            <div id="addContact">
  
            </div>
            
            <div id="addContactIcon">
  
            </div> 
  
            <label for="subtask">Subtasks</label>
                              <div class="fake-input">
                                  <input id="subtask" placeholder="Add new subtask">
                                  <img onclick="addSubTask()" class="taskIcon" src="./assets/img/addSubTask.png" />
                              </div>
                              <div id="addSubTask">
  
                              </div>
  
            
               <button type="submit" class="createButtonEdit">OK</button> 
  </form> 
  </div>
    `;
  }

  function loadPriorityUrgentHTML() {
    return `
    <div class="distanceBetweenIput row">
                              <button type="button" onclick="changePrioToUrgent()" class="urgentPriority prioButton">
                                  <span>Urgent</span>
                                  <img id="urgent" class="priorityImage" src="./assets/img/activeUrgentPriority.png"
                                      alt="">
                              </button>
                              <button type="button" onclick="changePrioToMedium()" class="distanceSmall prioButton">
                                  <span>Medium</span>
                                  <img id="medium" class="priorityImage" src="./assets/img/MediumPriority.png" alt="">
                              </button>
                              <button type="button" onclick="changePrioToLow()" class="distanceSmall prioButton">
                                  <span>Low</span>
                                  <img id="low" class="priorityImage" src="./assets/img/LowPriority.png" alt="">
                              </button>
    </div>
    `;
  }