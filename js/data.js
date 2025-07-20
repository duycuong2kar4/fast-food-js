// js/data.js (PHIÊN BẢN SỬA LỖI CÚ PHÁP)

const initialData = {
    products: [
        // --- MÓN ĂN CHÍNH ---
        {
            id: "p1",
            name: "Gà Rán Giòn Cay",
            price: 35000,
            description: "1 miếng gà rán giòn rụm, cay nồng.",
            imageUrl: "images/ga-ran.jpg",
            category: "food",
            ratings: [5, 5, 4],
            avgRating: 4.7
        },
        {
            id: "p2",
            name: "Hamburger Bò Phô Mai",
            price: 59000,
            description: "Hamburger bò Mỹ hảo hạng kèm lớp phô mai Cheddar tan chảy.",
            imageUrl: "images/hamburger.jpg",
            category: "food",
            ratings: [5, 4],
            avgRating: 4.5
        },
        {
            id: "p5",
            name: "Pizza Hải Sản",
            price: 129000,
            description: "Pizza đế dày phủ đầy tôm, mực và phô mai Mozzarella.",
            imageUrl: "images/pizza.jpg",
            category: "food",
            ratings: [],
            avgRating: 0
        },
        {
            id: "p6",
            name: "Mỳ Ý Sốt Bò Bằm",
            price: 75000,
            description: "Sợi mỳ Ý dai ngon hòa quyện cùng sốt cà chua và thịt bò.",
            imageUrl: "images/my-y.jpg",
            category: "food",
            ratings: [],
            avgRating: 0
        },

        // --- MÓN PHỤ & TRÁNG MIỆNG ---
        {
            id: "p3",
            name: "Khoai Tây Chiên (Lớn)",
            price: 25000,
            description: "Phần khoai tây chiên cỡ lớn, giòn rụm, nóng hổi.",
            imageUrl: "images/khoai-tay-chien.jpg",
            category: "food",
            ratings: [4, 4, 3],
            avgRating: 3.7
        },
        {
            id: "p7",
            name: "Salad Trộn Dầu Giấm",
            price: 39000,
            description: "Salad rau xanh tươi mát kèm sốt dầu giấm chua ngọt.",
            imageUrl: "images/salad.jpg",
            category: "food",
            ratings: [],
            avgRating: 0
        },

        // --- THỨC UỐNG ---
        {
            id: "p4",
            name: "Coca-Cola",
            price: 15000,
            description: "Lon Coca-Cola 330ml mát lạnh, sảng khoái.",
            imageUrl: "images/coca-cola.png",
            category: "drink",
            ratings: [],
            avgRating: 0
        },
        {
            id: "p8",
            name: "Nước Suối Aquafina",
            price: 10000,
            description: "Chai nước tinh khiết 500ml.",
            imageUrl: "images/nuoc-suoi.jpg",
            category: "drink",
            ratings: [],
            avgRating: 0
        },
        {
            id: "p9",
            name: "Trà Đào",
            price: 35000,
            description: "Ly trà đào thanh mát với những miếng đào giòn ngọt.",
            imageUrl: "images/tra-dao.jpg",
            category: "drink",
            ratings: [],
            avgRating: 0
        }
    ],
    users: [
        { id: 'u1', username: 'admin', password: '123', role: 'admin' },
        { id: 'u2', username: 'khachhang', password: '123', role: 'customer' }
    ]
};