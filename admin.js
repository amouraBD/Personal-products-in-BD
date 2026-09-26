/* ================= PAGE NAVIGATION ================= */

function showPage(pageId) {

  const pages = document.querySelectorAll(".page");

  pages.forEach(page => {
    page.classList.remove("active-page");
  });

  const selectedPage = document.getElementById(pageId);

  if (selectedPage) {
    selectedPage.classList.add("active-page");
  }


  /* Update Title */

  const titles = {
    dashboard: "Dashboard",
    products: "Products",
    categories: "Categories",
    orders: "Orders",
    customers: "Customers",
    stock: "Stock Management",
    sales: "Sales Report"
  };

  document.getElementById("pageTitle").innerText =
    titles[pageId] || "Admin Panel";


  /* Active Menu */

  const menus = document.querySelectorAll(".menu");

  menus.forEach(menu => {
    menu.classList.remove("active");
  });

  menus.forEach(menu => {

    const onclick = menu.getAttribute("onclick");

    if (onclick && onclick.includes("'" + pageId + "'")) {
      menu.classList.add("active");
    }

  });


  /* Close mobile sidebar */

  document.getElementById("sidebar").classList.remove("open");

}


/* ================= MOBILE SIDEBAR ================= */

function toggleSidebar() {

  document
    .getElementById("sidebar")
    .classList.toggle("open");

}


/* ================= PRODUCT MODAL ================= */

function openProductModal() {

  document
    .getElementById("productModal")
    .classList.add("show");

}


function closeProductModal() {

  document
    .getElementById("productModal")
    .classList.remove("show");

}


/* ================= SAVE PRODUCT ================= */

function saveProduct(event) {

  event.preventDefault();

  const name =
    document.getElementById("productName").value;

  const category =
    document.getElementById("productCategory").value;

  const price =
    document.getElementById("productPrice").value;

  const stock =
    document.getElementById("productStock").value;

  const sku =
    document.getElementById("productSku").value;


  alert(
    "Product Added Successfully!\n\n" +
    "Product: " + name + "\n" +
    "Category: " + category + "\n" +
    "Price: ৳ " + price + "\n" +
    "Stock: " + stock + "\n" +
    "SKU: " + sku
  );


  event.target.reset();

  closeProductModal();

}


/* ================= SEARCH PRODUCTS ================= */

function searchProducts() {

  const input =
    document
      .getElementById("productSearch")
      .value
      .toLowerCase();

  const rows =
    document.querySelectorAll("#productTable tbody tr");


  rows.forEach(row => {

    const text =
      row.innerText.toLowerCase();

    row.style.display =
      text.includes(input)
        ? ""
        : "none";

  });

}


/* ================= FILTER PRODUCTS ================= */

function filterProducts() {

  const filter =
    document
      .getElementById("categoryFilter")
      .value
      .toLowerCase();

  const rows =
    document.querySelectorAll("#productTable tbody tr");


  rows.forEach(row => {

    const category =
      row.cells[1].innerText.toLowerCase();

    if (
      filter === "all" ||
      category === filter
    ) {

      row.style.display = "";

    } else {

      row.style.display = "none";

    }

  });

}


/* ================= ADD CATEGORY ================= */

function addCategory() {

  const category =
    prompt("Enter new category name:");

  if (category && category.trim() !== "") {

    alert(
      "Category '" +
      category +
      "' added successfully!"
    );

  }

}


/* ================= LOGOUT ================= */

function logout() {

  const confirmLogout =
    confirm(
      "Are you sure you want to logout?"
    );

  if (confirmLogout) {

    alert("Logged out successfully.");

  }

}


/* ================= DELETE BUTTON ================= */

document.addEventListener("click", function(event) {

  if (
    event.target.classList.contains("delete")
  ) {

    const confirmDelete =
      confirm(
        "Are you sure you want to delete this product?"
      );

    if (confirmDelete) {

      const row =
        event.target.closest("tr");

      if (row) {
        row.remove();
      }

      alert("Product deleted successfully.");

    }

  }


  /* ================= EDIT BUTTON ================= */

  if (
    event.target.classList.contains("edit")
  ) {

    alert(
      "Product Edit Panel will open here."
    );

  }


  /* ================= VIEW ORDER ================= */

  if (
    event.target.classList.contains("view")
  ) {

    alert(
      "Order details will open here."
    );

  }

});


/* ================= CLOSE MODAL OUTSIDE ================= */

document
  .getElementById("productModal")
  .addEventListener("click", function(event) {

    if (event.target === this) {
      closeProductModal();
    }

  });
