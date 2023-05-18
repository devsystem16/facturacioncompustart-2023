import { type as listarProductos} from '../actions/listarProductos'
import axios from  'axios'


const defaultState = []


function reducer(state = defaultState, { type, payload }) {
    switch (type) {

        case listarProductos : {
         
            return  {"listado" : null};
        }

        default:
            return state;
    }
}
export default reducer;