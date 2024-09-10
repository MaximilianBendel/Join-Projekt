let currentDraggedElement;


async function initBoardSite() {
  await includeHTML();
  loadActiveUserInitials();
  await loadTasksFromFirebase();
  loadActiveLinkBoard();

}

function loadActiveLinkBoard() {
  document.getElementById('summarySite').classList.remove('active-link');
  document.getElementById('addTaskSite').classList.remove('active-link');
  document.getElementById('boardSite').classList.add('active-link');
  document.getElementById('contactSite').classList.remove('active-link');
}

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveTo(id) {
  tasks[currentDraggedElement]['board'] = id;
  loadTasks();
  await saveTasksInFirebase();
}

function filter() {
  let filter = document.getElementById('search').value;
  filter = filter.toLowerCase();
  loadTasks(filter);
}

function loadTasks(filter) {

  const toDo = document.getElementById('toDo');
  const inProgress = document.getElementById('inProgress');
  const awaitFeedback = document.getElementById('awaitFeedback');
  const done = document.getElementById('done');

  if (!toDo || !inProgress || !awaitFeedback || !done) {
    return;
  }

  removeAllTask();
  
  for (let i = 0; i < tasks.length; i++) {
    let title = tasks[i]["title"] || ''; 
    title = title.toLowerCase();
    let description = tasks[i]["description"] || ''; 
    description = description.toLowerCase();
    if (!filter || title.includes(filter) || description.includes(filter)) {
      loadTask(i);
    }
  }
  loadPlaceholderForSectionWithNoTask();
}


function removeAllTask() {
  const toDo = document.getElementById('toDo');
  const inProgress = document.getElementById('inProgress');
  const awaitFeedback = document.getElementById('awaitFeedback');
  const done = document.getElementById('done');

  if (toDo) toDo.innerHTML = '';
  if (inProgress) inProgress.innerHTML = '';
  if (awaitFeedback) awaitFeedback.innerHTML = '';
  if (done) done.innerHTML = '';
}

function loadTask(i) {
  const task = tasks[i];
  let board = task["board"];
  let title = task["title"];
  let description = task["description"];
  let category = task["category"];
  let priority = task["priority"];
  let subtask = task["subtask"] || [];
  let subtaskCount = subtask.length;
  let subtaskCountDone = (subtask.filter(t => t['done'] == true)).length;
  let subtaskDoneInPercent = ((subtaskCountDone / subtaskCount) * 100);
  document.getElementById(`${board}`).innerHTML += loadTaskHTML(i, title, description, category, subtaskCount, subtaskCountDone, subtaskDoneInPercent, priority);
  removeProgressBarIfNoSubtask(i, subtaskCount);
  loadAuthority(i, task);
}

function removeProgressBarIfNoSubtask(i, subtaskCount) {
  if (subtaskCount == 0) {
    document.getElementById(`subtasks${i}`).classList.add('d-none');
  }
}

function loadAuthority(i, task) {
  let authority = task["authorityForTask"] || [];
  let maxContact = loadMaxContact(authority);
  for (let j = 0; j <  maxContact; j++) {
    const contact = authority[j];
     let name = contact['name'];
     let color =contact['color'];
    const lastNameInitial = name.split(' ')[1]?.charAt(0) || '';
    if (!document.getElementById(`authorityIcon${i}`).innerHTML.includes(name)) {
      document.getElementById(`authorityIcon${i}`).innerHTML += loadAuthorityHTML(name, lastNameInitial,color);
    }
  }
}

function loadMaxContact(authority){
  if(authority.length>5){
    let maxContact = 5;
    return maxContact;
  }else{
    return authority.length;
  }
}

function getCategorySize(category) {
  switch (category) {
    case "technicalTask.png":
      return { width: '144px', height: '27px' };
    case "userStory.png":
      return { width: '113px', height: '27px' };
    default:
      return { width: '144px', height: '27px' };
  }
}

function getPrioritySize(priority) {
  switch (priority) {
    case 'urgent':
      return { width: '17px', height: '12px' };
    case 'medium':
      return { width: '17px', height: '6.7px' };
    case 'low':
      return { width: '17px', height: '12px' };
    default:
      return { width: '17px', height: '12px' };
  }
}

function loadPlaceholderForSectionWithNoTask() {
  loadPlaceholderForToDoSectionIfNoTask();
  loadPlaceholderForInProgressSectionIfNoTask();
  loadPlaceholderForAwaitFeedbackSectionIfNoTask();
  loadPlaceholderForDoneSectionIfNoTask();
}

function loadPlaceholderForToDoSectionIfNoTask() {
  let toDoTask = tasks.filter(element => element['board'] == 'toDo');
  if (toDoTask.length == 0) {
    document.getElementById('toDo').innerHTML = loadNoTaskPlaceholderHTML(' to Do');
  }
}

function loadPlaceholderForInProgressSectionIfNoTask() {
  let inProgressTask = tasks.filter(element => element['board'] == 'inProgress');
  if (inProgressTask.length == 0) {
    document.getElementById('inProgress').innerHTML = loadNoTaskPlaceholderHTML(' in Progress');
  }
}

function loadPlaceholderForAwaitFeedbackSectionIfNoTask() {
  let awaitFeedbackTask = tasks.filter(element => element['board'] == 'awaitFeedback');
  if (awaitFeedbackTask.length == 0) {
    document.getElementById('awaitFeedback').innerHTML = loadNoTaskPlaceholderHTML(' await Feedback');
  }
}

function loadPlaceholderForDoneSectionIfNoTask() {
  let doneTask = tasks.filter(element => element['board'] == 'done');
  if (doneTask.length == 0) {
    document.getElementById('done').innerHTML = loadNoTaskPlaceholderHTML(' Done');
  }
}

function loadNoTaskPlaceholderHTML(section) {
  return `<div class="noTask">
        <span>  No tasks ${section}  </span>
          </div>`;
}

async function addTaskOnToDo() {
  document.getElementById('addTaskOnBoardSite').innerHTML = `
  <div class="containeraddTaskInBoardSize" w3-include-html="./assets/templates/addTask.html"></div>
  `;
  document.getElementById('addTaskOnBoardSite').classList.remove('d-noneAddTask');
  board = "toDo";
  await includeHTML();
  loadActiveUserInitials();
}

 async function addTaskOnInProgress() {
  document.getElementById('addTaskOnBoardSite').innerHTML = `
  <div class="containeraddTaskInBoardSize" w3-include-html="./assets/templates/addTask.html"></div>
  `;
  document.getElementById('addTaskOnBoardSite').classList.remove('d-noneAddTask');
   board = "inProgress";
   await includeHTML();
   loadActiveUserInitials();
}

async function addTaskOnAwaitFeedback() {
  document.getElementById('addTaskOnBoardSite').innerHTML = `
  <div class="containeraddTaskInBoardSize" w3-include-html="./assets/templates/addTask.html"></div>
  `;
  document.getElementById('addTaskOnBoardSite').classList.remove('d-noneAddTask');
  board = "awaitFeedback";
  await includeHTML();
  loadActiveUserInitials();
}

async function removeAddTaskDialog() {
  document.getElementById('addTaskOnBoardSite').classList.add('d-noneAddTask');
  document.getElementById('addTaskOnBoardSite').innerHTML = '';
  reset();
  await includeHTML();
  loadActiveUserInitials();
}

function openTaskDialog(i) {
  let task = tasks[i];
  let title = task["title"];
  let description = task["description"];
  let date = task["date"].replace(/-/g, '/');
  let category = task["category"];
  let priority = task["priority"];
  document.getElementById('containerOpenTaskInBoardSize').innerHTML = loadTaskDialogHTML(title, description, date, category, priority, i);
  loadSubtasksOnBigTask(i, task);
  loadContactsOnBigTask(i, task);
  const taskContainer = document.getElementById('openTaskOnBoardSite');
  taskContainer.classList.remove('d-noneAddTask');
  const containerOpenTaskInBoardSize = document.getElementById('containerOpenTaskInBoardSize');
  containerOpenTaskInBoardSize.classList.add('slide-in');
   
}

function loadContactsOnBigTask(taskNumber, task) {
  let authority = task["authorityForTask"] || [];
  document.getElementById('contactAtBigTask').innerHTML = '';
  for (let j = 0; j < authority.length; j++) {
    const name = authority[j]['name'];
    const color = authority[j]['color'];
    const lastNameInitial = name.split(' ')[1]?.charAt(0) || '';
    if (!document.getElementById(`contactAtBigTask`).innerHTML.includes(name)) {
      document.getElementById(`contactAtBigTask`).innerHTML += loadContactOnBigTaskHTML(name, lastNameInitial,color);
    }
  }
}

function loadSubtasksOnBigTask(taskNumber, task) {
  let subtasks = task["subtask"] || []; 
  document.getElementById('loadSubtasksOnBigTask').innerHTML = ''; 
  for (let j = 0; j < subtasks.length; j++) {
    let subtask = subtasks[j];
    let checkbox = assignCheckbox(subtask);
    document.getElementById('loadSubtasksOnBigTask').innerHTML += loadSubtaskOnBigTaskHTML(taskNumber, j, subtask, checkbox);
  }
}

function assignCheckbox(subtask){
  if (subtask["done"]) {
    return checkbox = './assets/img/checkboxDone.png';
  } else {
   return  checkbox = './assets/img/checkboxToDo.png';
  }
}

function loadSubtaskOnBigTaskHTML(taskNumber, subtaskNumber, subtask, checkbox) {
  return `
<div class="subtasksContactsFlexContainer"><img id="subtask${subtaskNumber}" onclick="changeCheckbox(${taskNumber},${subtaskNumber})" class="iconOnBigTask" src="${checkbox}" alt="">${subtask["subtask"]}</div>
`;
}

function changeCheckbox(taskNumber, subtaskNumber) {
  if (tasks[taskNumber]["subtask"][subtaskNumber]["done"] == true) {
    tasks[taskNumber]["subtask"][subtaskNumber]["done"] = false;
    document.getElementById(`subtask${subtaskNumber}`).src = './assets/img/checkboxToDo.png';
  } else {
    tasks[taskNumber]["subtask"][subtaskNumber]["done"] = true;
    document.getElementById(`subtask${subtaskNumber}`).src = './assets/img/checkboxDone.png';
  }
  saveTasksInFirebase();
}

function deleteTask(i) {
  tasks.splice(i, 1);
  document.getElementById('openTaskOnBoardSite').classList.add('d-noneAddTask');
  loadTasks();
  saveTasksInFirebase();
}

function closeTask() {
  const containerOpenTaskInBoardSize = document.getElementById('containerOpenTaskInBoardSize');
  containerOpenTaskInBoardSize.classList.remove('slide-in');
  containerOpenTaskInBoardSize.classList.add('slide-out');
  
  containerOpenTaskInBoardSize.addEventListener('animationend', () => {
      document.getElementById('openTaskOnBoardSite').classList.add('d-noneAddTask');
      containerOpenTaskInBoardSize.classList.remove('slide-out');
      document.getElementById('containerOpenTaskInBoardSize').innerHTML = '';
      loadTasks();
  }, { once: true });
}

function editTask(i) {
  let task = tasks[i];
  let title = task['title'];
  let description = task['description'];
  let date = task['date'];
  document.getElementById('containerOpenTaskInBoardSize').innerHTML = loadEditTaskHTML(i, title, description, date);
  document.getElementById('containerOpenTaskInBoardSize').classList.add('editContainerResponsive');
  loadPriority(i, task);
  subtasks = task['subtask'] || [];
  loadSubtasks();
  assignAuthority(task);
  removeAddContactSection();
}

function assignAuthority(task) {
  let authority = task['authorityForTask'] || [];
  for (let i = 0; i < authority.length; i++) {
    const name = authority[i]['name'];
    for (let j = 0; j < allContacts.length; j++) {
      if (name == allContacts[j]['name']) {
        allContacts[j]['contactSelect'] = true;
      }
    }
  }
}

function loadPriority(i, task) {
  let priority = task['priority'];
  document.getElementById('priority').innerHTML = loadPriorityUrgentHTML();
  if (priority == 'medium') {
    changePrioToMedium();
  } else if (priority == 'low') {
    changePrioToLow();
  }
}

function changeTask(i) {
  tasks[i]['title'] = document.getElementById('title').value;
  tasks[i]['description'] = document.getElementById('description').value;
  tasks[i]['date'] = document.getElementById('date').value;
  tasks[i]['priority'] = prio;
  tasks[i]['subtask'] = subtasks;
  addPersonToTask();
  tasks[i]['authorityForTask'] = authorityForTask;
  saveTasksInFirebase();
  reset();
  closeTask();
}

function reset() {
  subtasks = [];
  for (let i = 0; i < allContacts.length; i++) {
    allContacts[i]['contactSelect'] = false;
  }
  prio = "medium";
  authorityForTask = [];
}
