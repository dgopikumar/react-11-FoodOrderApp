import { useReducer } from 'react';
import CartContext from './cart-context';

const defaultCartState = {
    items:[],
    totalAmount:0
};

const cartReducer = (state, action) => {
    if(action.type === 'ADD') {
        //const updatedItems = state.items.concat(action.item);
        const updatedTotalAmount = state.totalAmount + action.item.price * action.item.amount;
        const existingCartItmIndex = state.items.findIndex((item) => item.id === action.item.id);
        const existingCartItem = state.items[existingCartItmIndex];
        let updatedItems;

        if(existingCartItem) {
            const updatedItem = {...existingCartItem, 
                amount: existingCartItem.amount + action.item.amount};

            updatedItems = [...state.items];
            updatedItems[existingCartItmIndex] = updatedItem;
        } else {
            updatedItems = state.items.concat(action.item);
        }
        
        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount
        };
    }
    if(action.type === 'REMOVE') {
        const existingCartItemIndex = state.items.findIndex((item) => item.id === action.id);
        const existingItem = state.items[existingCartItemIndex];
        const updatedTotalAmount = state.totalAmount - existingItem.price;
        let updatedItems;
        if(existingItem.amount === 1){
            updatedItems = state.items.filter(item => item.id !== action.id);
        } else {
            const updatedItem = {...existingItem, amount: existingItem.amount - 1};
            updatedItems = [...state.items];
            updatedItems[existingCartItemIndex] = updatedItem;
        }

        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount
        };
    }

    if(action.type === 'CLEAR') {
        return defaultCartState;
    }

    return defaultCartState;
};

const CartProvider = (props) => {
    const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState);

    const addItemToCartHandler = (item) => {
        dispatchCartAction({type:'ADD', item:item});
    };
    const removeItemcartHandler = (id) => {
        dispatchCartAction({type:'REMOVE', id:id});
    };
    const clearCartHandler = () => {
        dispatchCartAction({type:'CLEAR'});
    };

    const cartContext = {
        items: [],
        totalAmount: 0,
        addItem: addItemToCartHandler,
        removeItem: removeItemcartHandler,
        clearCart: clearCartHandler
    };

    cartContext.items = cartState.items;
    cartContext.totalAmount = cartState.totalAmount;

    return (
        <CartContext.Provider value={cartContext}>
            {props.children}
        </CartContext.Provider>
    );
}

export default CartProvider;