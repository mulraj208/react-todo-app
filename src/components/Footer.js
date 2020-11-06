import React, {Component} from 'react';
import {ACTIVE_TODOS, ALL_TODOS, COMPLETED_TODOS} from "../constants";
import classNames from "classnames";

class Footer extends Component {
    render() {
        const {todos, filterTodos, clearCompleted, filter} = this.props;
        const activeCount = todos.filter(todo => !todo.completed).length;
        const completedCount = todos.length - activeCount;
        const filters = [
            {filterName: ALL_TODOS, text: 'All'},
            {filterName: ACTIVE_TODOS, text: 'Active'},
            {filterName: COMPLETED_TODOS, text: 'Completed'}
        ];

        return (
            <footer className="footer">
                <span className="todo-count">
                    <strong>{activeCount}</strong> {activeCount > 1 ? 'items' : 'item'} left
                </span>
                <ul className="filters">
                    {
                        filters.map((item) => (
                            <li key={item.filterName}>
                                <span
                                    onClick={() => filterTodos(item.filterName)}
                                    className={classNames({selected: filter === item.filterName})}>
                                    {item.text}
                                </span>
                            </li>
                        ))
                    }
                </ul>
                {
                    completedCount ? (
                        <button
                            className="clear-completed"
                            onClick={clearCompleted}>
                            Clear completed
                        </button>
                    ) : null
                }
            </footer>
        );
    }
}

export default Footer;