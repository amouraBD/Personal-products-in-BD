/* =====================================================
   PERSONAL PRODUCT IN BD
   REAL ADMIN PANEL - PHP + MYSQL API
===================================================== */

const API = "api.php";


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active-page");
    }

    const titles = {
        dashboard: "Dashboard",
        products: "Products",
        categories: "Categories",
        orders: "Orders",
        customers: "Customers",
        stock: "Stock Management",
        sales: "Sales Report"
    };

    const title = document.getElementById("pageTitle");

    if (title) {
        title.innerText = titles[pageId] || "Admin Panel";
    }

    document.querySelectorAll(".menu").forEach(menu => {
        menu.classList.remove("active");
    });

    document.querySelectorAll(".menu").forEach(menu => {

        const clickCode = menu.getAttribute("onclick");

        if (
            clickCode &&
            clickCode.includes("'" + pageId + "'")
        ) {
            menu.classList.add("active");
        }

    });

    document
        .getElementById("sidebar")
        ?.classList.remove("open");


    /* Load required data */

    if (pageId === "dashboard") {
        loadDashboard();
    }

    if (pageId === "products") {
        loadProducts();
        loadCategories();
    }

    if (pageId === "categories") {
        loadCategories();
    }

    if (pageId === "orders") {
        loadOrders();
    }
}


/* =====================================================
   MOBILE SIDEBAR
===================================================== */

function toggleSidebar() {

    document
        .getElementById("sidebar")
        ?.classList.toggle("open");

}


/* =====================================================
   API REQUEST
===================================================== */

async function apiRequest(
    action,
    method = "GET",
    data = null
) {

    try {

        let url = `${API}?action=${action}`;

        const options = {
            method: method
        };


        if (method === "POST") {

            const formData = new FormData();

            for (const key in data) {
                formData.append(
                    key,
                    data[key]
                );
            }

            options.body = formData;
        }


        const response =
            await fetch(url, options);


        if (!response.ok) {
            throw new Error(
                "Server error: " +
                response.status
            );
        }


        return await response.json();

    }

    catch (error) {

        console.error(error);

        alert(
            "Server/Database connection error.\n\n" +
            error.message
        );

        return {
            success: false
        };

    }

}


/* =====================================================
   DASHBOARD
===================================================== */

async function loadDashboard() {

    const result =
        await apiRequest("dashboard");


    if (!result.success) {
        return;
    }


    const data = result.data;


    const totalProducts =
        document.getElementById(
            "totalProducts"
        );

    const totalOrders =
        document.getElementById(
            "totalOrders"
        );


    if (totalProducts) {
        totalProducts.innerText =
            data.products;
    }


    if (totalOrders) {
        totalOrders.innerText =
            data.orders;
    }


    /* Sales */

    const salesElements =
        document.querySelectorAll(
            ".stat-card"
        );


    if (
        salesElements[2]
    ) {

        const salesNumber =
            salesElements[2]
                .querySelector("h2");

        if (salesNumber) {

            salesNumber.innerText =
                "৳ " +
                Number(
                    data.sales
                ).toLocaleString(
                    "en-BD"
                );

        }

    }


    /* Customer */

    if (
        salesElements[3]
    ) {

        const customerNumber =
            salesElements[3]
                .querySelector("h2");

        if (customerNumber) {

            customerNumber.innerText =
                data.customers;

        }

    }

}


/* =====================================================
   LOAD CATEGORIES
===================================================== */

async function loadCategories() {

    const result =
        await apiRequest(
            "categories"
        );


    if (!result.success) {
        return;
    }


    window.categories =
        result.data;


    populateCategorySelect(
        result.data
    );


    renderCategories(
        result.data
    );

}


/* =====================================================
   CATEGORY SELECT
===================================================== */

function populateCategorySelect(
    categories
) {

    const select =
        document.getElementById(
            "productCategory"
        );


    if (!select) {
        return;
    }


    select.innerHTML =
        `<option value="">
            Select Category
        </option>`;


    categories.forEach(category => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            category.id;

        option.textContent =
            category.icon +
            " " +
            category.name;

        select.appendChild(
            option
        );

    });

}


/* =====================================================
   RENDER CATEGORY ADMIN
===================================================== */

function renderCategories(
    categories
) {

    const container =
        document.querySelector(
            ".category-admin-grid"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    categories.forEach(category => {

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "category-admin-card";


        card.innerHTML = `

            <span>
                ${category.icon || "📦"}
            </span>

            <h3>
                ${escapeHtml(
                    category.name
                )}
            </h3>

            <p>
                Category ID:
                ${category.id}
            </p>

            <button
                onclick="editCategory(${category.id})">
                Edit
            </button>

        `;


        container.appendChild(
            card
        );

    });

}


/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadProducts() {

    const result =
        await apiRequest(
            "products"
        );


    if (!result.success) {
        return;
    }


    window.products =
        result.data;


    renderProducts(
        result.data
    );

}


/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts(
    products
) {

    const tbody =
        document.querySelector(
            "#productTable tbody"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    if (products.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="text-align:center;padding:40px;"
                >
                    No products found.
                </td>
            </tr>
        `;

        return;
    }


    products.forEach(product => {

        const tr =
            document.createElement(
                "tr"
            );


        const stock =
            Number(
                product.stock
            );


        let stockStatus =
            "Active";


        let stockClass =
            "delivered";


        if (stock <= 0) {

            stockStatus =
                "Out of Stock";

            stockClass =
                "pending";

        }

        else if (stock <= 10) {

            stockStatus =
                "Low Stock";

            stockClass =
                "pending";

        }


        tr.innerHTML = `

            <td>

                <div class="product-name">

                    <div class="product-img">

                        ${
                            product.image
                            ? `<img
                                src="${escapeAttribute(
                                    product.image
                                )}"
                                style="
                                width:100%;
                                height:100%;
                                object-fit:cover;
                                border-radius:8px;
                                "
                              >`
                            : "📦"
                        }

                    </div>

                    <div>

                        <strong>
                            ${escapeHtml(
                                product.name
                            )}
                        </strong>

                        <small>
                            SKU:
                            ${escapeHtml(
                                product.sku || "-"
                            )}
                        </small>

                    </div>

                </div>

            </td>


            <td>
                ${escapeHtml(
                    product.category_name ||
                    "Uncategorized"
                )}
            </td>


            <td>
                ৳ ${Number(
                    product.price
                ).toLocaleString("en-BD")}
            </td>


            <td>
                ${stock}
            </td>


            <td>

                <span
                    class="status ${stockClass}"
                >
                    ${stockStatus}
                </span>

            </td>


            <td>

                <button
                    class="action edit"
                    onclick="editProduct(${product.id})"
                >
                    ✏️
                </button>


                <button
                    class="action delete"
                    onclick="deleteProduct(${product.id})"
                >
                    🗑️
                </button>

            </td>

        `;


        tbody.appendChild(
            tr
        );

    });

}


/* =====================================================
   SEARCH PRODUCTS
===================================================== */

function searchProducts() {

    const input =
        document
            .getElementById(
                "productSearch"
            )
            ?.value
            .toLowerCase()
            .trim();


    if (!window.products) {
        return;
    }


    const filtered =
        window.products.filter(
            product => {

                return (

                    product.name
                        .toLowerCase()
                        .includes(input)

                    ||

                    (
                        product.sku || ""
                    )
                        .toLowerCase()
                        .includes(input)

                    ||

                    (
                        product.category_name || ""
                    )
                        .toLowerCase()
                        .includes(input)

                );

            }
        );


    renderProducts(
        filtered
    );

}


/* =====================================================
   FILTER PRODUCTS
===================================================== */

function filterProducts() {

    const filter =
        document
            .getElementById(
                "categoryFilter"
            )
            ?.value
            .toLowerCase();


    if (!window.products) {
        return;
    }


    if (
        !filter ||
        filter === "all"
    ) {

        renderProducts(
            window.products
        );

        return;

    }


    const filtered =
        window.products.filter(
            product => {

                return (
                    (
                        product.category_name ||
                        ""
                    ).toLowerCase() ===
                    filter
                );

            }
        );


    renderProducts(
        filtered
    );

}


/* =====================================================
   PRODUCT MODAL
===================================================== */

function openProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


function closeProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =====================================================
   ADD PRODUCT
===================================================== */

async function saveProduct(
    event
) {

    event.preventDefault();


    const name =
        document.getElementById(
            "productName"
        ).value.trim();


    const category =
        document.getElementById(
            "productCategory"
        ).value;


    const price =
        document.getElementById(
            "productPrice"
        ).value;


    const stock =
        document.getElementById(
            "productStock"
        ).value;


    const sku =
        document.getElementById(
            "productSku"
        ).value.trim();


    const image =
        document.querySelector(
            '.form-group input[placeholder*="image"]'
        )?.value || "";


    const description =
        document.querySelector(
            ".form-group textarea"
        )?.value || "";


    if (!name) {

        alert(
            "Please enter product name."
        );

        return;

    }


    if (!category) {

        alert(
            "Please select category."
        );

        return;

    }


    if (
        price === "" ||
        Number(price) < 0
    ) {

        alert(
            "Please enter valid price."
        );

        return;

    }


    if (
        stock === "" ||
        Number(stock) < 0
    ) {

        alert(
            "Please enter valid stock."
        );

        return;

    }


    const result =
        await apiRequest(
            "add_product",
            "POST",
            {

                name:
                    name,

                category_id:
                    category,

                sku:
                    sku,

                price:
                    price,

                old_price:
                    0,

                stock:
                    stock,

                image:
                    image,

                description:
                    description

            }
        );


    if (result.success) {

        alert(
            "✅ Product added successfully!"
        );


        event.target.reset();

        closeProductModal();

        await loadProducts();

        await loadDashboard();

    }

}


/* =====================================================
   DELETE PRODUCT
===================================================== */

async function deleteProduct(
    id
) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmDelete) {
        return;
    }


    const result =
        await apiRequest(
            "delete_product",
            "POST",
            {
                id: id
            }
        );


    if (result.success) {

        alert(
            "✅ Product deleted successfully!"
        );


        await loadProducts();

        await loadDashboard();

    }

}


/* =====================================================
   EDIT PRODUCT
===================================================== */

function editProduct(
    id
) {

    const product =
        window.products?.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!product) {
        return;
    }


    alert(
        "Edit system is ready for the next update.\n\n" +
        "Product: " +
        product.name
    );

}


/* =====================================================
   LOAD ORDERS
===================================================== */

async function loadOrders() {

    const result =
        await apiRequest(
            "orders"
        );


    if (!result.success) {
        return;
    }


    window.orders =
        result.data;


    renderOrders(
        result.data
    );

}


/* =====================================================
   RENDER ORDERS
===================================================== */

function renderOrders(
    orders
) {

    const tables =
        document.querySelectorAll(
            "#orders table tbody"
        );


    if (!tables.length) {
        return;
    }


    const tbody =
        tables[0];


    tbody.innerHTML = "";


    if (orders.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="text-align:center;padding:40px;"
                >
                    No orders found.
                </td>
            </tr>
        `;

        return;

    }


    orders.forEach(order => {

        const tr =
            document.createElement(
                "tr"
            );


        const status =
            order.status;


        let statusClass =
            "pending";


        if (
            status === "Confirmed"
        ) {
            statusClass =
                "confirmed";
        }

        if (
            status === "Processing"
        ) {
            statusClass =
                "confirmed";
        }

        if (
            status === "Shipped"
        ) {
            statusClass =
                "shipped";
        }

        if (
            status === "Delivered"
        ) {
            statusClass =
                "delivered";
        }


        tr.innerHTML = `

            <td>
                #PP${String(
                    order.id
                ).padStart(4,"0")}
            </td>


            <td>
                ${escapeHtml(
                    order.customer_name ||
                    "Guest"
                )}
            </td>


            <td>
                ${escapeHtml(
                    order.customer_phone ||
                    "-"
                )}
            </td>


            <td>
                ৳ ${Number(
                    order.total_amount
                ).toLocaleString("en-BD")}
            </td>


            <td>
                ${escapeHtml(
                    order.payment_method
                )}
            </td>


            <td>

                <select
                    class="order-status"
                    onchange="
                        changeOrderStatus(
                            ${order.id},
                            this.value
                        )
                    "
                >

                    ${orderStatuses(
                        status
                    )}

                </select>

            </td>


            <td>

                <button
                    class="action view"
                    onclick="
                        viewOrder(
                            ${order.id}
                        )
                    "
                >
                    👁️
                </button>

            </td>

        `;


        tbody.appendChild(
            tr
        );

    });

}


/* =====================================================
   ORDER STATUS OPTIONS
===================================================== */

function orderStatuses(
    current
) {

    const statuses = [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    ];


    return statuses.map(
        status => {

            return `
                <option
                    value="${status}"
                    ${
                        current === status
                        ? "selected"
                        : ""
                    }
                >
                    ${status}
                </option>
            `;

        }
    ).join("");

}


/* =====================================================
   CHANGE ORDER STATUS
===================================================== */

async function changeOrderStatus(
    id,
    status
) {

    const result =
        await apiRequest(
            "update_order_status",
            "POST",
            {
                id: id,
                status: status
            }
        );


    if (result.success) {

        alert(
            "✅ Order status changed to " +
            status
        );

        await loadOrders();

    }

}


/* =====================================================
   VIEW ORDER
===================================================== */

function viewOrder(
    id
) {

    const order =
        window.orders?.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!order) {
        return;
    }


    alert(

        "ORDER DETAILS\n\n" +

        "Order ID: #PP" +
        String(
            order.id
        ).padStart(4,"0") +

        "\nCustomer: " +
        (
            order.customer_name ||
            "Guest"
        ) +

        "\nPhone: " +
        (
            order.customer_phone ||
            "-"
        ) +

        "\nAmount: ৳ " +
        Number(
            order.total_amount
        ).toLocaleString(
            "en-BD"
        ) +

        "\nPayment: " +
        order.payment_method +

        "\nStatus: " +
        order.status +

        "\nAddress: " +
        (
            order.delivery_address ||
            "-"
        )

    );

}


/* =====================================================
   ADD CATEGORY
===================================================== */

async function addCategory() {

    const name =
        prompt(
            "Enter new category name:"
        );


    if (
        !name ||
        !name.trim()
    ) {
        return;
    }


    /*
       API-তে এখন category add endpoint
       না থাকায় temporary message.
    */

    alert(
        "Category Add API পরের ধাপে connect করা হবে.\n\n" +
        "Category: " +
        name
    );

}


/* =====================================================
   EDIT CATEGORY
===================================================== */

function editCategory(
    id
) {

    const category =
        window.categories?.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!category) {
        return;
    }


    alert(
        "Category Edit:\n\n" +
        category.name
    );

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (confirmLogout) {

        window.location.href =
            "index.html";

    }

}


/* =====================================================
   SECURITY HELPERS
===================================================== */

function escapeHtml(
    value
) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(
    value
) {

    return escapeHtml(
        value
    );

}


/* =====================================================
   MODAL OUTSIDE CLICK
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const modal =
            document.getElementById(
                "productModal"
            );


        if (modal) {

            modal.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        modal
                    ) {

                        closeProductModal();

                    }

                }
            );

        }


        /* Initial Dashboard */

        loadDashboard();

    }
);
