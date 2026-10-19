document.addEventListener('DOMContentLoaded', () => {
    // Fecha y número autogenerado
    document.getElementById('fecha-actual').textContent = new Date().toLocaleDateString();
    document.getElementById('num-hoja').textContent = 'CAT-' + Date.now().toString().slice(-8);

    // Validación de DNI/CE
    const tipoDoc = document.getElementById('tipo-doc');
    const inputDoc = document.getElementById('num-doc');
    tipoDoc.addEventListener('change', () => {
        inputDoc.value = '';
        inputDoc.maxLength = (tipoDoc.value === 'DNI') ? 8 : 12;
    });

    // Envío (Aquí conectarás a tu futura Base de Datos)
    document.getElementById('rec-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Reclamo enviado. Hemos enviado una copia a su correo[cite: 8].');
    });
});