// fixAddProductModal.js file code (updated):

document.addEventListener('DOMContentLoaded', () => {
    const addProductModal = document.getElementById('addProductModal');
    const closeAddModalBtn = document.getElementById('closeAddModal');
    const productCategoryInput = document.getElementById('productCategory');
    const productImageSelect = document.getElementById('productImage');

    // Fix Close button for Add Product Modal
    closeAddModalBtn.addEventListener('click', () => {
        addProductModal.classList.remove('show');
    });

    // Fix Image dropdown population
    productCategoryInput.addEventListener('change', () => {
        const cat = productCategoryInput.value.toUpperCase();
        const symbols = [...new Set(bakeryProducts.filter(p => p.category === cat).map(p => p.image))];
        productImageSelect.innerHTML = '<option value="">Select a symbol</option>';
        if (symbols.length > 0) {
            productImageSelect.innerHTML += symbols.map(s => `<option value="${s}">${s}</option>`).join('');
        } else {
            // Fallback symbols if no specific symbols are found for the category
            const defaultSymbols = ['🍰', '🎂', '🧁', '🍪', '🍩', '🥐', '🍫', '🍓', '🍇', '🥤'];
            productImageSelect.innerHTML += defaultSymbols.map(s => `<option value="${s}">${s}</option>`).join('');
        }
        productImageSelect.disabled = false; // Ensure dropdown is enabled
    });

    // Ensure modal closes when clicking outside
    addProductModal.addEventListener('click', (e) => {
        if (e.target === addProductModal) {
            addProductModal.classList.remove('show');
        }
    });
});

// fixAddProductModal.js
document.getElementById('addProductForm').addEventListener('submit', function (e) {
    // Prevent default form submission to avoid duplicate handling (since main script already handles it)
    e.preventDefault();

    // Get form values
    const newId = bakeryProducts.length + 1;
    const newProduct = {
        id: newId,
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value.toUpperCase(),
        sku: document.getElementById('productCode').value,
        image: document.getElementById('productImage').value,
        type: document.getElementById('productCategory').value.toUpperCase()
    };

    // Add the new product to the bakeryProducts array
    bakeryProducts.push(newProduct);

    // Reset the search input and category filter to ensure all products are shown
    document.getElementById('productSearch').value = ''; // Clear search term
    currentCategory = 'all'; // Reset category to 'all'

    // Update category buttons UI to reflect 'all' as active
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-primary', 'text-dark');
        btn.classList.add('bg-gray-200', 'text-gray-700');
        if (btn.dataset.category === 'all') {
            btn.classList.add('active', 'bg-primary', 'text-dark');
            btn.classList.remove('bg-gray-200', 'text-gray-700');
        }
    });

    // Refresh product display
    displayProducts(bakeryProducts);

    // Close the modal
    document.getElementById('addProductModal').classList.remove('show');

    // Reset the form
    e.target.reset();

    // Show success notification
    Toastify({
        text: 'Product added successfully!',
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#059669', // Green for success
        stopOnFocus: true
    }).showToast();
});


// fixPrintReceipt.js

// Function to calculate height in mm
function getHeightInMM(element) {
    const heightPx = element.offsetHeight;
    const dpi = 96; // Standard screen DPI, approximate for print
    const heightInches = heightPx / dpi;
    const heightMM = heightInches * 25.4;
    return Math.ceil(heightMM); // Round up to avoid truncation
}

// ----------------Override the print receipt button to dynamically set @page height
document.getElementById('printReceiptBtn').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default behavior

    // Get the receipt content element
    const receiptContent = document.getElementById('receiptContent');

    // Clone the receipt content to measure its height offscreen
    const clone = receiptContent.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.width = '80mm'; // Match thermal printer width
    clone.style.visibility = 'hidden';
    clone.style.fontSize = '12px'; // Match receipt-print font size
    clone.style.padding = '8mm'; // Adjusted padding for balance
    clone.style.boxSizing = 'border-box';
    // Apply styles to clone to match print spacing
    clone.style.lineHeight = '1.6'; // Slightly increased line-height for readability
    const cloneChildren = clone.querySelectorAll('p, div');
    cloneChildren.forEach(child => {
        child.style.marginBottom = '2mm'; // Balanced margin
    });
    document.body.appendChild(clone);

    // Calculate height in mm, add buffer for padding/margins
    let contentHeightMM = getHeightInMM(clone);
    contentHeightMM += 15; // Balanced buffer for thermal printer

    // Remove the clone
    document.body.removeChild(clone);

    // Create or update a style tag for dynamic @page
    let printStyle = document.getElementById('dynamicPrintStyle');
    if (!printStyle) {
        printStyle = document.createElement('style');
        printStyle.id = 'dynamicPrintStyle';
        document.head.appendChild(printStyle);
    }
    printStyle.innerHTML = `
        @media print {
            @page {
                size: 80mm ${contentHeightMM}mm !important;
                margin: 0 !important;
            }
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                height: ${contentHeightMM}mm !important;
                width: 80mm !important;
                overflow: hidden !important;
            }
            body * {
                visibility: hidden !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            #printArea, #printArea * {
                visibility: visible !important;
            }
            #printArea {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 80mm !important;
                height: ${contentHeightMM}mm !important;
                margin: 0 !important;
                padding: 8mm 8mm 8mm 8mm !important; /* Balanced padding */
                box-sizing: border-box !important;
                overflow: hidden !important;
                page-break-after: avoid !important;
                page-break-before: avoid !important;
                break-after: avoid !important;
                break-before: avoid !important;
            }
            .receipt-print {
                margin-left: 0 !important; /* Remove ml-11 */
                font-size: 12px !important;
                font-weight: 700 !important; /* Increased font-weight for boldness */
                color: #000000 !important; /* High contrast black for clarity */
                width: 80mm !important;
                box-sizing: border-box !important;
            }
            p, div {
                margin-bottom: 2mm !important; /* Balanced spacing between elements */
                line-height: 1.6 !important; /* Improved readability */
                padding: 0 !important;
                font-weight: 700 !important; /* Ensure all text is bold */
                color: #000000 !important; /* Ensure high contrast */
            }
            h2, h3 {
                font-weight: 900 !important; /* Extra bold for headings */
                color: #000000 !important; /* High contrast black */
            }
            .border-t, .border-b {
                margin: 3mm 0 !important; /* Balanced spacing around borders */
                border-color: #000000 !important; /* Darker border for visibility */
            }
            .text-center {
                margin-bottom: 3mm !important; /* Balanced spacing for header */
            }
            /* Prevent any page breaks within content */
            * {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
        }
    `;

    // Set printArea content and print
    const printArea = document.getElementById('printArea');
    printArea.innerHTML = receiptContent.innerHTML;
    printArea.style.display = 'block';
    window.print();
    printArea.style.display = 'none';

    // Show success notification
    Toastify({
        text: 'Receipt printed successfully!',
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#059669', // Green for success
        stopOnFocus: true
    }).showToast();
});

// Override the print receipt button to dynamically set @page height
// document.getElementById('printReceiptBtn').addEventListener('click', function (e) {
//     e.preventDefault(); // Prevent default behavior

//     // Get the receipt content element
//     const receiptContent = document.getElementById('receiptContent');

//     // Clone the receipt content to measure its height offscreen
//     const clone = receiptContent.cloneNode(true);
//     clone.style.position = 'absolute';
//     clone.style.left = '-9999px';
//     clone.style.width = '80mm'; // Match thermal printer width
//     clone.style.visibility = 'hidden';
//     clone.style.fontSize = '12px'; // Match receipt-print font size
//     clone.style.padding = '8mm'; // Adjusted padding for balance
//     clone.style.boxSizing = 'border-box';
//     // Apply styles to clone to match print spacing
//     clone.style.lineHeight = '1.6'; // Slightly increased line-height for readability
//     const cloneChildren = clone.querySelectorAll('p, div');
//     cloneChildren.forEach(child => {
//         child.style.marginBottom = '2mm'; // Balanced margin
//     });
//     document.body.appendChild(clone);

//     // Calculate height in mm, add buffer for padding/margins
//     let contentHeightMM = getHeightInMM(clone);
//     contentHeightMM += 15; // Balanced buffer for thermal printer

//     // Remove the clone
//     document.body.removeChild(clone);

//     // Create or update a style tag for dynamic @page
//     let printStyle = document.getElementById('dynamicPrintStyle');
//     if (!printStyle) {
//         printStyle = document.createElement('style');
//         printStyle.id = 'dynamicPrintStyle';
//         document.head.appendChild(printStyle);
//     }
//     printStyle.innerHTML = `
//         @media print {
//             @page {
//                 size: 80mm ${contentHeightMM}mm !important;
//                 margin: 0 !important;
//             }
//             html, body {
//                 margin: 0 !important;
//                 padding: 0 !important;
//                 height: ${contentHeightMM}mm !important;
//                 width: 80mm !important;
//                 overflow: hidden !important;
//             }
//             body * {
//                 visibility: hidden !important;
//                 margin: 0 !important;
//                 padding: 0 !important;
//             }
//             #printArea, #printArea * {
//                 visibility: visible !important;
//             }
//             #printArea {
//                 position: absolute !important;
//                 top: 0 !important;
//                 left: 0 !important;
//                 width: 80mm !important;
//                 height: ${contentHeightMM}mm !important;
//                 margin: 0 !important;
//                 padding: 8mm 8mm 8mm 8mm !important; /* Balanced padding */
//                 box-sizing: border-box !important;
//                 overflow: hidden !important;
//                 page-break-after: avoid !important;
//                 page-break-before: avoid !important;
//                 break-after: avoid !important;
//                 break-before: avoid !important;
//             }
//             .receipt-print {
//                 margin-left: 0 !important; /* Remove ml-11 */
//                 font-size: 12px !important;
//                 width: 80mm !important;
//                 box-sizing: border-box !important;
//             }
//             p, div {
//                 margin-bottom: 2mm !important; /* Balanced spacing between elements */
//                 line-height: 1.6 !important; /* Improved readability */
//                 padding: 0 !important;
//             }
//             .border-t, .border-b {
//                 margin: 3mm 0 !important; /* Balanced spacing around borders */
//             }
//             .text-center {
//                 margin-bottom: 3mm !important; /* Balanced spacing for header */
//             }
//             /* Prevent any page breaks within content */
//             * {
//                 page-break-inside: avoid !important;
//                 break-inside: avoid !important;
//             }
//         }
//     `;

//     // Set printArea content and print
//     const printArea = document.getElementById('printArea');
//     printArea.innerHTML = receiptContent.innerHTML;
//     printArea.style.display = 'block';
//     window.print();
//     printArea.style.display = 'none';

//     // Show success notification
//     Toastify({
//         text: 'Receipt printed successfully!',
//         duration: 3000,
//         gravity: 'top',
//         position: 'right',
//         backgroundColor: '#059669', // Green for success
//         stopOnFocus: true
//     }).showToast();
// });