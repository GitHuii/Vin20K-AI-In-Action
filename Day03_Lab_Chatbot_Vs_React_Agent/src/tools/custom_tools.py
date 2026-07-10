import json

def check_stock(item_name: str) -> str:
    """
    Kiểm tra số lượng tồn kho, giá bán và trọng lượng của sản phẩm.
    Args:
        item_name (str): Tên sản phẩm cần tra cứu (ví dụ: 'iPhone', 'iPad', 'MacBook').
    Returns:
        str: Chuỗi JSON chứa trạng thái, tên sản phẩm, giá bán (VND), tồn kho, và trọng lượng (kg).
    """
    item_lower = item_name.lower().strip()
    # Danh mục sản phẩm giả lập
    db = {
        "iphone": {"price": 25000000, "stock": 5, "weight_kg": 0.2},
        "ipad": {"price": 18000000, "stock": 3, "weight_kg": 0.5},
        "macbook": {"price": 35000000, "stock": 2, "weight_kg": 1.5}
    }
    
    # Tìm kiếm sản phẩm phù hợp
    for key, info in db.items():
        if key in item_lower:
            return json.dumps({
                "status": "success",
                "item": item_name,
                "price_vnd": info["price"],
                "stock": info["stock"],
                "weight_kg": info["weight_kg"]
            })
            
    return json.dumps({
        "status": "error",
        "message": f"Sản phẩm '{item_name}' không tìm thấy trong hệ thống."
    })

def get_discount(coupon_code: str) -> str:
    """
    Lấy thông tin phần trăm giảm giá dựa vào mã giảm giá (coupon code).
    Args:
        coupon_code (str): Mã giảm giá (ví dụ: 'WINNER', 'WELCOME').
    Returns:
        str: Chuỗi JSON chứa mã giảm giá và phần trăm giảm giá tương ứng.
    """
    code_upper = coupon_code.upper().strip().replace("'", "").replace('"', '')
    # Danh sách coupon giả lập
    coupons = {
        "WINNER": {"discount_percent": 15, "description": "Giảm 15% tổng giá trị đơn hàng"},
        "WELCOME": {"discount_percent": 10, "description": "Giảm 10% cho khách hàng mới"}
    }
    
    if code_upper in coupons:
        return json.dumps({
            "status": "success",
            "coupon": code_upper,
            "discount_percent": coupons[code_upper]["discount_percent"],
            "description": coupons[code_upper]["description"]
        })
        
    return json.dumps({
        "status": "success",
        "coupon": coupon_code,
        "discount_percent": 0,
        "description": "Mã giảm giá không hợp lệ hoặc đã hết hạn"
    })

def calc_shipping(weight_kg: float, destination: str) -> str:
    """
    Tính toán chi phí vận chuyển dựa trên tổng trọng lượng đơn hàng và địa điểm giao hàng.
    Args:
        weight_kg (float): Tổng trọng lượng của đơn hàng (kg).
        destination (str): Địa điểm giao hàng (ví dụ: 'Hà Nội', 'Hồ Chí Minh').
    Returns:
        str: Chuỗi JSON chứa địa điểm, trọng lượng và chi phí vận chuyển tính toán (VND).
    """
    dest_lower = destination.lower().strip().replace("'", "").replace('"', '')
    
    # Logic tính phí ship giả lập
    # Phí cơ bản: 20,000 VND cho mỗi kg
    base_rate_per_kg = 20000
    
    # Phí khu vực cố định
    if "ha noi" in dest_lower or "hanoi" in dest_lower or "hà nội" in dest_lower:
        region_fee = 10000  # Khu vực nội thành Hà Nội phí rẻ
    elif "ho chi minh" in dest_lower or "hcm" in dest_lower or "sài gòn" in dest_lower:
        region_fee = 30000
    else:
        region_fee = 50000  # Các khu vực khác
        
    shipping_cost = int(weight_kg * base_rate_per_kg) + region_fee
    
    return json.dumps({
        "status": "success",
        "destination": destination,
        "weight_kg": weight_kg,
        "shipping_cost_vnd": shipping_cost
    })

# Cung cấp danh mục mô tả công cụ cho Agent biết cách sử dụng
TOOLS_MANIFEST = [
    {
        "name": "check_stock",
        "description": "Kiểm tra tồn kho, giá bán và trọng lượng sản phẩm. Đầu vào: item_name (chuỗi tên sản phẩm, ví dụ: 'iPhone').",
        "func": check_stock
    },
    {
        "name": "get_discount",
        "description": "Tra cứu mã giảm giá xem được giảm bao nhiêu phần trăm. Đầu vào: coupon_code (chuỗi mã giảm giá, ví dụ: 'WINNER').",
        "func": get_discount
    },
    {
        "name": "calc_shipping",
        "description": "Tính toán chi phí giao hàng. Đầu vào: weight_kg (số thực, tổng trọng lượng sản phẩm) và destination (chuỗi địa điểm nhận hàng, ví dụ: 'Hà Nội').",
        "func": calc_shipping
    }
]
