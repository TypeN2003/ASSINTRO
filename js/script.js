document.addEventListener("DOMContentLoaded", function() {
    const toggleMenu = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('ul');

    toggleMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active'); // สลับ class 'active' เพื่อแสดง/ซ่อนเมนู
        toggleMenu.classList.toggle('active'); // เพิ่ม class 'active' ให้กับปุ่มสามขีด
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const images = Array.from(thumbnails).map(thumbnail => thumbnail.dataset.image);
    let currentIndex = 0;

    // ฟังก์ชันอัปเดตรูปหลัก
    const updateMainImage = (index) => {
        mainImage.src = images[index];
    };

    // เมื่อคลิกปุ่มถัดไป
    document.querySelector('.next-btn').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateMainImage(currentIndex);
    });

    // เมื่อคลิกปุ่มก่อนหน้า
    document.querySelector('.prev-btn').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateMainImage(currentIndex);
    });

    // เมื่อคลิกที่รูปขนาดย่อ
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            currentIndex = index;
            updateMainImage(index);
        });
    });
});

document.getElementById("confirmOrderBtn").addEventListener("click", function() {
    // เมื่อกดปุ่มแล้วให้แสดงข้อความแจ้งเตือน
    alert("ชำระเงินแล้ว");

    // หรืออัปเดตเนื้อหาในหน้าเว็บเป็นข้อความยืนยัน
    const paymentSection = document.querySelector(".payment-section");
    paymentSection.innerHTML = "<h2>ชำระเงินเรียบร้อยแล้ว!</h2><p>ขอบคุณสำหรับการสั่งซื้อสินค้ากับเรา</p>";
});

// เมื่อกดปุ่ม "ยืนยันคำสั่งซื้อ"
document.getElementById("confirmOrderBtn").addEventListener("click", function() {
    // แสดงโมดอล
    document.getElementById("paymentModal").style.display = "block";
});

// เมื่อกดปุ่ม "ปิด" ในโมดอล
document.getElementById("closeModalBtn").addEventListener("click", function() {
    // ซ่อนโมดอล
    document.getElementById("paymentModal").style.display = "none";
});