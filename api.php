<?php

header("Content-Type: application/json");

require_once "config.php";


$action = $_GET["action"] ?? "";


/* =========================
   GET CATEGORIES
========================= */

if ($action === "categories") {

    $result = $conn->query(
        "SELECT * FROM categories
         ORDER BY id DESC"
    );

    $categories = [];

    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $categories
    ]);

    exit;
}


/* =========================
   GET PRODUCTS
========================= */

if ($action === "products") {

    $sql = "
        SELECT
            products.*,
            categories.name AS category_name

        FROM products

        LEFT JOIN categories
        ON products.category_id = categories.id

        ORDER BY products.id DESC
    ";

    $result = $conn->query($sql);

    $products = [];

    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $products
    ]);

    exit;
}


/* =========================
   ADD PRODUCT
========================= */

if ($action === "add_product") {

    $name = $_POST["name"] ?? "";
    $category_id = $_POST["category_id"] ?? null;
    $sku = $_POST["sku"] ?? "";
    $price = $_POST["price"] ?? 0;
    $old_price = $_POST["old_price"] ?? 0;
    $stock = $_POST["stock"] ?? 0;
    $description = $_POST["description"] ?? "";
    $image = $_POST["image"] ?? "";


    $stmt = $conn->prepare("
        INSERT INTO products
        (
            name,
            category_id,
            sku,
            price,
            old_price,
            stock,
            image,
            description
        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");


    $stmt->bind_param(
        "sisddi ss",
        $name,
        $category_id,
        $sku,
        $price,
        $old_price,
        $stock,
        $image,
        $description
    );


    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Product added successfully"
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => $stmt->error
        ]);

    }

    exit;
}


/* =========================
   DELETE PRODUCT
========================= */

if ($action === "delete_product") {

    $id = intval($_POST["id"] ?? 0);

    $stmt = $conn->prepare(
        "DELETE FROM products WHERE id = ?"
    );

    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Product deleted"
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => $stmt->error
        ]);

    }

    exit;
}


/* =========================
   ORDERS
========================= */

if ($action === "orders") {

    $sql = "
        SELECT
            orders.*,
            customers.name AS customer_name,
            customers.phone AS customer_phone

        FROM orders

        LEFT JOIN customers
        ON orders.customer_id = customers.id

        ORDER BY orders.id DESC
    ";

    $result = $conn->query($sql);

    $orders = [];

    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $orders
    ]);

    exit;
}


/* =========================
   UPDATE ORDER STATUS
========================= */

if ($action === "update_order_status") {

    $id = intval($_POST["id"] ?? 0);
    $status = $_POST["status"] ?? "Pending";


    $stmt = $conn->prepare("
        UPDATE orders
        SET status = ?
        WHERE id = ?
    ");

    $stmt->bind_param(
        "si",
        $status,
        $id
    );


    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Order status updated"
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "message" => $stmt->error
        ]);

    }

    exit;
}


/* =========================
   DASHBOARD
========================= */

if ($action === "dashboard") {

    $products =
        $conn->query(
            "SELECT COUNT(*) AS total
             FROM products"
        )->fetch_assoc()["total"];


    $orders =
        $conn->query(
            "SELECT COUNT(*) AS total
             FROM orders"
        )->fetch_assoc()["total"];


    $customers =
        $conn->query(
            "SELECT COUNT(*) AS total
             FROM customers"
        )->fetch_assoc()["total"];


    $sales =
        $conn->query(
            "SELECT COALESCE(
                SUM(total_amount), 0
             ) AS total
             FROM orders
             WHERE status != 'Cancelled'"
        )->fetch_assoc()["total"];


    echo json_encode([
        "success" => true,

        "data" => [
            "products" => $products,
            "orders" => $orders,
            "customers" => $customers,
            "sales" => $sales
        ]
    ]);

    exit;
}


echo json_encode([
    "success" => false,
    "message" => "Invalid API action"
]);

?>
