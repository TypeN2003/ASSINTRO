let carts = [];

// เรียกใช้ฟังก์ชันนี้เพื่อเพิ่มข้อมูลตะกร้า
const saveCartData = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
};

// ฟังก์ชันเพิ่มสินค้าไปยังตะกร้า
const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if(carts.length <= 0){
        carts = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if(positionThisProductInCart < 0){
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        carts[positionThisProductInCart].quantity += 1;
    }
    saveCartData();
};

// ฟังก์ชันเปลี่ยนจำนวนสินค้าในตะกร้า
const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity += 1;
                break;
            default:
                let valueChange = carts[positionItemInCart].quantity - 1;
                if (valueChange > 0) {
                    carts[positionItemInCart].quantity = valueChange;
                } else {
                    carts.splice(positionItemInCart, 1); // ลบสินค้าถ้าจำนวนเป็น 0
                }
                break;
        }
    }
    saveCartData();
};

// ฟังก์ชันดึงข้อมูลตะกร้า
const getCartData = () => {
    if (localStorage.getItem('cart')) {
        carts = JSON.parse(localStorage.getItem('cart'));
    }
    return carts;
};

// ฟังก์ชันแสดงผลใน HTML
const displayCart = (listCartHTML) => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity += cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            newCart.innerHTML = `<div class="name">Product ID: ${cart.product_id}, Quantity: ${cart.quantity}</div>`;
            listCartHTML.appendChild(newCart);
        });
    }
};

// Export ฟังก์ชันเพื่อให้สามารถใช้งานในไฟล์อื่น
export { addToCart, changeQuantity, getCartData, displayCart };
