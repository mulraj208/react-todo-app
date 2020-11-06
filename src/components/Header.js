import React, {Component} from 'react';
import {ENTER_KEY} from "../constants";

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newTodo: '',
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
            const todos = [...this.props.todos, {
                id: new Date().getTime(),
                text: val,
                completed: false,
            }];

            this.setState({newTodo: ''});
            this.props.updateStore(todos);
        }
    }

    render() {
        const {newTodo} = this.state;

        return (
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
        );
    }
}

export default Header;