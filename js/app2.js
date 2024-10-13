let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');

let listProduct = [];
let carts = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';

    // กรองสินค้าที่มี id ตั้งแต่ 1 ถึง 8
    const productsToShow = listProduct.filter(product => product.id >= 9 && product.id <= 16);

    if (productsToShow.length > 0) {
        productsToShow.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2><a href="${product.link}"><h2>${product.name}</h2></a></h2>
                <div class="price">${product.price} บาท</div>
                <button class="addCart">
                    เพิ่มลงตระกร้า
                </button>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }
};

// จับคลิกสำหรับปุ่ม 'Add to Cart' ที่อยู่ใน .info-box
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        let product_id = this.dataset.id; // ดึง ID ของสินค้าจาก data-id ของปุ่ม
        addToCart(product_id); // เรียกฟังก์ชัน addToCart เพื่อเพิ่มสินค้าเข้าตะกร้า
    });
});

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
});

const addToCart = (product_id) => {
    // หา index ของสินค้านั้นในตะกร้า
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    
    // ตรวจสอบว่ามีสินค้าในตะกร้าหรือยัง
    if (positionThisProductInCart < 0) {
        // ถ้ายังไม่มี ให้เพิ่มลงตะกร้า
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        // ถ้ามีแล้ว ให้เพิ่มจำนวน
        carts[positionThisProductInCart].quantity += 1;
    }

    // อัปเดตตะกร้าและบันทึกลง LocalStorage
    addCartToHTML();
    localStorage.setItem('cart', JSON.stringify(carts));
};


const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
};

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';  // ล้างข้อมูลตะกร้าเดิมก่อน
    let totalQuantity = 0;  // ตัวนับจำนวนสินค้าในตะกร้า
    
    if (carts.length > 0) {
        carts.forEach(cart => {
            totalQuantity += cart.quantity;  // นับจำนวนสินค้าทั้งหมด
            let positionProduct = listProduct.findIndex((value) => value.id == cart.product_id);
            let info = listProduct[positionProduct];  // ดึงข้อมูลสินค้าเพื่อแสดงผล
            
            // สร้าง HTML สำหรับแสดงสินค้าในตะกร้า
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
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
            listCartHTML.appendChild(newCart);  // เพิ่มสินค้าเข้าใน HTML ของตะกร้า
        });
    }
    iconCartSpan.innerText = totalQuantity;  // อัปเดตจำนวนสินค้าในไอคอนตะกร้า
};

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantity(product_id, type);
    }
});

const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
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
    addCartToMemory(); // บันทึกข้อมูลตะกร้าลงในหน่วยความจำ
    addCartToHTML();    // อัพเดทการแสดงผลของตะกร้า
};

const initApp = () => {
    // Fetch ข้อมูลสินค้าจาก products.json
    fetch('products.json')
    .then(response => response.json())
    .then(data1 => {
        // Fetch ข้อมูลสินค้าจาก products2.json
        fetch('products2.json')
        .then(response => response.json())
        .then(data2 => {
            // Fetch ข้อมูลสินค้าจาก products3.json
            fetch('products3.json')
            .then(response => response.json())
            .then(data3 => {
                // รวมสินค้าจากทั้งสาม JSON
                listProduct = [...data1, ...data2, ...data3];
                console.log(listProduct);
                addDataToHTML();

                // โหลดข้อมูลตะกร้าจาก localStorage
                if (localStorage.getItem('cart')) {
                    carts = JSON.parse(localStorage.getItem('cart'));
                    addCartToHTML();
                }
                saveCartData(); // บันทึกข้อมูลตะกร้าใน localStorage
            });
        });
    });
};

initApp();


