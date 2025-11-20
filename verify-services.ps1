# Script para verificar que los servicios están funcionando
Write-Host "Verificando servicios..." -ForegroundColor Cyan

$services = @(
    @{Name="Clientes"; Port=3001; Path="/health"},
    @{Name="Productos"; Port=3002; Path="/health"},
    @{Name="Ventas"; Port=3003; Path="/health"}
)

foreach ($service in $services) {
    Write-Host "`nVerificando servicio: $($service.Name) (Puerto $($service.Port))" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($service.Port)$($service.Path)" -Method GET -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($service.Name) está funcionando correctamente" -ForegroundColor Green
            Write-Host "   Respuesta: $($response.Content)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ $($service.Name) NO está respondiendo" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    }
}

Write-Host "`nVerificación completada!" -ForegroundColor Cyan

