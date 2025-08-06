const express = require('express');
const axios = require('axios');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Configuration
const config = {
  infobip: {
    baseUrl: 'https://api.infobip.com',
    apiKey: process.env.INFOBIP_API_KEY, // Set in environment variables
    sender: process.env.WHATSAPP_SENDER_NUMBER
  }
};

// Comprehensive dummy database for immediate testing
const dummyDatabase = {
  customers: [
    {
      id: 'CUST001',
      phone: '+27123456789',
      name: 'Siyaya Trading',
      responsible: 'Drinks & More Pty Ltd',
      accountBalance: 2500.00,
      creditLimit: 50000.00,
      address: '123 Business Street, Johannesburg',
      email: 'siyaya@trading.co.za'
    },
    {
      id: 'CUST002',
      phone: '+27987654321',
      name: 'Metro Corner Shop',
      responsible: 'Beverage Solutions SA',
      accountBalance: 1200.00,
      creditLimit: 25000.00,
      address: '456 Commerce Ave, Cape Town',
      email: 'metro@corner.co.za'
    },
    {
      id: 'CUST003',
      phone: '+27111222333',
      name: 'Sunshine Retailers',
      responsible: 'Drinks & More Pty Ltd',
      accountBalance: 800.00,
      creditLimit: 30000.00,
      address: '789 Retail Road, Durban',
      email: 'sunshine@retail.co.za'
    }
  ],
  
  products: [
    // Sports Drinks
    {
      id: 'powerade_mountb_500',
      name: 'Powerade Mountain Berry 500ML',
      category: 'sports',
      price: 18.50,
      available: true,
      stock: 150,
      image: 'https://images.unsplash.com/photo-1594971475674-6a97f8fe8c8b?w=300&h=300&fit=crop',
      description: 'Refreshing mountain berry flavored sports drink'
    },
    {
      id: 'powerade_islander_500',
      name: 'Powerade Island Burst 500ML',
      category: 'sports',
      price: 18.50,
      available: true,
      stock: 200,
      image: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=300&h=300&fit=crop',
      description: 'Tropical island burst flavored sports drink'
    },
    {
      id: 'powerade_jag_500',
      name: 'Powerade Jagged Ice 500ML',
      category: 'sports',
      price: 18.50,
      available: true,
      stock: 180,
      image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300&h=300&fit=crop',
      description: 'Cool jagged ice flavored sports drink'
    },
    
    // Soft Drinks
    {
      id: 'coke_500',
      name: 'Coca-Cola 500ML',
      category: 'soft_drinks',
      price: 15.00,
      available: true,
      stock: 300,
      image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300&h=300&fit=crop',
      description: 'Classic Coca-Cola refreshment'
    },
    {
      id: 'sprite_500',
      name: 'Sprite 500ML',
      category: 'soft_drinks',
      price: 15.00,
      available: true,
      stock: 250,
      image: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=300&h=300&fit=crop',
      description: 'Crisp lemon-lime soda'
    },
    {
      id: 'fanta_500',
      name: 'Fanta Orange 500ML',
      category: 'soft_drinks',
      price: 15.00,
      available: true,
      stock: 220,
      image: 'https://images.unsplash.com/photo-1594971475674-6a97f8fe8c8b?w=300&h=300&fit=crop',
      description: 'Refreshing orange flavored soda'
    },
    
    // Energy Drinks
    {
      id: 'monster_500',
      name: 'Monster Energy 500ML',
      category: 'energy',
      price: 25.00,
      available: true,
      stock: 100,
      image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300&h=300&fit=crop',
      description: 'High energy drink for active lifestyle'
    },
    {
      id: 'redbull_250',
      name: 'Red Bull 250ML',
      category: 'energy',
      price: 22.00,
      available: true,
      stock: 120,
      image: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=300&h=300&fit=crop',
      description: 'Premium energy drink'
    }
  ],
  
  orders: [
    {
      id: 'ORD20241201001',
      customerId: 'CUST001',
      items: [
        { productId: 'powerade_mountb_500', quantity: 12, unitPrice: 18.50 },
        { productId: 'coke_500', quantity: 24, unitPrice: 15.00 }
      ],
      total: 582.00,
      status: 'delivered',
      createdAt: '2024-12-01T10:30:00Z',
      deliveryDate: '2024-12-02T14:00:00Z'
    },
    {
      id: 'ORD20241128001',
      customerId: 'CUST001',
      items: [
        { productId: 'sprite_500', quantity: 18, unitPrice: 15.00 }
      ],
      total: 270.00,
      status: 'processing',
      createdAt: '2024-11-28T15:45:00Z'
    },
    {
      id: 'ORD20241125001',
      customerId: 'CUST001',
      items: [
        { productId: 'powerade_islander_500', quantity: 6, unitPrice: 18.50 },
        { productId: 'monster_500', quantity: 4, unitPrice: 25.00 }
      ],
      total: 211.00,
      status: 'delivered',
      createdAt: '2024-11-25T09:15:00Z',
      deliveryDate: '2024-11-26T11:30:00Z'
    }
  ],
  
  // Session-based cart storage
  carts: {},
  
  // Suggested orders based on purchase history
  suggestedOrders: {
    'CUST001': [
      { productId: 'powerade_mountb_500', quantity: 12, reason: 'Frequently ordered' },
      { productId: 'coke_500', quantity: 24, reason: 'Popular item' },
      { productId: 'sprite_500', quantity: 6, reason: 'Seasonal favorite' }
    ]
  },
  
  // Customer rewards/loyalty points
  rewards: {
    'CUST001': {
      points: 1250,
      tier: 'Gold',
      nextTierPoints: 1750,
      availableRewards: [
        { id: 'R001', name: '5% Discount Voucher', pointsCost: 500 },
        { id: 'R002', name: 'Free Delivery', pointsCost: 300 },
        { id: 'R003', name: 'R50 Credit', pointsCost: 1000 }
      ]
    }
  },
  
  // Customer statistics
  stats: {
    'CUST001': {
      totalOrders: 15,
      totalSpent: 8540.00,
      averageOrderValue: 569.33,
      favoriteCategory: 'sports',
      lastOrderDate: '2024-12-01',
      monthlySpend: 2100.00,
      topProducts: [
        { name: 'Powerade Mountain Berry 500ML', quantity: 48 },
        { name: 'Coca-Cola 500ML', quantity: 72 },
        { name: 'Sprite 500ML', quantity: 36 }
      ]
    }
  }
};

// Helper functions
function findCustomerByPhone(phone) {
  return dummyDatabase.customers.find(c => c.phone === phone);
}

function getProductsByCategory(category) {
  return dummyDatabase.products.filter(p => p.category === category && p.available);
}

function getProductById(productId) {
  return dummyDatabase.products.find(p => p.id === productId);
}

function calculateCartTotal(cartItems) {
  return cartItems.reduce((total, item) => {
    const product = getProductById(item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function formatCartItemsText(cartItems) {
  return cartItems.map(item => {
    const product = getProductById(item.productId);
    if (!product) return '';
    return `${product.name} x${item.quantity} - R${(product.price * item.quantity).toFixed(2)}`;
  }).filter(item => item).join('\n');
}

// Main webhook endpoint
app.post('/webhook/whatsapp-flow', async (req, res) => {
  try {
    const { action, data, flow_token } = req.body;
    console.log('Received webhook:', { action, data: JSON.stringify(data, null, 2) });

    let response = {};

    switch (action) {
      case 'INIT':
        response = await handleFlowInit(data);
        break;
      
      case 'data_exchange':
        response = await handleDataExchange(data);
        break;
      
      default:
        response = { error: 'Unknown action' };
    }

    console.log('Sending response:', JSON.stringify(response, null, 2));
    res.json(response);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Handle flow initialization
async function handleFlowInit(data) {
  const phoneNumber = data.phone_number || data.from;
  console.log('Initializing flow for phone:', phoneNumber);
  
  // Look up customer
  const customer = findCustomerByPhone(phoneNumber);
  
  if (!customer) {
    return {
      screen: 'INCORRECT_DETAILS',
      data: {
        error_message: 'Customer not found. Please update your details.'
      }
    };
  }

  // Initialize session
  const sessionId = generateSessionId();
  dummyDatabase.carts[sessionId] = [];

  return {
    screen: 'WELCOME',
    data: {
      customer_name: customer.name,
      responsible_entity: customer.responsible,
      customer_id: customer.id,
      session_id: sessionId,
      account_balance: customer.accountBalance.toFixed(2),
      credit_limit: customer.creditLimit.toFixed(2),
      available_credit: (customer.creditLimit - customer.accountBalance).toFixed(2)
    }
  };
}

// Handle data exchange during flow
async function handleDataExchange(data) {
  console.log('Data exchange:', JSON.stringify(data, null, 2));
  
  const action = data.action || data.action_payload?.action;
  
  switch (action) {
    case 'load_sports_products':
      return await loadSportsProducts(data);
    
    case 'load_soft_drinks':
      return await loadSoftDrinks(data);
    
    case 'load_energy_drinks':
      return await loadEnergyDrinks(data);
    
    case 'add_to_cart':
      return await addToCart(data);
    
    case 'get_cart_summary':
      return await getCartSummary(data);
    
    case 'place_order':
      return await placeOrder(data);
    
    case 'get_order_history':
      return await getOrderHistory(data);
    
    case 'get_account_info':
      return await getAccountInfo(data);
    
    case 'get_suggested_order':
      return await getSuggestedOrder(data);
    
    case 'get_rewards':
      return await getRewards(data);
    
    case 'get_my_stats':
      return await getMyStats(data);
    
    case 'update_customer_details':
      return await updateCustomerDetails(data);
    
    default:
      console.log('Unknown action:', action);
      return { error: 'Unknown action: ' + action };
  }
}

// Load sports products
async function loadSportsProducts(data) {
  const sportsProducts = getProductsByCategory('sports');
  
  return {
    screen: 'SPORTS_PRODUCTS',
    data: {
      products: sportsProducts.map(p => ({
        id: p.id,
        title: p.name,
        price: p.price.toFixed(2),
        image_src: p.image,
        available: p.available,
        stock: p.stock
      })),
      cart_count: data.session_id ? (dummyDatabase.carts[data.session_id]?.length || 0) : 0
    }
  };
}

// Load soft drinks
async function loadSoftDrinks(data) {
  const softDrinks = getProductsByCategory('soft_drinks');
  
  return {
    screen: 'SOFT_DRINKS',
    data: {
      products: softDrinks.map(p => ({
        id: p.id,
        title: p.name,
        price: p.price.toFixed(2),
        image_src: p.image,
        available: p.available,
        stock: p.stock
      })),
      cart_count: data.session_id ? (dummyDatabase.carts[data.session_id]?.length || 0) : 0
    }
  };
}

// Load energy drinks
async function loadEnergyDrinks(data) {
  const energyDrinks = getProductsByCategory('energy');
  
  return {
    screen: 'ENERGY_DRINKS',
    data: {
      products: energyDrinks.map(p => ({
        id: p.id,
        title: p.name,
        price: p.price.toFixed(2),
        image_src: p.image,
        available: p.available,
        stock: p.stock
      })),
      cart_count: data.session_id ? (dummyDatabase.carts[data.session_id]?.length || 0) : 0
    }
  };
}

// Add item to cart
async function addToCart(data) {
  const { session_id, product_id, quantity = 1 } = data;
  
  if (!dummyDatabase.carts[session_id]) {
    dummyDatabase.carts[session_id] = [];
  }
  
  const existingItem = dummyDatabase.carts[session_id].find(item => item.productId === product_id);
  
  if (existingItem) {
    existingItem.quantity += parseInt(quantity);
  } else {
    dummyDatabase.carts[session_id].push({
      productId: product_id,
      quantity: parseInt(quantity)
    });
  }
  
  const cartItems = dummyDatabase.carts[session_id];
  const total = calculateCartTotal(cartItems);
  
  return {
    data: {
      cart_count: cartItems.length,
      estimated_total: total.toFixed(2),
      success_message: 'Item added to cart'
    }
  };
}

// Get cart summary
async function getCartSummary(data) {
  const sessionId = data.session_id;
  const cartItems = dummyDatabase.carts[sessionId] || [];
  
  const cartWithDetails = cartItems.map(item => {
    const product = getProductById(item.productId);
    return {
      id: item.productId,
      name: product?.name || 'Unknown Product',
      quantity: item.quantity,
      unit_price: product?.price || 0,
      total_price: (product?.price || 0) * item.quantity,
      image: product?.image
    };
  });
  
  const total = calculateCartTotal(cartItems);
  const cartItemsText = formatCartItemsText(cartItems);
  
  return {
    screen: 'CART_SUMMARY',
    data: {
      cart_items: cartWithDetails,
      cart_count: cartItems.length,
      estimated_total: total.toFixed(2),
      cart_items_text: cartItemsText || 'No items in cart'
    }
  };
}

// Place order
async function placeOrder(data) {
  const { customer_id, session_id } = data;
  
  const customer = dummyDatabase.customers.find(c => c.id === customer_id);
  if (!customer) {
    return { error: 'Customer not found' };
  }
  
  const cartItems = dummyDatabase.carts[session_id] || [];
  if (cartItems.length === 0) {
    return { error: 'Cart is empty' };
  }
  
  const total = calculateCartTotal(cartItems);
  
  // Check credit limit
  if (customer.accountBalance + total > customer.creditLimit) {
    return {
      error: 'Credit limit exceeded',
      screen: 'CART_SUMMARY',
      data: {
        error_message: 'This order would exceed your credit limit. Please adjust your order or contact customer service.'
      }
    };
  }
  
  // Create order
  const orderId = generateOrderId();
  const order = {
    id: orderId,
    customerId: customer_id,
    items: cartItems.map(item => {
      const product = getProductById(item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product?.price || 0
      };
    }),
    total: total,
    status: 'processing',
    createdAt: new Date().toISOString()
  };
  
  dummyDatabase.orders.push(order);
  
  // Update customer balance
  customer.accountBalance += total;
  
  // Clear cart
  delete dummyDatabase.carts[session_id];
  
  // Optional: Send confirmation via Infobip
  if (config.infobip.apiKey) {
    await sendOrderConfirmation(customer.phone, orderId, total);
  }
  
  return {
    screen: 'ORDER_CONFIRMATION',
    data: {
      order_id: orderId,
      total: total.toFixed(2),
      message: `✅ Order ${orderId} placed successfully!\n\nTotal: R${total.toFixed(2)}\nStatus: Processing\n\nWe'll process your order within 24 hours. Thank you for choosing MyCCBA!`,
      estimated_delivery: '24-48 hours'
    }
  };
}

// Get order history
async function getOrderHistory(data) {
  const { customer_id } = data;
  
  const customerOrders = dummyDatabase.orders
    .filter(o => o.customerId === customer_id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);
  
  return {
    screen: 'ORDER_HISTORY',
    data: {
      order_history: customerOrders.map(order => ({
        id: order.id,
        date: new Date(order.createdAt).toLocaleDateString('en-ZA'),
        total: order.total.toFixed(2),
        status: order.status,
        item_count: order.items.length,
        items_summary: order.items.map(item => {
          const product = getProductById(item.productId);
          return `${product?.name || 'Unknown'} x${item.quantity}`;
        }).join(', ')
      }))
    }
  };
}

// Get account information
async function getAccountInfo(data) {
  const { customer_id } = data;
  
  const customer = dummyDatabase.customers.find(c => c.id === customer_id);
  if (!customer) {
    return { error: 'Customer not found' };
  }
  
  return {
    screen: 'ACCOUNT_CREDIT',
    data: {
      account_balance: customer.accountBalance.toFixed(2),
      credit_limit: customer.creditLimit.toFixed(2),
      available_credit: (customer.creditLimit - customer.accountBalance).toFixed(2),
      payment_terms: '30 days',
      last_payment: 'R2,500.00 on 25 Nov 2024'
    }
  };
}

// Get suggested order
async function getSuggestedOrder(data) {
  const { customer_id } = data;
  
  const suggestions = dummyDatabase.suggestedOrders[customer_id] || [];
  const suggestedItems = suggestions.map(item => {
    const product = getProductById(item.productId);
    return {
      id: item.productId,
      name: product?.name || 'Unknown Product',
      quantity: item.quantity,
      price: product?.price || 0,
      total: (product?.price || 0) * item.quantity,
      reason: item.reason
    };
  });
  
  const totalSuggested = suggestedItems.reduce((sum, item) => sum + item.total, 0);
  
  return {
    screen: 'SUGGESTED_ORDER',
    data: {
      suggested_items: suggestedItems,
      total_suggested: totalSuggested.toFixed(2),
      suggestion_reason: 'Based on your order history and popular items'
    }
  };
}

// Get rewards
async function getRewards(data) {
  const { customer_id } = data;
  
  const customerRewards = dummyDatabase.rewards[customer_id] || {
    points: 0,
    tier: 'Bronze',
    availableRewards: []
  };
  
  return {
    screen: 'REWARDS',
    data: {
      current_points: customerRewards.points,
      tier: customerRewards.tier,
      next_tier_points: customerRewards.nextTierPoints || 0,
      available_rewards: customerRewards.availableRewards
    }
  };
}

// Get customer stats
async function getMyStats(data) {
  const { customer_id } = data;
  
  const customerStats = dummyDatabase.stats[customer_id] || {
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    favoriteCategory: 'N/A',
    topProducts: []
  };
  
  return {
    screen: 'MY_STATS',
    data: {
      total_orders: customerStats.totalOrders,
      total_spent: customerStats.totalSpent.toFixed(2),
      average_order: customerStats.averageOrderValue.toFixed(2),
      favorite_category: customerStats.favoriteCategory,
      monthly_spend: customerStats.monthlySpend?.toFixed(2) || '0.00',
      top_products: customerStats.topProducts
    }
  };
}

// Update customer details
async function updateCustomerDetails(data) {
  const { phone_number, customer_name, business_name, contact_number } = data;
  
  let customer = findCustomerByPhone(phone_number);
  
  if (!customer) {
    // Create new customer
    customer = {
      id: generateCustomerId(),
      phone: phone_number,
      name: customer_name,
      responsible: business_name,
      accountBalance: 0.00,
      creditLimit: 10000.00,
      address: '',
      email: ''
    };
    dummyDatabase.customers.push(customer);
  } else {
    // Update existing customer
    customer.name = customer_name;
    customer.responsible = business_name;
    if (contact_number && contact_number !== phone_number) {
      customer.phone = contact_number;
    }
  }
  
  return {
    screen: 'WELCOME',
    data: {
      message: 'Details updated successfully! Welcome to MyCCBA.',
      customer_id: customer.id,
      customer_name: customer.name,
      responsible_entity: customer.responsible
    }
  };
}

// Send order confirmation via Infobip (optional)
async function sendOrderConfirmation(phoneNumber, orderId, total) {
  if (!config.infobip.apiKey || !config.infobip.sender) {
    console.log('Infobip not configured, skipping confirmation message');
    return;
  }
  
  try {
    const message = {
      messages: [{
        from: config.infobip.sender,
        to: phoneNumber,
        content: {
          text: `✅ Order Confirmed!\n\nOrder ID: ${orderId}\nTotal: R${total.toFixed(2)}\n\nWe'll process your order within 24 hours. Thank you for choosing MyCCBA!`
        }
      }]
    };

    await axios.post(
      `${config.infobip.baseUrl}/sms/2/text/advanced`,
      message,
      {
        headers: {
          'Authorization': `App ${config.infobip.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Order confirmation sent to:', phoneNumber);
  } catch (error) {
    console.error('Failed to send confirmation:', error.message);
  }
}

// Utility functions
function generateSessionId() {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateOrderId() {
  return 'ORD' + Date.now().toString().slice(-8);
}

function generateCustomerId() {
  return 'CUST' + String(dummyDatabase.customers.length + 1).padStart(3, '0');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    customers: dummyDatabase.customers.length,
    products: dummyDatabase.products.length,
    orders: dummyDatabase.orders.length
  });
});

// Debug endpoint to view dummy data
app.get('/debug/data', (req, res) => {
  res.json({
    customers: dummyDatabase.customers.length,
    products: dummyDatabase.products.length,
    orders: dummyDatabase.orders.length,
    active_carts: Object.keys(dummyDatabase.carts).length,
    sample_customer: dummyDatabase.customers[0],
    sample_products: dummyDatabase.products.slice(0, 3)
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 MyCCBA WhatsApp Flow webhook server running on port ${PORT}`);
  console.log(`📊 Loaded ${dummyDatabase.customers.length} customers, ${dummyDatabase.products.length} products`);
  console.log(`🔗 Webhook endpoint: http://localhost:${PORT}/webhook/whatsapp-flow`);
  console.log(`💾 Using dummy data - no database required`);
});

module.exports = app;