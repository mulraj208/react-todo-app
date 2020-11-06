import React from 'react';
import {
    ALL_TODOS,
    ACTIVE_TODOS,
    COMPLETED_TODOS,
    STORE_NAME,
} from "./constants";
import Header from "./components/Header";
import List from "./components/List";
import Footer from "./components/Footer";
import './App.css';

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
            todos: store(STORE_NAME),
            filter: ALL_TODOS
        };

        this.node = null;
    }

    updateStore = (todos) => {
        this.setState({todos});
        store(STORE_NAME, todos);
    }

    toggleAll = (event) => {
        const checked = event.target.checked;
        const todos = this.state.todos.map(todo => ({...todo, completed: checked}));
        this.updateStore(todos);
    }

    clearCompleted = () => {
        const todos = store(STORE_NAME).filter(todo => !todo.completed);
        this.updateStore(todos);
        this.filterTodos(this.state.filter);
    }

    filterTodos = (filter) => {
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
        const {todos, filter} = this.state;

        return (
            <section className="todoapp">
                <Header
                    todos={todos}
                    updateStore={this.updateStore}
                />
                <List
                    todos={todos}
                    toggleAll={this.toggleAll}
                    updateStore={this.updateStore}
                />
                <Footer
                    todos={todos}
                    filter={filter}
                    filterTodos={this.filterTodos}
                    clearCompleted={this.clearCompleted}
                />
            </section>
        );
    }
}

export default App;
