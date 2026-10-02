const fs = require('fs');
const customers = JSON.parse(fs.readFileSync('./data/customers.json', 'utf8'));
const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
const orders = JSON.parse(fs.readFileSync('./data/orders.json', 'utf8'));

const { calculateTotal } = require('./stage1.js');
function calculateTotalRevenue(orders) {
  let totalRevenue = 0;
  orders.forEach((order) => {
    totalRevenue = totalRevenue + calculateTotal(order);
  });
  return totalRevenue;
}

function getAllOrderTotals(orders) {
  let totals = orders.map((order) => {
    return calculateTotal(order);
  });
  return totals;
}

function calculateAverageOrderValue(orders) {
  let Trev = calculateTotalRevenue(orders);
  let AverageOrderValue = Trev / orders.length;
  return AverageOrderValue;
}

const getHighestValueOrder = (orders, products) => {
  let allTotals = getAllOrderTotals(orders);
  let highestValue = Math.max(...allTotals);
  let highestOrder = orders.find(order => calculateTotal(order) === highestValue);
  return highestOrder;
}

function hasHighValueOrder(orders, threshold) {
  let orderTotals = getAllOrderTotals(orders);
  let hasHighValue = orderTotals.some((total) => {
    return total >= threshold;
  });
  return hasHighValue;
}

function isOrderValid(order, customers, products) {
  let customerExists = customers.some((customer) => {
    return customer.id === order.customerId;
  });

  let itemsValid = order.items.every((item) => {
    let productExists = products.some((product) => {
      return product.id === item.productId;
    });
    let validQuantity = item.quantity > 0;
    return productExists && validQuantity;
  });

  let orderIsValid = customerExists && itemsValid;
  return orderIsValid;
}

function areAllOrdersValid(orders, customers, products) {
  let allValid = orders.every((order) => {
    return isOrderValid(order, customers, products);
  });
  return allValid;
}

function updateOrder(order, updates) {
  return { ...order, ...updates };
}

module.exports = {
calculateTotalRevenue,
getAllOrderTotals,
calculateAverageOrderValue,
getHighestValueOrder,
hasHighValueOrder,
isOrderValid,
areAllOrdersValid,
updateOrder
};

console.log("All Order Totals:", getAllOrderTotals(orders));
console.log("Total Revenue:", calculateTotalRevenue(orders));
console.log("Average Order Value:", calculateAverageOrderValue(orders));
console.log("Highest Value Order:", getHighestValueOrder(orders, products));
console.log("Has High Value Order (Threshold 5000):", hasHighValueOrder(orders, 5000));
console.log("Are All Orders Valid:", areAllOrdersValid(orders, customers, products));
console.log("Updated Order:", updateOrder(orders[0], { status: "Updated" }));