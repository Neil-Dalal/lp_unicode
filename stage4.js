const fs = require('fs');
const customers = JSON.parse(fs.readFileSync('./data/customers.json', 'utf8'));
const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
const orders = JSON.parse(fs.readFileSync('./data/orders.json', 'utf8'));
const { getOrderById, calculateTotal } = require('./stage1.js');

class OrderNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "OrderNotFoundError";
  }
}

class CustomerNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "CustomerNotFoundError";
  }
}

class ProductNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "ProductNotFoundError";
  }
}

class InsufficientStockError extends Error {
  constructor(message) {
    super(message);
    this.name = "InsufficientStockError";
  }
}

class PaymentFailedError extends Error {
  constructor(message) {
    super(message);
    this.name = "PaymentFailedError";
  }
}

function getCustomerAsync(customerId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const customer = customers.find(c => c.id === customerId);
      if (!customer) {
        return reject(new CustomerNotFoundError(`Customer ID ${customerId} not found in database.`));
      }
      resolve(customer);
    }, 400);
  });
}

function getProductsAsync(order) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const orderProducts = order.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return product ? { ...product, quantity: item.quantity } : null;
      });

      if (orderProducts.some(p => !p)) {
        return reject(new ProductNotFoundError("One or more product IDs in the order do not exist."));
      }
      resolve(orderProducts);
    }, 400);
  });
}

function checkStockAsync(orderProducts) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const stockOk = orderProducts.every(item => item.quantity > 0);
      if (!stockOk) {
        return reject(new InsufficientStockError("Item quantity must be greater than zero."));
      }
      resolve(true);
    }, 400);
  });
}

function processPaymentAsync(amount) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isSuccess = true; 
      if (!isSuccess) {
        return reject(new PaymentFailedError("Payment gateway declined the transaction."));
      }
      resolve({ status: "Paid", amount, timestamp: new Date().toISOString() });
    }, 400);
  });
}

function createOrderAsync(customer, orderProducts) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const newOrder = {
        customer,
        items: orderProducts,
        createdAt: new Date().toISOString(),
        status: "Created"
      };
      resolve(newOrder);
    }, 400);
  });
}

async function processOrder(orderId) {
  try {
    console.log(`\n Starting processing for Order ID: ${orderId} `);

    const order = getOrderById(orderId);
    if (!order) {
      throw new OrderNotFoundError(`The order with ID ${orderId} does not exist.`);
    }

    const customer = await getCustomerAsync(order.customerId);
    const orderProducts = await getProductsAsync(order);
    await checkStockAsync(orderProducts);

    const totalAmount = calculateTotal(order);
    await processPaymentAsync(totalAmount);

    const finalOrder = await createOrderAsync(customer, orderProducts);

    console.log("Success! Order created:", finalOrder);
    return finalOrder;

  } catch (error) {
    console.error(`[Failure Handled] (${error.name}): ${error.message}`);
  } finally {
    console.log(`Finished processing attempt for: ${orderId} \n`);
  }
}


if (require.main === module) {
  processOrder(orders[0]?.id || "ord_1");
}

module.exports = {
  processOrder,
  CustomerNotFoundError,
  ProductNotFoundError,
  InsufficientStockError,
  OrderNotFoundError,
  PaymentFailedError
};

processOrder(orders[0].id);