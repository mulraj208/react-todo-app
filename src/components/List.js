import React, {Component} from 'react';
import classNames from "classnames";
import {ENTER_KEY, ESCAPE_KEY} from "../constants";

class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: null,
            editText: ''
        };
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

    edit(event, todo) {
        this.node = event.target.closest('li').querySelector('input.edit');
        this.setState({editing: todo.id, editText: todo.text}, () => {
            this.node.focus();
            this.node.setSelectionRange(this.node.value.length, this.node.value.length);
        });
    }

    saveEditInput = () => {
        const todos = this.props.todos.map(todo => {
            if (todo.id === this.state.editing) {
                return {
                    ...todo,
                    text: this.state.editText
                }
            }
            return todo;
        });

        this.props.updateStore(todos);
        this.cancel();
    }

    cancel() {
        this.setState({editing: null});
    }

    toggle(e, id) {
        const todos = this.props.todos.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    completed: !item.completed
                }
            }

            return item;
        });

        this.props.updateStore(todos);
    }

    destroy = (id) => {
        const todos = this.props.todos.filter(item => item.id !== id);
        this.props.updateStore(todos);
    }

    handleEdit = (event) => {
        this.setState({editText: event.target.value});
    }

    handleKeyDown = (event) => {
        if (event.which === ESCAPE_KEY) {
            this.setState({editText: ''});
            this.cancel();
        } else if (event.which === ENTER_KEY) {
            this.saveEditInput();
        }
    }

    render() {
        const {todos, toggleAll} = this.props;
        const {editing, editText} = this.state;

        return (
            <section className="main">
                <input id="toggle-all" className="toggle-all" type="checkbox" onChange={toggleAll}/>
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
        );
    }
}

export default List;