/* ======================================================
   نسخه پشتیبان داده‌های فایل data/products.json
   ------------------------------------------------------
   این فایل فقط برای زمانی است که صفحه بدون وب‌سرور (با پروتکل
   file://) باز شود و مرورگر اجازه fetch روی فایل محلی را ندهد.
   محتوای آن دقیقاً همان محتوای فایل JSON است.
   ====================================================== */

var PRODUCTS_FALLBACK = {
    "product_groups": [{
            "group_id":1,
            "group_title": "ساندویچ",
            "group_image": "images/burger-7-310x260.png",
            "group_products": [{
                    "product_id":1,
                    "product_name": "ژامبون مرغ تنوری",
                    "product_price": 165000,
                    "product_image": "a1.jpg",
                    "product_content": [
                        "ژامبون مرغ",
                        "قارچ",
                        "پنیر",
                        "سس مخصوص"
                    ]
                },
                {
                    "product_id":2,
                    "product_name": "هات داگ مخصوص",
                    "product_price": 145000,
                    "product_image": "a2.jpg",
                    "product_content": [
                        "هات داگ",
                        "قارچ",
                        "پنیر",
                        "کاهو",
                        "خیارشور",
                        "گوجه"
                    ]
                },
                {
                    "product_id":3,
                    "product_name": "چیز برگر",
                    "product_price": 176000,
                    "product_image": "a3.jpg",
                    "product_content": [
                        "همبرگر90 درصد",
                        "پنیر گودا",
                        "سس مخصوص",
                        "گوجه"
                    ]
                },
                {
                    "product_id":4,                    
                    "product_name": "رویال برگر",
                    "product_price": 193000,
                    "product_image": "a4.jpg",
                    "product_content": [
                        "همبرگر 90 درصد",
                        "ژامبون گوشت",
                        "قارچ",
                        "پنیر"
                    ]
                }
            ]
        },
        {
            "group_id":2,
            "group_title": "پیتزا",
            "group_image": "images/pizza-7-310x260.png",
            "group_products": [{
                "product_id":5,                
                "product_name": "پیتزا فیله مرغ",
                "product_price": 165000,
                "product_image": "b1.jpg",
                "product_content": [
                    "فیله مرغ",
                    "قارچ",
                    "فلفل دلمه",
                    "پنیر",
                    "گوجه",
                    "ذرت"
                ]
            }, {
                "product_id":6,                
                "product_name": "پیتزا پنجره ای مخصوص",
                "product_price": 185000,
                "product_image": "b2.jpg",
                "product_content": [
                    "ژامبون بره",
                    "قارچ",
                    "پنیر",
                    "گوشت چرخ کرده",
                    "فلفل دلمه"
                ]
            }, {
                "product_id":7,                
                "product_name": "پیتزا پپرونی",
                "product_price": 173000,
                "product_image": "b3.jpg",
                "product_content": [
                    "کالباس پپرونی",
                    "قارچ",
                    "پنیر",
                    "فلفل دلمه"
                ]
            }]
        },
        {
            "group_id":3,
            "group_title": "کباب",
            "group_image": "images/barbecue-7-310x260.png",
            "group_products": [{
                "product_id":8,                
                "product_name": "کوبیده",
                "product_price": 110000,
                "product_image": "c1.jpg",
                "product_content": [
                    "گوشت چرخ کرده",
                    "پیاز",
                    "نمک",
                    "جوش شیرین"
                ]
            }, {
                "product_id":9,                
                "product_name": "برگ",
                "product_price": 175,
                "product_image": "c2.jpg",
                "product_content": [
                    "گوشت گوسفندی",
                    "نمک",
                    "آبلیمو"
                ]
            }]
        }
        
    ]
};
