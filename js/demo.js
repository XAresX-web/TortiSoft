      // ==================== VARIABLES GLOBALES ====================
      let totalSales = 0;
      let totalKilos = 0;
      let totalTickets = 0;
      let salesData = [];
      let hourlyData = Array(12).fill(0);

      const inventory = [
        { name: "Maíz Blanco", stock: 850, unit: "kg", threshold: 300 },
        { name: "Maíz Amarillo", stock: 420, unit: "kg", threshold: 300 },
        { name: "Cal", stock: 125, unit: "kg", threshold: 50 },
        { name: "Gas LP", stock: 65, unit: "%", threshold: 30 },
        { name: "Bolsas 1kg", stock: 450, unit: "pzas", threshold: 200 },
        { name: "Bolsas 2kg", stock: 180, unit: "pzas", threshold: 100 },
      ];

      // ==================== FUNCIONES DE ACTUALIZACIÓN ====================
      function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString("es-MX", { hour12: false });
        document.getElementById("current-time").textContent = timeString;
      }

      function formatCurrency(amount) {
        return new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
          minimumFractionDigits: 0,
        }).format(amount);
      }

      function updateMetrics() {
        document.getElementById("total-sales").textContent =
          formatCurrency(totalSales);
        document.getElementById("total-kilos").textContent =
          totalKilos.toFixed(1) + " kg";
        document.getElementById("total-tickets").textContent = totalTickets;

        const avgTicket = totalTickets > 0 ? totalSales / totalTickets : 0;
        document.getElementById("avg-ticket").textContent =
          formatCurrency(avgTicket);

        // Simular cambios porcentuales
        document.getElementById("sales-change").textContent = (
          Math.random() * 30 +
          10
        ).toFixed(1);
        document.getElementById("kilos-change").textContent = (
          Math.random() * 25 +
          5
        ).toFixed(1);
        document.getElementById("tickets-change").textContent = totalTickets;
        document.getElementById("avg-change").textContent = (
          Math.random() * 15 +
          5
        ).toFixed(1);
      }

      function simulateNewSale() {
        const kilos = (Math.random() * 4 + 0.5).toFixed(2);
        const pricePerKg = 18 + Math.random() * 4;
        const amount = (kilos * pricePerKg).toFixed(2);
        const now = new Date();
        const time = now.toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const products = [
          "Tortilla Blanca",
          "Tortilla Amarilla",
          "Tostadas",
          "Masa",
        ];
        const product = products[Math.floor(Math.random() * products.length)];

        const paymentMethods = ["Efectivo", "Tarjeta", "Transferencia"];
        const payment =
          paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

        // Actualizar totales
        totalSales += parseFloat(amount);
        totalKilos += parseFloat(kilos);
        totalTickets++;

        // Agregar a datos por hora
        const hour = now.getHours();
        const hourIndex = hour % 12;
        hourlyData[hourIndex] += parseFloat(amount);

        // Crear elemento de venta
        const saleItem = document.createElement("li");
        saleItem.className = "sale-item new";
        saleItem.innerHTML = `
                <div class="sale-time">${time}</div>
                <div class="sale-info">
                    <h4>${product}</h4>
                    <div class="sale-details">${payment} • Ticket #${String(totalTickets).padStart(4, "0")}</div>
                </div>
                <div class="sale-weight">${kilos} kg</div>
                <div class="sale-amount">${formatCurrency(amount)}</div>
            `;

        const salesList = document.getElementById("sales-list");
        salesList.insertBefore(saleItem, salesList.firstChild);

        // Limitar a 10 ventas visibles
        while (salesList.children.length > 10) {
          salesList.removeChild(salesList.lastChild);
        }

        // Quitar clase "new" después de 2 segundos
        setTimeout(() => {
          saleItem.classList.remove("new");
        }, 2000);

        // Actualizar métricas
        updateMetrics();
        updateChart();

        // Actualizar inventario
        updateInventory(parseFloat(kilos));

        // Mostrar alerta
        if (Math.random() > 0.7) {
          showAlert(
            "success",
            "Venta Registrada",
            `${product} - ${formatCurrency(amount)}`,
          );
        }
      }

      function updateChart() {
        const chart = document.getElementById("hourly-chart");
        chart.innerHTML = "";

        const maxValue = Math.max(...hourlyData, 1);
        const currentHour = new Date().getHours();

        hourlyData.forEach((value, index) => {
          const barContainer = document.createElement("div");
          barContainer.style.flex = "1";
          barContainer.style.display = "flex";
          barContainer.style.flexDirection = "column";
          barContainer.style.alignItems = "center";

          const bar = document.createElement("div");
          bar.className = "chart-bar";
          const height = (value / maxValue) * 100;
          bar.style.height = `${Math.max(height, 10)}%`;
          bar.setAttribute("data-value", formatCurrency(value));

          const label = document.createElement("div");
          label.className = "chart-label";
          const hour = (currentHour - 11 + index) % 24;
          label.textContent = `${hour}:00`;

          barContainer.appendChild(bar);
          barContainer.appendChild(label);
          chart.appendChild(barContainer);
        });
      }

      function updateInventory(kilosUsed) {
        const inventoryList = document.getElementById("inventory-list");
        inventoryList.innerHTML = "";

        // Reducir stock de maíz
        inventory[0].stock = Math.max(0, inventory[0].stock - kilosUsed * 0.6);
        inventory[1].stock = Math.max(0, inventory[1].stock - kilosUsed * 0.4);

        inventory.forEach((item) => {
          const percentage = (item.stock / item.threshold) * 100;
          let status = "ok";
          let statusText = "OK";

          if (percentage < 100 && percentage >= 50) {
            status = "low";
            statusText = "Bajo";
          } else if (percentage < 50) {
            status = "critical";
            statusText = "Crítico";

            if (Math.random() > 0.95) {
              showAlert(
                "warning",
                "Inventario Bajo",
                `${item.name}: ${item.stock.toFixed(0)} ${item.unit}`,
              );
            }
          }

          const itemDiv = document.createElement("div");
          itemDiv.className = "inventory-item";
          itemDiv.innerHTML = `
                    <div class="inventory-name">${item.name}</div>
                    <div class="inventory-stock">
                        <span class="stock-value">${item.stock.toFixed(0)} ${item.unit}</span>
                        <span class="stock-status ${status}">${statusText}</span>
                    </div>
                `;
          inventoryList.appendChild(itemDiv);
        });
      }

      function showAlert(type, title, message) {
        const alertsContainer = document.getElementById("alerts-container");

        const icons = {
          success: "✅",
          warning: "⚠️",
          danger: "🚨",
        };

        const alert = document.createElement("div");
        alert.className = `alert ${type}`;
        alert.innerHTML = `
                <div class="alert-icon">${icons[type]}</div>
                <div class="alert-content">
                    <h4>${title}</h4>
                    <p>${message}</p>
                    <div class="alert-time">${new Date().toLocaleTimeString("es-MX")}</div>
                </div>
            `;

        alertsContainer.appendChild(alert);

        // Remover alerta después de 5 segundos
        setTimeout(() => {
          alert.style.opacity = "0";
          alert.style.transform = "translateX(100%)";
          setTimeout(() => alert.remove(), 300);
        }, 5000);

        // Limitar a 3 alertas
        while (alertsContainer.children.length > 3) {
          alertsContainer.removeChild(alertsContainer.firstChild);
        }
      }

      function generateReport() {
        showAlert(
          "success",
          "Reporte Generado",
          "El reporte del día ha sido creado y enviado a tu email",
        );
      }

      // ==================== INICIALIZACIÓN ====================
      function init() {
        // Actualizar reloj
        updateTime();
        setInterval(updateTime, 1000);

        // Generar datos iniciales
        hourlyData = hourlyData.map(() => Math.random() * 5000 + 1000);
        updateChart();
        updateInventory(0);

        // Simular ventas iniciales
        for (let i = 0; i < 5; i++) {
          setTimeout(simulateNewSale, i * 1000);
        }

        // Generar ventas aleatorias
        setInterval(() => {
          if (Math.random() > 0.3) {
            simulateNewSale();
          }
        }, 4000);

        // Alertas aleatorias
        setTimeout(() => {
          showAlert(
            "success",
            "Sistema Operativo",
            "Todos los sistemas funcionando correctamente",
          );
        }, 3000);

        setTimeout(() => {
          showAlert(
            "warning",
            "Corte de Caja",
            "Recuerda hacer el corte de caja al cierre del turno",
          );
        }, 8000);
      }

      // Iniciar cuando cargue la página
      window.addEventListener("load", init);
    