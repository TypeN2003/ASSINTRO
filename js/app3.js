let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML= document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');

let listProduct = [];
let carts = [];
iconCart.addEventListener('click', ()=>{
    body.classList.toggle('showCart')
});

closeCart.addEventListener('click',() =>{
    body.classList.toggle('showCart')
});

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';

    // กรองสินค้าที่มี id ตั้งแต่ 1 ถึง 8
    const productsToShow = listProduct.filter(product => product.id >= 17 && product.id <= 24);

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
listProductHTML.addEventListener('click', (event) =>{
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
})
const addToCart = (product_id) =>{
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if(carts.length <= 0){
        carts =[{
            product_id: product_id,
            quantity: 1
        }]
    }else if(positionThisProductInCart < 0){
        carts.push({
            product_id: product_id,
            quantity:1
        });
    }else{
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}
const addCartToMemory= () =>{
    localStorage.setItem('cart', JSON.stringify(carts));
}
const addCartToHTML = () =>{
    listCartHTML.innerHTML= '';
    let totalQuantity = 0;
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id =cart.product_id;
            let positionProduct = listProduct.findIndex((value)=> value.id == cart.product_id);
            let info =listProduct[positionProduct];
            newCart.innerHTML =`
            <div class="image">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="toalprice">
                ${info.price * cart.quantity} บาท
                </div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span>
                </div>
                `;
        listCartHTML.appendChild(newCart);
        })
    }
    iconCartSpan.innerText = totalQuantity;
}
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus'; // แก้ typr เป็น type
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
