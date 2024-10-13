
let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');

let listProduct = [];
let carts = [];

// // แสดง/ซ่อนตะกร้า
// iconCart.addEventListener('click', () => {
//     body.classList.toggle('showCart');
// });
const calculateTotal = () => {
    const totalAmount = carts.reduce((acc, cart) => {
        const productInfo = listProduct.find(product => product.id == cart.product_id);
        return acc + (productInfo ? productInfo.price * cart.quantity : 0);
    }, 0);

    const shippingCost = 45; // ค่าจัดส่ง
    const finalTotal = totalAmount + shippingCost;

    // แสดงผลรวมใน HTML
    document.getElementById('totalAmount').innerText = `฿${totalAmount}`;
    document.getElementById('finalTotal').innerText = `฿${finalTotal}`;
};

// อัปเดตจำนวนสินค้าที่แสดงในไอคอนตะกร้า
const updateCartCount = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        carts = JSON.parse(storedCart);
        const totalQuantity = carts.reduce((acc, item) => acc + item.quantity, 0);
        iconCartSpan.innerText = totalQuantity; // แสดงจำนวนสินค้า
    } else {
        iconCartSpan.innerText = 0; // ไม่มีสินค้า
    }
};

// เรียกใช้ฟังก์ชันเมื่อหน้าเว็บโหลด
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

// ปิดตะกร้า
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// บันทึกตะกร้าลง Local Storage
const saveCartData = () => {
    localStorage.setItem('cart', JSON.stringify(carts)); // บันทึกข้อมูลตะกร้า
};

const loadCartData = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        carts = JSON.parse(storedCart);
    }
};


// ฟังก์ชันเพิ่มสินค้าไปยังตะกร้า
const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);

    if (positionThisProductInCart < 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        carts[positionThisProductInCart].quantity += 1;
    }

    console.log('Cart data after adding product:', carts); // เพิ่ม log เพื่อตรวจสอบข้อมูลตะกร้า

    addCartToHTML(); // เรียกฟังก์ชันเพื่อแสดงสินค้าที่อยู่ในตะกร้า
    saveCartData(); // บันทึกข้อมูลตะกร้าลง Local Storage
    updateCartCount(); // อัพเดทจำนวนสินค้าในไอคอนตะกร้า
};


// แสดงข้อมูลในตะกร้า
const addCartToHTML = () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = ''; // ล้างข้อมูลเดิมก่อน

    if (carts.length > 0) {
        carts.forEach(cart => {
            let positionProduct = listProduct.findIndex((value) => value.id == cart.product_id);
            let info = listProduct[positionProduct]; // ดึงข้อมูลสินค้าเพื่อแสดงผล

            if (info) {
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.dataset.id = cart.product_id;
                newCart.innerHTML = `
                    <div class="image">
                        <img src="${info.image}" alt="">
                    </div>
                    <div class="name">${info.name}</div>
                    <div class="totalprice">${info.price * cart.quantity} บาท</div>
                    <div class="quantity">
                        <span class="minus" data-id="${cart.product_id}">-</span>
                        <span>${cart.quantity}</span>
                        <span class="plus" data-id="${cart.product_id}">+</span>
                    </div>
                `;
                cartItemsContainer.appendChild(newCart);
            }
        });
    }
    calculateTotal(); // เรียกฟังก์ชันคำนวณราคาหลังจากแสดงผลตะกร้า
};

const subtractFromCart = (product_id) => {
    let productInCart = carts.find(cart => cart.product_id == product_id);

    if (productInCart && productInCart.quantity > 1) {
        productInCart.quantity -= 1;
    } else {
        carts = carts.filter(cart => cart.product_id != product_id);
    }

    console.log('Cart after subtraction:', carts); // ตรวจสอบข้อมูลในตะกร้า

    addCartToHTML(); // อัพเดทการแสดงผลตะกร้า
    saveCartData(); // บันทึกข้อมูลตะกร้าลงใน Local Storage
    updateCartCount(); // อัพเดทจำนวนสินค้าในไอคอนตะกร้า
};


// เปลี่ยนจำนวนสินค้าที่อยู่ในตะกร้า
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantity(product_id, type);
    }
});


// ฟังก์ชันเปลี่ยนจำนวนสินค้าในตะกร้า
const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);

    if (positionItemInCart >= 0) {
        if (type === 'plus') {
            carts[positionItemInCart].quantity += 1;
        } else {
            if (carts[positionItemInCart].quantity > 1) {
                carts[positionItemInCart].quantity -= 1;
            } else {
                carts.splice(positionItemInCart, 1); // ลบสินค้าถ้าจำนวนเป็น 0
            }
        }
    }
    saveCartData(); // บันทึกข้อมูลตะกร้าลงในหน่วยความจำ
    addCartToHTML(); // อัพเดทการแสดงผลของตะกร้า
    updateCartCount(); // อัพเดทจำนวนสินค้าในไอคอนตะกร้า
};


// ฟังก์ชันเริ่มต้นโหลดข้อมูลสินค้าจาก JSON

const initApp = () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data1 => {
            console.log('Loaded products from products.json:', data1); // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ถูกโหลด
            return fetch('products2.json').then(response => response.json())
                .then(data2 => {
                    console.log('Loaded products from products2.json:', data2); // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ถูกโหลด
                    return fetch('products3.json').then(response => response.json())
                        .then(data3 => {
                            console.log('Loaded products from products3.json:', data3); // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ถูกโหลด

                            listProduct = [...data1, ...data2, ...data3]; // รวมสินค้าจากทั้ง 3 ไฟล์

                            if (localStorage.getItem('cart')) {
                                carts = JSON.parse(localStorage.getItem('cart'));
                            } else {
                                carts = [];
                            }
                            addCartToHTML(); // อัพเดทข้อมูลในตะกร้า
                            updateCartCount(); // อัพเดทจำนวนสินค้าในไอคอนตะกร้า
                        });
                });
        })
        .catch(error => console.error('Error fetching products:', error));
    console.log('Cart contents:', carts);
};



// เรียกใช้ฟังก์ชันเริ่มต้นเมื่อหน้าโหลด
window.onload = initApp;