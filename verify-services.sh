#!/bin/bash

# Script para verificar que los servicios están funcionando
echo "Verificando servicios..."

services=(
    "Clientes:3001:/health"
    "Productos:3002:/health"
    "Ventas:3003:/health"
)

for service in "${services[@]}"; do
    IFS=':' read -r name port path <<< "$service"
    echo ""
    echo "Verificando servicio: $name (Puerto $port)"
    
    if curl -s -f "http://localhost:$port$path" > /dev/null 2>&1; then
        response=$(curl -s "http://localhost:$port$path")
        echo "✅ $name está funcionando correctamente"
        echo "   Respuesta: $response"
    else
        echo "❌ $name NO está respondiendo"
    fi
done

echo ""
echo "Verificación completada!"

