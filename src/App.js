import React from 'react';
import classNames from 'classnames';
import './App.css';

const ALL_TODOS = 'ALL_TODOS';
const ACTIVE_TODOS = 'ACTIVE_TODOS';
const COMPLETED_TODOS = 'COMPLETED_TODOS';
const STORE_NAME = 'REACT_TODO_APP';
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

const store = (namespace, data) => {
    if (data) {
        return localStorage.setItem(namespace, JSON.stringify(data));
    }

    const store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newTodo: '',
            todos: store(STORE_NAME),
            filter: ALL_TODOS,
            editing: null,
            editText: '',
        };

        this.node = null;
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.node && this.node !== event.target) {
            this.saveEditInput();
        }
    }

    handleChange = (event) => {
        this.setState({newTodo: event.target.value});
    }

    handleNewTodoKeyDown = (event) => {
        if (event.which !== ENTER_KEY) {
            return;
        }

        event.preventDefault();

        const val = this.state.newTodo.trim();

        if (val) {
            const todos = [...this.state.todos, {
                id: new Date().getTime(),
                text: val,
                completed: false,
            }];

            this.setState({newTodo: '', todos});
            store(STORE_NAME, todos);
        }
    }

    toggleAll = (event) => {
        const checked = event.target.checked;
        const todos = this.state.todos.map(todo => ({...todo, completed: checked}));
        this.setState({todos});
        store(STORE_NAME, todos);
    }

    toggle(e, id) {
        const todos = this.state.todos.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    completed: !item.completed
                }
            }

            return item;
        });

        this.setState({todos});
        store(STORE_NAME, todos);
    }

    destroy = (id) => {
        const todos = this.state.todos.filter(item => item.id !== id);
        this.setState({todos});
        store(STORE_NAME, todos);
    }

    handleKeyDown = (event) => {
        if (event.which === ESCAPE_KEY) {
            this.setState({editText: ''});
            this.cancel();
        } else if (event.which === ENTER_KEY) {
            this.saveEditInput();
        }
    }

    saveEditInput = () => {
        const todos = this.state.todos.map(todo => {
            if (todo.id === this.state.editing) {
                return {
                    ...todo,
                    text: this.state.editText
                }
            }
            return todo;
        });

        this.setState({todos});
        store(STORE_NAME, todos);
        this.cancel();
    }

    handleEdit = (event) => {
        this.setState({editText: event.target.value});
    }

    edit(event, todo) {
        this.node = event.target.closest('li').querySelector('input.edit');
        this.setState({editing: todo.id, editText: todo.text}, () => {
            this.node.focus();
            this.node.setSelectionRange(this.node.value.length, this.node.value.length);
        });
    }

    save(todoToSave, text) {
        this.props.model.save(todoToSave, text);
        this.setState({editing: null});
    }

    cancel() {
        this.setState({editing: null});
    }

    clearCompleted = () => {
        const todos = this.state.todos.filter(todo => !todo.completed);
        this.setState({todos});
        store(STORE_NAME, todos);
    }

    filterTodos(filter) {
        let todos = store(STORE_NAME);

        switch (filter) {
            case ACTIVE_TODOS: {
                todos = store(STORE_NAME).filter(todo => !todo.completed)
                break;
            }
            case COMPLETED_TODOS: {
                todos = store(STORE_NAME).filter(todo => todo.completed)
                break;
            }
            default: {
                console.log(ALL_TODOS)
            }
        }

        this.setState({filter: filter, todos});
    }

    render() {
        const {newTodo, todos, filter, editing, editText} = this.state;
        const activeCount = todos.filter(todo => !todo.completed).length;
        const completedCount = todos.length - activeCount;

        return (
            <section className="todoapp">
                <header className="header">
                    <h1>Todos</h1>
                    <input
                        className="new-todo"
                        placeholder="What needs to be done?"
                        value={newTodo}
                        onChange={this.handleChange}
                        onKeyDown={this.handleNewTodoKeyDown}
                    />
                </header>
                <section className="main">
                    <input id="toggle-all" className="toggle-all" type="checkbox" onChange={this.toggleAll}/>
                    <label htmlFor="toggle-all"/>
                    <ul className="todo-list">
                        {todos.map(todo => (
                            <li
                                key={todo.id}
                                className={classNames({completed: todo.completed, editing: editing === todo.id})}
                                onDoubleClick={(e) => this.edit(e, todo)}
                            >
                                <div className="view">
                                    <input
                                        className="toggle"
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={(e) => this.toggle(e, todo.id)}
                                    />
                                    <label>{todo.text}</label>
                                    <button className="destroy" onClick={() => this.destroy(todo.id)}/>
                                </div>
                                <input
                                    className="edit"
                                    value={editText}
                                    onChange={this.handleEdit}
                                    onKeyDown={this.handleKeyDown}
                                />
                            </li>
                        ))}
                    </ul>
                </section>
                <footer className="footer">
					<span className="todo-count">
						<strong>{activeCount}</strong> {activeCount > 1 ? 'items' : 'item'} left
					</span>
                    <ul className="filters">
                        <li>
                            <span
                                onClick={() => this.filterTodos(ALL_TODOS)}
                                className={classNames({selected: filter === ALL_TODOS})}>
                                All
                            </span>
                        </li>
                        <li>
                            <span
                                onClick={() => this.filterTodos(ACTIVE_TODOS)}
                                className={classNames({selected: filter === ACTIVE_TODOS})}>
                                Active
                            </span>
                        </li>
                        <li>
                            <span
                                onClick={() => this.filterTodos(COMPLETED_TODOS)}
                                className={classNames({selected: filter === COMPLETED_TODOS})}>
                                Completed
                            </span>
                        </li>
                    </ul>
                    {
                        completedCount ? (
                            <button
                                className="clear-completed"
                                onClick={this.clearCompleted}>
                                Clear completed
                            </button>
                        ) : null
                    }
                </footer>
            </section>
        );
    }
}

export default App;
