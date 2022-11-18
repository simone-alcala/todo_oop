class Task {
  constructor (id, name, completed, boardId) {
    this.id = id;
    this.name = name;
    this.completed = completed;
    this.boardId = boardId;

  }

  getTask() {
    return {
      id: this.id,
      name: this.name,
      completed: this.completed,
      boardId: this.boardId
    }
  }

  setBoardId(boardId) {
    this.boardId = boardId;
  }

  getTaskView() {
    const taskContainer = document.createElement("li");
    taskContainer.classList.add("task");
    taskContainer.dataset.taskId = this.id;
    taskContainer.dataset.boardId = this.boardId;
    if (this.completed) {
      taskContainer.classList.add("completed");
    }
  
    const taskCheckbox = document.createElement("input");
    taskCheckbox.id = `checkbox-${this.id}-${Date.now()}`;
    taskCheckbox.classList.add("checkbox");
    taskCheckbox.type = "checkbox";
    taskCheckbox.checked = this.completed;
    taskCheckbox.addEventListener("click", () =>
      this.onCompleteTask()
    );
    taskContainer.appendChild(taskCheckbox);
  
    const taskName = document.createElement("label");
    taskName.classList.add("task-name");
    taskName.textContent = this.name;
    taskName.htmlFor = taskCheckbox.id;
    taskContainer.appendChild(taskName);
  
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", () => this.onDeleteTask());
    taskContainer.appendChild(deleteButton);
  
    return taskContainer;
  }

  onDeleteTask() {
    const board = boards.find((board) => board.id === this.boardId);        
    board.tasks = board.tasks.filter((task) => task.id !== this.id);
    const taskContainer = document.querySelector(
      `[data-task-id="${this.id}"][data-board-id="${this.boardId}"]`
    );
    taskContainer.remove();
  }

  onAddTask() {
    const board = boards.find((board) => board.id === Number(this.boardId));
    const lastTaskId = board.tasks[board.tasks.length - 1].id;
    
    this.setId(lastTaskId + 1);
    this.setCompleted(false);

    board.tasks.push(this.getTask());
  
    const tasksContainer = document.querySelector(
      `[data-board-id="${this.boardId}"] .tasks`
    );

    const taskContainer = this.getTaskView();
    tasksContainer.appendChild(taskContainer);
  }

  onCompleteTask() {
    const board = boards.find((board) => board.id === this.boardId);
  
    const completedTask = board.tasks.find((task) => task.id === this.id);
    completedTask.completed = !completedTask.completed;
  
    const taskContainer = document.querySelector(
      `[data-task-id="${this.id}"][data-board-id="${this.boardId}"]`
    );
    taskContainer.classList.toggle("completed");
  }

  setId(id) {
    this.id = id;
  }

  setCompleted(completed) {
    this.completed = completed;
  }

}

class Board {
  constructor (id, title, tasks) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;

    this.handleNewBoardInputKeypress();
      
  }

  getBoard() {
    return {
      id: this.id,
      title: this.title,
      tasks: this.tasks
    }
  }

  getBoardView() {
    const boardContainer = document.createElement("div");
    boardContainer.classList.add("board");
    boardContainer.dataset.boardId = this.id;
  
    const htmlRow = document.createElement("div");
    htmlRow.classList.add("row");
  
    const duplicateButton = document.createElement("button");
    duplicateButton.classList.add("duplicate-button");
    duplicateButton.textContent = "Duplicate board";
    duplicateButton.addEventListener("click", () => this.onDuplicateBoard());
    htmlRow.appendChild(duplicateButton);
    
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", () => this.onDeleteBoard());
    htmlRow.appendChild(deleteButton);
  
    boardContainer.appendChild(htmlRow);
  
    const boardTitle = document.createElement("p");
    boardTitle.classList.add(`board-${this.id}`);
    boardTitle.classList.add("board-title");
    boardTitle.textContent = this.title;
    boardTitle.addEventListener("click", () => this.onBoardTitleClick());
    boardContainer.appendChild(boardTitle);
  
    const tasksContainer = document.createElement("ul");
    tasksContainer.classList.add("tasks");
    boardContainer.appendChild(tasksContainer);
  
    this.tasks.forEach((task) => {
      task.setBoardId(this.id);
      const taskContainer = task.getTaskView();
      tasksContainer.appendChild(taskContainer);
    });
  
    const newTaskInput = document.createElement("input");
    newTaskInput.dataset.boardId = this.id;
    newTaskInput.classList.add("new-task-input");
    newTaskInput.type = "text";
    newTaskInput.placeholder = "Nova tarefa";
    newTaskInput.addEventListener("keypress", handleNewTaskInputKeypress);
    boardContainer.appendChild(newTaskInput);
  
    return boardContainer;
  }
  
  onDuplicateBoard() {
    const boardsContainer = document.querySelector(".boards");

    const newBoard = new Board( this.getBoard().id, this.getBoard().title, this.getBoard().tasks );
    
    const lastBoardId = boards[boards.length - 1].id;

    newBoard.id = lastBoardId + 1;
    newBoard.title = `${newBoard.title} Copy`;
  
    const boardContainer = newBoard.getBoardView();
    boardsContainer.appendChild(boardContainer);
    boards.push(newBoard);
  }
 
  onDeleteBoard() {
    boards = boards.filter((board) => board.id !== this.id);
  
    const boardContainer = document.querySelector(`[data-board-id="${this.id}"]`);
    boardContainer.remove();
  }
    
  onAddBoard() {
    const lastBoardId = boards[boards.length - 1]?.id || 0;
    this.id = lastBoardId + 1
    boards.push(this.getBoard());
  
    const boardsContainer = document.querySelector(".boards");
    const boardContainer = this.getBoardView();
    boardsContainer.appendChild(boardContainer);
  }

  onBoardTitleClick() {
    const newTitle = prompt("Novo titulo do board");
    if (!newTitle) {
      alert("Insira o novo título!");
      return;
    }
  
    const boardTitleElement = document.querySelector(
      `.board-${this.id}.board-title`
    );

    boardTitleElement.textContent = newTitle;
    setTitle(newTitle);
  }

  handleNewBoardInputKeypress() {
    const newBoardInput = document.querySelector(".new-board-input");
    newBoardInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        new Board(0, e.target.value, []).onAddBoard();
        e.target.value = "";
      }
    });

  }
 
  setId(id) {
    this.id = id;
  }

  setTitle(title) {
    this.title = title;
  }

}

function handleNewTaskInputKeypress(e) {
  if (e.key === "Enter") {
    new Task(0, e.target.value, false, e.target.dataset.boardId).onAddTask();
    e.target.value = "";
  }
}

const tarefa1 = new Task(1, "tarefa 1", false, 1);
const tarefa2 = new Task(2, "tarefa 2", false, 1);
const tarefa3 = new Task(3, "tarefa 3", true , 1);
const tarefa4 = new Task(4, "tarefa 4", false, 1);
const tarefa5 = new Task(5, "tarefa 5", true , 1);

const tarefas = [tarefa1, tarefa2, tarefa3, tarefa4, tarefa5];

const boardPessoal = new Board(1, "Title", tarefas);

let boards = [boardPessoal];

function renderizarBoards(boards) {
  const boardsContainer = document.querySelector(".boards");

  boards.forEach((board) => {
    const boardContainer = board.getBoardView();

    boardsContainer.appendChild(boardContainer);
  });
}

renderizarBoards(boards);
