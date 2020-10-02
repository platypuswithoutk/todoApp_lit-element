import nanoid from 'nanoid';

export const ADD_TODO = 'ADD_TODO';
export const UPDATE_ADD_TODO = 'UPDATE_ADD_TODO';
export const UPDATE_FILTER = 'UPDATE_FILTER';
export const CLEAR_COMPLETED = 'CLEAR_COMPLETED';

export const addTodo = task => {
    return {
        type: ADD_TODO,
        todo: {
            id: nanoid(),
            task,
            complete: false
        }
    }
}
