// 价格计算器相关JavaScript文件

document.addEventListener('DOMContentLoaded', function() {
    // 计算按钮事件
    const calculateBtn = document.getElementById('calculate');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculatePrice123);
    }
    
    // 输入框的输入事件，实时更新计算结果
    const priceInput = document.getElementById('calc-price');
    const quantityInput = document.getElementById('calc-quantity');
    const discountInput = document.getElementById('calc-discount');
    
    const inputs = [priceInput, quantityInput, discountInput];
    
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', calculatePrice123);
        }
    });
    
    // 推荐资源加载
    loadRecommendedResources123();
});

// 计算价格
function calculatePrice123() {
    // 获取输入值
    const price = parseFloat(document.getElementById('calc-price').value) || 0;
    const quantity = parseInt(document.getElementById('calc-quantity').value) || 1;
    const discount = parseFloat(document.getElementById('calc-discount').value) || 0;
    
    // 计算结果
    const originalPrice = price * quantity;
    const discountAmount = originalPrice * (discount / 100);
    const finalPrice = originalPrice - discountAmount;
    
    // 更新显示
    document.getElementById('original-price').textContent = `$${originalPrice.toFixed(2)}`;
    document.getElementById('discount-amount').textContent = `$${discountAmount.toFixed(2)}`;
    document.getElementById('final-price').textContent = `$${finalPrice.toFixed(2)}`;
}

// 加载推荐资源
function loadRecommendedResources123() {
    const container = document.getElementById('recommended-resources');
    if (!container) return;
    
    // 从localStorage获取资源数据
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    
    // 如果没有资源数据，尝试加载
    if (resources.length === 0) {
        if (typeof initResources123 === 'function') {
            initResources123(); // 尝试从resources.js调用初始化函数
            return; // 初始化后会重新加载页面，所以不需要继续
        }
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 随机选择3个资源作为推荐
    let recommendedItems = [];
    
    if (resources.length <= 3) {
        recommendedItems = [...resources];
    } else {
        // 获取购物车中的资源ID，避免推荐已在购物车中的资源
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartResourceIds = cart.map(item => item.resourceId);
        
        // 过滤掉购物车中已有的资源
        const availableResources = resources.filter(
            resource => !cartResourceIds.includes(resource.id)
        );
        
        // 如果过滤后的资源少于3个，就使用全部
        if (availableResources.length <= 3) {
            recommendedItems = [...availableResources];
        } else {
            // 随机选择3个
            const shuffled = [...availableResources].sort(() => 0.5 - Math.random());
            recommendedItems = shuffled.slice(0, 3);
        }
    }
    
    // 显示推荐资源
    recommendedItems.forEach(resource => {
        const resourceCard = document.createElement('div');
        resourceCard.className = 'resource-card mini';
        
        resourceCard.innerHTML = `
            <div class="resource-image">
                <img src="${resource.image}" alt="${resource.name}" onerror="this.src='img/placeholder.jpg'">
            </div>
            <div class="resource-info">
                <h3>${resource.name}</h3>
                <p class="resource-price">$${resource.price.toFixed(2)}</p>
                <button class="btn add-to-cart" data-id="${resource.id}">添加到购物车</button>
            </div>
        `;
        
        container.appendChild(resourceCard);
    });
    
    // 添加"添加到购物车"按钮事件
    const addToCartButtons = container.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const resourceId = this.getAttribute('data-id');
            if (typeof addToCart123 === 'function') {
                addToCart123(resourceId, 1);
            } else {
                alert('添加到购物车功能暂不可用');
            }
        });
    });
} 