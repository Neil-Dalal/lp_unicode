const products = require('./data/products.json');
const customers = require('./data/customers.json');
const orders = require('./data/orders.json');
function getOrderById(orderId) {
   return orders.find(o => o.id === orderId);
}

function getOrdersByCustomer(customerId) {
   return orders.filter(o => o.customerId === customerId);
}

const calculateSubtotal=(order)=>{
    let subtotal =0;
     for(let item of order.items){
    const product = products.find(p=>p.id==item.productId);
    const price = product?.price;
    const quantity = item.quantity;    
    subtotal+= price*quantity;    
     }
     return subtotal;
}

function calculateDiscount(subtotal) {
  if (subtotal < 2000) {
    return 0;
  } else if (subtotal >= 2000 && subtotal < 5000) {
    return subtotal * 0.05;
  } else if (subtotal >= 5000) {
    return subtotal * 0.10;
  }
}

function calculateTax(discountedSubtotal) {
  return 0.18 * discountedSubtotal;
}

function calculateTotal(order) {
  const subtotal = calculateSubtotal(order);
  const discount = calculateDiscount(subtotal);
  const discountedSubtotal = subtotal - discount;
  const tax = calculateTax(discountedSubtotal);
  
  return discountedSubtotal + tax;
}

function OrderSummary(order) {
  const subtotal = calculateSubtotal(order);
  const discount = calculateDiscount(subtotal);
  const discountedSubtotal = subtotal - discount;
  const tax = calculateTax(discountedSubtotal);
  const total = calculateTotal(order);

  console.log("The order summary is:");
  if (discount === 0) {
    console.log("No discount ");
  }
  console.log(`The subtotal is ${subtotal}`);
  console.log(`The discounted subtotal is ${discountedSubtotal}`);
  console.log(`The Tax is ${tax}`);
  console.log(`The Total is ${total}`);
}

if (require.main === module) {
  const index = 0;
  const order = orders[index];

  if (!order) {
    console.log("No order found at that index.");
  } else {
    OrderSummary(order);
  }
}
module.exports = {
     calculateSubtotal,
     calculateDiscount,
     calculateTax,
     calculateTotal,
     OrderSummary,
     getOrderById,
     getOrdersByCustomer
   };
   
const firstOrder = orders[0];
console.log("Order Lookup (ID):", getOrderById(firstOrder.id));
console.log("Orders by Customer:", getOrdersByCustomer(firstOrder.customerId));
OrderSummary(firstOrder);
