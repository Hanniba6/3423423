// Export functionality
document.addEventListener('DOMContentLoaded', function() {
    const exportCartBtn = document.getElementById('export-cart');
    const viewExportHistoryBtn = document.getElementById('view-export-history');
    const exportHistorySection = document.querySelector('.export-history-section');

    if (exportCartBtn) {
        exportCartBtn.addEventListener('click', exportCartToCSV);
    }

    if (viewExportHistoryBtn) {
        viewExportHistoryBtn.addEventListener('click', toggleExportHistory);
    }

    // Function to export cart to CSV
    function exportCartToCSV() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const courses = JSON.parse(localStorage.getItem('courses') || '[]');
        
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Prepare data for export
        const headers = ['Course Name', 'Quantity', 'Unit Price', 'Total Price', 'Date Added'];
        const exportData = cart.map(item => {
            const course = courses.find(c => c.id === item.courseId);
            return [
                course ? course.name : 'Unknown Course',
                item.quantity,
                course ? course.price : 0,
                course ? (course.price * item.quantity) : 0,
                new Date(item.dateAdded).toLocaleDateString()
            ];
        });

        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...exportData.map(row => row.join(','))
        ].join('\n');

        // Create and download file
        const fileName = `cart_export_${new Date().toISOString().split('T')[0]}.csv`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        // Save export record
        saveExportRecord(fileName);
    }

    // Function to save export record
    function saveExportRecord(fileName) {
        const exportHistory = JSON.parse(localStorage.getItem('exportHistory') || '[]');
        exportHistory.push({
            fileName: fileName,
            date: new Date().toISOString(),
            itemCount: JSON.parse(localStorage.getItem('cart') || '[]').length
        });
        localStorage.setItem('exportHistory', JSON.stringify(exportHistory));
    }

    // Function to toggle export history view
    function toggleExportHistory() {
        const exportHistory = JSON.parse(localStorage.getItem('exportHistory') || '[]');
        const exportHistoryList = document.getElementById('export-history-list');
        
        if (exportHistorySection.style.display === 'none') {
            // Show history
            exportHistorySection.style.display = 'block';
            
            // Generate history HTML
            exportHistoryList.innerHTML = exportHistory.length > 0 
                ? exportHistory.map(record => `
                    <div class="export-record">
                        <p>File: ${record.fileName}</p>
                        <p>Date: ${new Date(record.date).toLocaleString()}</p>
                        <p>Items Exported: ${record.itemCount}</p>
                    </div>
                `).join('')
                : '<p>No export history available</p>';
        } else {
            // Hide history
            exportHistorySection.style.display = 'none';
        }
    }
}); 