# Script de prueba para los microservicios
# PowerShell Script

Write-Host "=== Prueba de Microservicios ===" -ForegroundColor Cyan
Write-Host ""

# Colores
$success = "Green"
$error = "Red"
$info = "Yellow"

# Función para hacer requests
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Url,
        [object]$Body = $null
    )
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers -Body $jsonBody
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers
        }
        
        return @{ Success = $true; Data = $response }
    } catch {
        return @{ Success = $false; Error = $_.Exception.Message; StatusCode = $_.Exception.Response.StatusCode.value__ }
    }
}

# 1. Verificar salud de los servicios
Write-Host "1. Verificando salud de los servicios..." -ForegroundColor $info
$services = @(
    @{Name="Clientes"; Url="http://localhost:3001/health"},
    @{Name="Productos"; Url="http://localhost:3002/health"},
    @{Name="Ventas"; Url="http://localhost:3003/health"}
)

foreach ($service in $services) {
    $result = Invoke-ApiRequest -Method "GET" -Url $service.Url
    if ($result.Success) {
        Write-Host "   ✅ $($service.Name): OK" -ForegroundColor $success
    } else {
        Write-Host "   ❌ $($service.Name): Error - $($result.Error)" -ForegroundColor $error
        Write-Host "   ⚠️  Asegúrate de que los servicios estén corriendo" -ForegroundColor $error
        exit
    }
}

Write-Host ""

# 2. Crear un cliente
Write-Host "2. Creando un cliente..." -ForegroundColor $info
$clientData = @{
    name = "Juan Pérez"
    document = "12345678"
    address = "Calle Principal 123"
    phone = "555-1234"
    email = "juan.perez@example.com"
    observations = "Cliente preferencial"
}

$result = Invoke-ApiRequest -Method "POST" -Url "http://localhost:3001/clients" -Body $clientData
if ($result.Success) {
    $clientId = $result.Data.id
    Write-Host "   ✅ Cliente creado con ID: $clientId" -ForegroundColor $success
    Write-Host "   Datos: $($result.Data | ConvertTo-Json -Compress)" -ForegroundColor Gray
} else {
    Write-Host "   ❌ Error al crear cliente: $($result.Error)" -ForegroundColor $error
    $clientId = 1  # Usar ID por defecto si ya existe
    Write-Host "   ⚠️  Usando cliente existente con ID: $clientId" -ForegroundColor $info
}

Write-Host ""

# 3. Crear un producto
Write-Host "3. Creando un producto..." -ForegroundColor $info
$productData = @{
    code_sku = "PROD-001"
    name = "Laptop Dell XPS 15"
    category = "Electrónica"
    price_unit = 1500.00
    cost_unit = 1000.00
    stock_actual = 50
    stock_minimo = 10
    location = "Almacén A"
}

$result = Invoke-ApiRequest -Method "POST" -Url "http://localhost:3002/products" -Body $productData
if ($result.Success) {
    $productId = $result.Data.id
    Write-Host "   ✅ Producto creado con ID: $productId" -ForegroundColor $success
    Write-Host "   Datos: $($result.Data | ConvertTo-Json -Compress)" -ForegroundColor Gray
} else {
    Write-Host "   ❌ Error al crear producto: $($result.Error)" -ForegroundColor $error
    $productId = 1  # Usar ID por defecto si ya existe
    Write-Host "   ⚠️  Usando producto existente con ID: $productId" -ForegroundColor $info
}

Write-Host ""

# 4. Obtener cliente por ID
Write-Host "4. Consultando cliente por ID ($clientId)..." -ForegroundColor $info
$result = Invoke-ApiRequest -Method "GET" -Url "http://localhost:3001/clients/$clientId"
if ($result.Success) {
    Write-Host "   ✅ Cliente encontrado: $($result.Data.name)" -ForegroundColor $success
} else {
    Write-Host "   ❌ Error: $($result.Error)" -ForegroundColor $error
}

Write-Host ""

# 5. Obtener producto por ID
Write-Host "5. Consultando producto por ID ($productId)..." -ForegroundColor $info
$result = Invoke-ApiRequest -Method "GET" -Url "http://localhost:3002/products/$productId"
if ($result.Success) {
    Write-Host "   ✅ Producto encontrado: $($result.Data.name)" -ForegroundColor $success
    Write-Host "   Stock actual: $($result.Data.stock_actual)" -ForegroundColor Gray
} else {
    Write-Host "   ❌ Error: $($result.Error)" -ForegroundColor $error
}

Write-Host ""

# 6. Registrar una venta (consulta clientes y productos)
Write-Host "6. Registrando una venta (consulta microservicios de Clientes y Productos)..." -ForegroundColor $info
$saleData = @{
    client_id = $clientId
    products = @(
        @{
            product_id = $productId
            quantity = 2
        }
    )
}

$result = Invoke-ApiRequest -Method "POST" -Url "http://localhost:3003/sales" -Body $saleData
if ($result.Success) {
    $saleId = $result.Data.sale.id
    Write-Host "   ✅ Venta registrada exitosamente con ID: $saleId" -ForegroundColor $success
    Write-Host "   Total: $($result.Data.sale.total)" -ForegroundColor Gray
    Write-Host "   Detalles: $($result.Data.sale.details.Count) productos" -ForegroundColor Gray
} else {
    Write-Host "   ❌ Error al registrar venta: $($result.Error)" -ForegroundColor $error
    if ($result.StatusCode -eq 404) {
        Write-Host "   ⚠️  Verifica que el cliente y producto existan" -ForegroundColor $info
    } elseif ($result.StatusCode -eq 400) {
        Write-Host "   ⚠️  Verifica que haya stock suficiente" -ForegroundColor $info
    }
}

Write-Host ""

# 7. Obtener todas las ventas
Write-Host "7. Obteniendo todas las ventas..." -ForegroundColor $info
$result = Invoke-ApiRequest -Method "GET" -Url "http://localhost:3003/sales"
if ($result.Success) {
    Write-Host "   ✅ Total de ventas: $($result.Data.Count)" -ForegroundColor $success
} else {
    Write-Host "   ❌ Error: $($result.Error)" -ForegroundColor $error
}

Write-Host ""
Write-Host "=== Prueba completada ===" -ForegroundColor Cyan

