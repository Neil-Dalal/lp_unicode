const fs = require('fs');
const customers = JSON.parse(fs.readFileSync('./data/customers.json', 'utf8'));
const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
const orders = JSON.parse(fs.readFileSync('./data/orders.json', 'utf8'));

const { getOrderById, calculateTotal } = require('./stage1.js');
function getCustomerCB(customerId, callback) {  
  setTimeout(() => {    
    let customer = customers.find(c => c.id === customerId);
    if (!customer) {
      return callback(new Error("Customer not found"));
    }
    callback(null, customer);
  }, 600);
}

function getProductsCB(order, callback) {  
  setTimeout(() => {    
    let orderProducts = order.items.map(item => {
      let product = products.find(p => p.id === item.productId);
      return { ...product, quantity: item.quantity };
    });
    let missingProduct = orderProducts.some(p => !p.name);
    if (missingProduct) {
      return callback(new Error("Product not found"));
    }
    callback(null, orderProducts);
  }, 500);
}

function checkStockCB(orderProducts, callback) {  
  setTimeout(() => {    
    let stockOk = orderProducts.every(item => item.quantity > 0);
    if (!stockOk) {
      return callback(new Error("Insufficient stock"));
    }
    callback(null, true);
  }, 500);
}

function processPaymentCB(amount, callback) {  
  setTimeout(() => {    
    let paymentSuccess = true; 
    if (!paymentSuccess) {
      return callback(new Error("Payment failed"));
    }
    callback(null, { status: "Paid", amount });
  }, 500);
}

function createOrderCB(customer, orderProducts, callback) {  
  setTimeout(() => {    
    let newOrder = {
      customer,
      items: orderProducts,
      createdAt: new Date().toISOString(),
      status: "Created"
    };
    callback(null, newOrder);
  }, 500);
}

function processOrderWithCallbacks(orderId) {  
  let order = getOrderById(orderId);
  if (!order) return console.log("Error: Order not found");

  getCustomerCB(order.customerId, (err, customer) => {    
    if (err) return console.log("Error:", err.message);
    
    getProductsCB(order, (err, orderProducts) => {      
      if (err) return console.log("Error:", err.message);
      
      checkStockCB(orderProducts, (err, stockOk) => {        
        if (err) return console.log("Error:", err.message);
        
        let totalAmount = calculateTotal(order);
        processPaymentCB(totalAmount, (err, paymentResult) => {
          if (err) return console.log("Error:", err.message);
          
          createOrderCB(customer, orderProducts, (err, finalOrder) => {
            if (err) return console.log("Error:", err.message);
            console.log("Order successfully created via Callbacks:", finalOrder);
          });
        });
      });
    });
  });
}



function getCustomer(customerId) {  
  return new Promise((resolve, reject) => {    
    setTimeout(() => {      
      let customer = customers.find(c => c.id === customerId);
      if (!customer) {
        return reject(new Error("Customer not found"));
      }
      resolve(customer);
    }, 500);
  });
}

function getProducts(order) {  
  return new Promise((resolve, reject) => {    
    setTimeout(() => {      
      let orderProducts = order.items.map(item => {
        let product = products.find(p => p.id === item.productId);
        return { ...product, quantity: item.quantity };
      });
      let missing = orderProducts.some(p => !p.name);
      if (missing) {
        return reject(new Error("Product not found"));
      }
      resolve(orderProducts);
    }, 500);
  });
}

function checkStock(orderProducts) {  
  return new Promise((resolve, reject) => {    
    setTimeout(() => {      
      let stockOk = orderProducts.every(item => item.quantity > 0);
      if (!stockOk) {
        return reject(new Error("Insufficient stock"));
      }
      resolve(stockOk);
    }, 500);
  });
}

function processPayment(amount) {  
  return new Promise((resolve, reject) => {    
    setTimeout(() => {      
      let success = true;
      if (!success) {
        return reject(new Error("Payment failed"));
      }
      resolve({ status: "Paid", amount });
    }, 500);
  });
}

function createOrder(customer, orderProducts) {  
  return new Promise((resolve, reject) => {    
    setTimeout(() => {      
      let finalOrder = {
        customer,
        items: orderProducts,
        createdAt: new Date().toISOString(),
        status: "Created"
      };
      resolve(finalOrder);
    }, 500);
  });
}

function processOrderWithPromises(orderId) {  
  let order = getOrderById(orderId);
  if (!order) {
    console.log("Order processing failed: Order not found");
    return;
  }

  let savedCustomer;
  let savedProducts;

  getCustomer(order.customerId)
    .then((customer) => {
      savedCustomer = customer;
      return getProducts(order);
    })
    .then((orderProducts) => {
      savedProducts = orderProducts;
      return checkStock(orderProducts);
    })
    .then(() => {
      let total = calculateTotal(order);
      return processPayment(total);
    })
    .then(() => {
      return createOrder(savedCustomer, savedProducts);
    })
    .then((finalOrder) => {
      console.log("Order successfully created via Promises:", finalOrder);
    })
    .catch((error) => {
      console.log("Order processing failed:", error.message);
    });
}

module.exports = { processOrderWithCallbacks, processOrderWithPromises };

processOrderWithCallbacks(orders[0].id);
processOrderWithPromises(orders[0].id);