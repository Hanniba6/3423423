// 退出登录相关JavaScript文件

document.addEventListener('DOMContentLoaded', function() {
    // 显示当前登录用户
    displayCurrentUser123();
    
    // 退出登录按钮事件
    const logoutBtn = document.getElementById('logout-confirm');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', confirmLogout123);
    }
    
    // 返回按钮事件
    const backBtn = document.getElementById('back-button');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }
    
    // 下载订单历史按钮事件
    const downloadOrdersBtn = document.getElementById('download-orders');
    if (downloadOrdersBtn) {
        downloadOrdersBtn.addEventListener('click', downloadOrderHistory123);
    }
});

// 显示当前登录用户
function displayCurrentUser123() {
    const userDisplay = document.getElementById('current-user');
    if (!userDisplay) return;
    
    // 获取当前用户
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        userDisplay.textContent = currentUser.username;
    } else {
        // 如果没有登录，重定向到首页
        window.location.href = 'index.html';
    }
}

// 确认退出登录
function confirmLogout123() {
    // 清除用户数据
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('isLoggedIn');
    
    // 显示退出成功信息
    const logoutContainer = document.getElementById('logout-container');
    const logoutSuccessContainer = document.getElementById('logout-success');
    
    if (logoutContainer && logoutSuccessContainer) {
        logoutContainer.style.display = 'none';
        logoutSuccessContainer.style.display = 'block';
        
        // 3秒后重定向到首页
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 3000);
    } else {
        // 如果找不到容器，直接重定向
        window.location.href = 'index.html';
    }
}

// 下载订单历史
function downloadOrderHistory123() {
    // 获取当前用户
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('未找到用户信息!');
        return;
    }
    
    // 获取订单数据
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // 筛选当前用户的订单
    const userOrders = orders.filter(order => order.username === currentUser.username);
    
    if (userOrders.length === 0) {
        alert('您还没有订单记录!');
        return;
    }
    
    // 创建导出数据
    const exportData = {
        user: {
            username: currentUser.username,
            email: currentUser.email
        },
        orders: userOrders,
        exportDate: new Date().toISOString()
    };
    
    // 转换为JSON字符串
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // 创建Blob和下载链接
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // 创建下载链接
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${currentUser.username}_${new Date().toISOString().slice(0, 10)}.json`;
    
    // 添加到页面，点击并移除
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // 释放URL
    URL.revokeObjectURL(url);
    
    alert('订单历史已成功下载!');
} 