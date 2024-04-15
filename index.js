import TodoManger from "./Todo.js";

const notstarted_todo = document.getElementById("not_started_todos");
const inprogress_todo = document.getElementById("progress_todos");
const completed_todo = document.getElementById("completed_todos");

const options = [notstarted_todo, inprogress_todo, completed_todo]


function addTodoCard(todo, index) {
    const element = document.createElement("form");
    element.className = "todo_card";
    element.draggable = true;
    element.dataset.id = todo.id
    element.innerHTML = `
    <input value="${todo.content}" type="text"  name="todo" disabled="disabled" >
    <div>
        <span class="todo-id">#${todo.id}</span>
        <span>
            <button class="edit" data-id="${todo.id}">🖋️</button>
            <button class="update hide" data-id="${todo.id}" data-column="${index}">✅</button>
            <button class="delete" data-id="${todo.id}">🗑️</button>
        </span>
    </div>
    `
    options[index].appendChild(element);


}


TodoManger.getAllTodos().forEach((todos, index) => {
    todos.forEach(todo => {
        addTodoCard(todo, index)
    })
})


const addForm = document.querySelectorAll(".add");

addForm.forEach(form => {
    form.addEventListener('submit', e => {
        e.preventDefault();
        if (form.todo.value) {
            const todo = TodoManger.insertTodo(form.submit.dataset.id, form.todo.value);
            addTodoCard(todo, form.submit.dataset.id)
            form.reset();
        }
    })
})


options.forEach(column => {
    column.addEventListener('click', e => {
        e.preventDefault();

        const formInput = e.target.parentElement.parentElement.previousElementSibling;


        if (e.target.classList.contains("edit")) {
            formInput.removeAttribute("disabled");
            e.target.classList.add("hide");
            e.target.nextElementSibling.classList.remove("hide");
        }

        if (e.target.classList.contains("delete")) {
            formInput.parentElement.remove()
            TodoManger.deleteTodo(e.target.dataset.id)
        }


        if (e.target.classList.contains("update")) {
            formInput.setAttribute("disabled", "disabled")
            e.target.classList.add("hide");
            e.target.previousElementSibling.classList.remove("hide");


            const todoid = e.target.dataset.id;
            const columnid = e.target.dataset.column
            const content = formInput.value

            TodoManger.updateTodo(todoid, {
                id: columnid,
                content,
            })
        }

    })

    column.addEventListener("dragstart", event => {
        if (event.target.classList.contains("todo_card")) {
            event.target.classList.add("dragging")
        }
    })

    // over 
    column.addEventListener("dragover", event => {
        const card = document.querySelector(".dragging");
        column.appendChild(card)
    })

    // end
    column.addEventListener("dragend", event => {
        if (event.target.classList.contains("todo_card")) {
            event.target.classList.remove("dragging")

            const todoid = event.target.dataset.id;
            const columnid = event.target.parentElement.dataset.id
            const content = event.target.todo.value;

            console.log("todo id", todoid, columnid, content)
            TodoManger.updateTodo(todoid, {
                id: columnid,
                content,
            })
        }
    })
})


