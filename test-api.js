// Script de prueba para los microservicios
// Node.js Script (requiere axios: npm install axios)

const axios = require('axios');

const BASE_URLS = {
    clients: 'http://localhost:3001',
    products: 'http://localhost:3002',
    sales: 'http://localhost:3003'
};

// Colores para la consola
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    gray: '\x1b[90m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testMicroservices() {
    log('\n=== Prueba de Microservicios ===\n', 'cyan');

    // 1. Verificar salud de los servicios
    log('1. Verificando salud de los servicios...', 'yellow');
    try {
        const healthChecks = await Promise.all([
            axios.get(`${BASE_URLS.clients}/health`),
            axios.get(`${BASE_URLS.products}/health`),
            axios.get(`${BASE_URLS.sales}/health`)
        ]);
        
        log('   ✅ Clientes: OK', 'green');
        log('   ✅ Productos: OK', 'green');
        log('   ✅ Ventas: OK', 'green');
    } catch (error) {
        log('   ❌ Error al verificar servicios', 'red');
        log(`   ⚠️  Asegúrate de que los servicios estén corriendo`, 'red');
        process.exit(1);
    }

    log('');

    // 2. Crear un cliente
    log('2. Creando un cliente...', 'yellow');
    let clientId;
    try {
        const clientData = {
            name: 'Juan Pérez',
            document: '12345678',
            address: 'Calle Principal 123',
            phone: '555-1234',
            email: 'juan.perez@example.com',
            observations: 'Cliente preferencial'
        };
        
        const response = await axios.post(`${BASE_URLS.clients}/clients`, clientData);
        clientId = response.data.id;
        log(`   ✅ Cliente creado con ID: ${clientId}`, 'green');
        log(`   Datos: ${JSON.stringify(response.data)}`, 'gray');
    } catch (error) {
        log(`   ❌ Error al crear cliente: ${error.response?.data?.error || error.message}`, 'red');
        clientId = 1; // Usar ID por defecto
        log(`   ⚠️  Usando cliente existente con ID: ${clientId}`, 'yellow');
    }

    log('');

    // 3. Crear un producto
    log('3. Creando un producto...', 'yellow');
    let productId;
    try {
        const productData = {
            code_sku: 'PROD-001',
            name: 'Laptop Dell XPS 15',
            category: 'Electrónica',
            price_unit: 1500.00,
            cost_unit: 1000.00,
            stock_actual: 50,
            stock_minimo: 10,
            location: 'Almacén A'
        };
        
        const response = await axios.post(`${BASE_URLS.products}/products`, productData);
        productId = response.data.id;
        log(`   ✅ Producto creado con ID: ${productId}`, 'green');
        log(`   Datos: ${JSON.stringify(response.data)}`, 'gray');
    } catch (error) {
        log(`   ❌ Error al crear producto: ${error.response?.data?.error || error.message}`, 'red');
        productId = 1; // Usar ID por defecto
        log(`   ⚠️  Usando producto existente con ID: ${productId}`, 'yellow');
    }

    log('');

    // 4. Obtener cliente por ID
    log(`4. Consultando cliente por ID (${clientId})...`, 'yellow');
    try {
        const response = await axios.get(`${BASE_URLS.clients}/clients/${clientId}`);
        log(`   ✅ Cliente encontrado: ${response.data.name}`, 'green');
    } catch (error) {
        log(`   ❌ Error: ${error.response?.data?.error || error.message}`, 'red');
    }

    log('');

    // 5. Obtener producto por ID
    log(`5. Consultando producto por ID (${productId})...`, 'yellow');
    try {
        const response = await axios.get(`${BASE_URLS.products}/products/${productId}`);
        log(`   ✅ Producto encontrado: ${response.data.name}`, 'green');
        log(`   Stock actual: ${response.data.stock_actual}`, 'gray');
    } catch (error) {
        log(`   ❌ Error: ${error.response?.data?.error || error.message}`, 'red');
    }

    log('');

    // 6. Registrar una venta (consulta clientes y productos)
    log('6. Registrando una venta (consulta microservicios de Clientes y Productos)...', 'yellow');
    try {
        const saleData = {
            client_id: clientId,
            products: [
                {
                    product_id: productId,
                    quantity: 2
                }
            ]
        };
        
        const response = await axios.post(`${BASE_URLS.sales}/sales`, saleData);
        const sale = response.data.sale;
        log(`   ✅ Venta registrada exitosamente con ID: ${sale.id}`, 'green');
        log(`   Total: $${sale.total}`, 'gray');
        log(`   Detalles: ${sale.details.length} productos`, 'gray');
    } catch (error) {
        log(`   ❌ Error al registrar venta: ${error.response?.data?.error || error.message}`, 'red');
        if (error.response?.status === 404) {
            log('   ⚠️  Verifica que el cliente y producto existan', 'yellow');
        } else if (error.response?.status === 400) {
            log('   ⚠️  Verifica que haya stock suficiente', 'yellow');
        }
    }

    log('');

    // 7. Obtener todas las ventas
    log('7. Obteniendo todas las ventas...', 'yellow');
    try {
        const response = await axios.get(`${BASE_URLS.sales}/sales`);
        log(`   ✅ Total de ventas: ${response.data.length}`, 'green');
    } catch (error) {
        log(`   ❌ Error: ${error.response?.data?.error || error.message}`, 'red');
    }

    log('');
    log('=== Prueba completada ===', 'cyan');
}

// Ejecutar las pruebas
testMicroservices().catch(error => {
    log(`\nError fatal: ${error.message}`, 'red');
    process.exit(1);
});

