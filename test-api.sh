#!/bin/bash

# Script de prueba para los microservicios
# Bash Script

echo "=== Prueba de Microservicios ==="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Función para hacer requests
api_request() {
    local method=$1
    local url=$2
    local data=$3
    
    if [ -z "$data" ]; then
        curl -s -w "\n%{http_code}" -X "$method" "$url" -H "Content-Type: application/json"
    else
        curl -s -w "\n%{http_code}" -X "$method" "$url" -H "Content-Type: application/json" -d "$data"
    fi
}

# 1. Verificar salud de los servicios
echo -e "${YELLOW}1. Verificando salud de los servicios...${NC}"

services=(
    "Clientes:http://localhost:3001/health"
    "Productos:http://localhost:3002/health"
    "Ventas:http://localhost:3003/health"
)

for service in "${services[@]}"; do
    IFS=':' read -r name url <<< "$service"
    response=$(api_request "GET" "$url")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "   ${GREEN}✅ $name: OK${NC}"
    else
        echo -e "   ${RED}❌ $name: Error (HTTP $http_code)${NC}"
        echo -e "   ${RED}⚠️  Asegúrate de que los servicios estén corriendo${NC}"
        exit 1
    fi
done

echo ""

# 2. Crear un cliente
echo -e "${YELLOW}2. Creando un cliente...${NC}"
client_data='{
    "name": "Juan Pérez",
    "document": "12345678",
    "address": "Calle Principal 123",
    "phone": "555-1234",
    "email": "juan.perez@example.com",
    "observations": "Cliente preferencial"
}'

response=$(api_request "POST" "http://localhost:3001/clients" "$client_data")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 201 ]; then
    client_id=$(echo "$body" | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)
    echo -e "   ${GREEN}✅ Cliente creado con ID: $client_id${NC}"
    echo -e "   ${GRAY}Datos: $body${NC}"
else
    echo -e "   ${RED}❌ Error al crear cliente (HTTP $http_code)${NC}"
    echo -e "   ${YELLOW}⚠️  Usando cliente existente con ID: 1${NC}"
    client_id=1
fi

echo ""

# 3. Crear un producto
echo -e "${YELLOW}3. Creando un producto...${NC}"
product_data='{
    "code_sku": "PROD-001",
    "name": "Laptop Dell XPS 15",
    "category": "Electrónica",
    "price_unit": 1500.00,
    "cost_unit": 1000.00,
    "stock_actual": 50,
    "stock_minimo": 10,
    "location": "Almacén A"
}'

response=$(api_request "POST" "http://localhost:3002/products" "$product_data")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 201 ]; then
    product_id=$(echo "$body" | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)
    echo -e "   ${GREEN}✅ Producto creado con ID: $product_id${NC}"
    echo -e "   ${GRAY}Datos: $body${NC}"
else
    echo -e "   ${RED}❌ Error al crear producto (HTTP $http_code)${NC}"
    echo -e "   ${YELLOW}⚠️  Usando producto existente con ID: 1${NC}"
    product_id=1
fi

echo ""

# 4. Obtener cliente por ID
echo -e "${YELLOW}4. Consultando cliente por ID ($client_id)...${NC}"
response=$(api_request "GET" "http://localhost:3001/clients/$client_id")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 200 ]; then
    client_name=$(echo "$body" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    echo -e "   ${GREEN}✅ Cliente encontrado: $client_name${NC}"
else
    echo -e "   ${RED}❌ Error (HTTP $http_code)${NC}"
fi

echo ""

# 5. Obtener producto por ID
echo -e "${YELLOW}5. Consultando producto por ID ($product_id)...${NC}"
response=$(api_request "GET" "http://localhost:3002/products/$product_id")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 200 ]; then
    product_name=$(echo "$body" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    stock=$(echo "$body" | grep -o '"stock_actual":[0-9]*' | grep -o '[0-9]*')
    echo -e "   ${GREEN}✅ Producto encontrado: $product_name${NC}"
    echo -e "   ${GRAY}Stock actual: $stock${NC}"
else
    echo -e "   ${RED}❌ Error (HTTP $http_code)${NC}"
fi

echo ""

# 6. Registrar una venta
echo -e "${YELLOW}6. Registrando una venta (consulta microservicios de Clientes y Productos)...${NC}"
sale_data="{
    \"client_id\": $client_id,
    \"products\": [
        {
            \"product_id\": $product_id,
            \"quantity\": 2
        }
    ]
}"

response=$(api_request "POST" "http://localhost:3003/sales" "$sale_data")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 201 ]; then
    sale_id=$(echo "$body" | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)
    total=$(echo "$body" | grep -o '"total":[0-9.]*' | grep -o '[0-9.]*')
    echo -e "   ${GREEN}✅ Venta registrada exitosamente con ID: $sale_id${NC}"
    echo -e "   ${GRAY}Total: $total${NC}"
else
    echo -e "   ${RED}❌ Error al registrar venta (HTTP $http_code)${NC}"
    echo -e "   ${GRAY}$body${NC}"
fi

echo ""

# 7. Obtener todas las ventas
echo -e "${YELLOW}7. Obteniendo todas las ventas...${NC}"
response=$(api_request "GET" "http://localhost:3003/sales")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 200 ]; then
    count=$(echo "$body" | grep -o '"id"' | wc -l)
    echo -e "   ${GREEN}✅ Total de ventas: $count${NC}"
else
    echo -e "   ${RED}❌ Error (HTTP $http_code)${NC}"
fi

echo ""
echo "=== Prueba completada ==="

