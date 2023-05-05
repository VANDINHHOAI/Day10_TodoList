let todoItems = []
const todoInput = document.querySelector('.todo-input')
const completedTodosDiv = document.querySelector('.completed-todos')
const uncompletedTodoDiv = document.querySelector('.uncompleted-todos')
const audio = new Audio('')

window.onload = () => {
    let storageTodoItems = localStorage.getItem('todoItem')
    if(storageTodoItems !== null) {
        todoItems = JSON.parse(storageTodoItems)
    }

    render()
}

todoInput.onkeyup = ((e) => {
    let value = e.target.value.replace(/^\s+/,"")
    if(value && e.keyCode === 13) {
        addTodo(value)

        todoInput.value = ''
        todoInput.focus()
    }
})

function addTodo(text) {
    todoItems.push({
        id: Date.now(),
        text,
        completed: false
    })

    saveAndRender()
}

function removeTodo(id) {
    todoItems = todoItems.filter(todo => todo.id !== Number(id))
    saveAndRender()
}

function markAsCompleted(id) {
    todoItems = todoItems.filter(todo => {
        if(todo.id === Number(id)) {
            todo.completed = true
        }

        return todo
    })

    saveAndRender()
}

function markAsUncompleted(id) {
    todoItems = todoItems.filter(todo => {
        if (todo.id === Number(id)) {
            todo.completed = false
        }

        return todo
    })

    saveAndRender()

}

function save() {
    localStorage.setItem('todoItems', JSON.stringify(todoItems))
}

function render() {
    let uncompletedTodos = todoItems.filter(item => !item.completed)
    let completedTodos = todoItems.filter(item => item.completed)

    completedTodosDiv.innerHTML = ``
    uncompletedTodoDiv.innerHTML = ``

    if(uncompletedTodos.length > 0) {
        uncompletedTodos.forEach(todo => {
            uncompletedTodoDiv.append(createTodoElement(todo))
        }) 
    }else {
        uncompletedTodoDiv.innerHTML = `<div class = 'empty'>Không có việc chưa hoàn thành </div>`
    }

    if(completedTodos.length > 0) {
        completedTodosDiv.innerHTML = `<div class = 'completed-title'>Completed(${completedTodos.length} / ${todoItems.length})</div>`

        completedTodos.forEach(todo => {
            completedTodosDiv.append(createTodoElement(todo))
        })
    }
}
 
function saveAndRender() {
    save()
    render()
}

function createTodoElement(todo) {
    const todoDiv = document.createElement('div')
    todoDiv.setAttribute('data-id', todo.id)
    todoDiv.className = 'todo-item'

    const todoTextSpan = document.createElement('span')
    todoTextSpan.innerHTML = todo.text

    const todoInputCheckBox = document.createElement('input')
    todoInputCheckBox.type = 'checkbox'
    todoInputCheckBox.checked = todo.completed
    todoInputCheckBox.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        e.target.checked ? markAsCompleted(id) : markAsUncompleted(id)
    }

    const todoRemoveBtn = document.createElement('a')
    todoRemoveBtn.href = '#'
    todoRemoveBtn.innerHTML = `<i class='bx bx-x'></i>`
    todoRemoveBtn.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        removeTodo(id)
    }

    todoTextSpan.prepend(todoInputCheckBox)
    todoDiv.appendChild(todoTextSpan)
    todoDiv.appendChild(todoRemoveBtn)

    return todoDiv
}