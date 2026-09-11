const orders = require('./orders.json');
const customers = require('./customers.json');
const products = require('./products.json');

const stage1 = require('./stage1.js');
const stage2 = require('./stage2.js');
const stage3 = require('./stage3.js');
const stage4 = require('./stage4.js');

const firstOrder = orders[0];

// Stage 1
console.log(stage1.getOrderById(firstOrder.id));
console.log(stage1.calculateTotal(firstOrder));
stage1.OrderSummary(firstOrder);

// Stage 2
console.log(stage2.getAllOrderTotals(orders));
console.log(stage2.calculateTotalRevenue(orders));
console.log(stage2.calculateAverageOrderValue(orders));
console.log(stage2.getHighestValueOrder(orders));
console.log(stage2.areAllOrdersValid(orders, customers, products));
console.log(stage2.updateOrder(firstOrder, { status: 'Updated' }));

// Stage 3
stage3.processOrderWithCallbacks(firstOrder.id);
stage3.processOrderWithPromises(firstOrder.id);

// Stage 4
stage4.processOrder(firstOrder.id);