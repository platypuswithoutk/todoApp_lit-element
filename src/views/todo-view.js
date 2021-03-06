import { LitElement, html} from 'lit-element';
import {VisibilityFilters} from '../redux/reducer.js';
import { connect } from 'pwa-helpers';
import { store } from '../redux/store.js';

class TodoView extends connect(store)(LitElement) {
    static get properties() { 
        return {
          todos: { type: Array },
          filter: { type: String },
          task: { type: String }
        };
      }

      stateChanged(state) {
        this.todos = state.todos;
        this.filter = state.filter;
      }

    render() {
        return html`
          <style>
            todo-view {
              display:block;
              max-width: 800px;
              margin: 0 auto;
            }
            todo-view .input-layout {
              width: 100%;
              display:flex;
            }
            h1 {
              text-align:center;
            }
            .input-layoyt, main {
              display: flex;
              justify-content:center;
              align-items: center;
            }
            .visibility-filters {
              margin-top: calc(4 * var( --spacing));
              align-items:center;
            }
            vaadin-checkbox {
              display: flex;
              justify-content: center;
              align-items: center;
            }
          </style>
            <div class="input-layoyt" @keyup="${this.shortcutListener}"> 
              <vaadin-text-field
                  placeholder="Task"
                  value="${this.task || ''}" 
                  @change="${this.updateTask}"> 
              </vaadin-text-field>

              <vaadin-button
                  theme="primary"
                  @click="${this.addTodo}"> 
                  Add Todo
              </vaadin-button>
            </div>

            <div clas="todos-list">
              ${
                this.applyFilter(this.todos).map(todo => html`
                <div class="todo-item">
                  <vaadin-checkbox
                    ?checked="${todo.complete}"
                    @change = "${e => this.updateTodoStatus(todo, e.target.checked)}">
                    ${todo.task}
                  </vaadin-checkbox>
                </div>
              `)}
            </div>

            <vaadin-radio-group
              class="visibility-filters"
              value="${this.filter}"
              @value-changed="${this.filterChanged}">

              ${Object.values(VisibilityFilters).map(filter => html `
                <vaadin-radio-button value="${filter}">
                  ${filter}
                </vaadin-radio-button>
              `)}
            </vaadin-radio-group>
            <vaadin-button @click="${this.clearCompleted}">
              Remove
            </vaadin-button>
        `;
    }

    clearCompleted() {
      this.todos = this.todos.filter(todo => !todo.complete)
    }

    filterChanged(e) {
      this.filter = e.target.value;
    }

    applyFilter(todos) {
      switch(this.filter) {
        case VisibilityFilters.SHOW_ACTIVE:
          return todos.filter(todo => !todo.complete);
        case VisibilityFilters.SHOW_COMPLETED:
          return todos.filter(todo => todo.complete);
        default:
          return todos;
      }
    }
    
    shortcutListener(e) {
      if (e.key === 'Enter') { 
        this.addTodo();
      }
    }
  
    updateTask(e) {
      this.task = e.target.value; 
    }

    addTodo() {
      if (this.task) {
        this.todos = [...this.todos, { 
            task: this.task,
            complete: false
        }];
        this.task = ''; 
      }
    }

    updateTodoStatus(updatedTodo, complete) {
      this.todos = this.todos.map(todo =>
        updatedTodo === todo ? { ...updatedTodo, complete } : todo
      );
    }

    createRenderRoot() {
      return this;
    }
      
}

customElements.define('todo-view', TodoView);