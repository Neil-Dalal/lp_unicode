const readline = require('readline');
const customers = require('./customers.json');
const products = require('./products.json');
const orders = require('./orders.json');

const calculateSubtotal=(order,products)=>{
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

const rl = readline.createInterface({input: process.stdin,output: process.stdout});
rl.question("Which order index do you want? ", (answer) => {
  const index = parseInt(answer); 
  const order = orders[index];

  if (!order) {
    console.log("No order found at that index.");
  } else {
    OrderSummary(order);
  }

  rl.close(); 
});
