document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-reporte");
  const direccionInput = document.getElementById("direccion");
  const latInput = document.getElementById("lat");
  const lngInput = document.getElementById("lng");

  // Declarar geocoder en el ámbito superior para que esté disponible
  let geocoder;

  // Función para inicializar el mapa
  window.initMap = function () {
    const defaultLocation = { lat: 19.4326, lng: -99.1332 }; // CDMX
    const map = new google.maps.Map(document.getElementById("map"), {
      center: defaultLocation,
      zoom: 14,
    });

    // Inicializar geocoder
    geocoder = new google.maps.Geocoder();

    const marker = new google.maps.Marker({
      position: defaultLocation,
      map: map,
      draggable: true,
    });

    // Obtener dirección desde coordenadas
    function obtenerDireccion(lat, lng) {
      const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results[0]) {
          direccionInput.value = results[0].formatted_address;
        } else {
          direccionInput.value = "Dirección no disponible";
        }
      });
    }

    // Actualiza inputs y dirección
    function updateCoordinates(lat, lng) {
      latInput.value = lat;
      lngInput.value = lng;
      obtenerDireccion(lat, lng);
    }

    // Evento al mover marcador
    marker.addListener("dragend", () => {
      const newPos = marker.getPosition();
      updateCoordinates(newPos.lat(), newPos.lng());
    });

    // Actualizar coordenadas iniciales
    updateCoordinates(defaultLocation.lat, defaultLocation.lng);
  };

  // Envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch("/api/reportes", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Respuesta del servidor:", errorText);
        throw new Error("Error al enviar el reporte");
      }

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La respuesta del servidor no es JSON válida");
      }

      const data = await response.json();

      Swal.fire({
        icon: "success",
        title: "Reporte enviado",
        text: data.mensaje || "Se ha enviado correctamente",
      });

      form.reset();
      direccionInput.value = "";
      latInput.value = "";
      lngInput.value = "";
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo enviar el reporte. Intenta más tarde.",
      });
    }
  });
});
