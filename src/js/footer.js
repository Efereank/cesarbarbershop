document.addEventListener('DOMContentLoaded', function(){
    iniciarAppFooter();
});

function iniciarAppFooter() {
    inicializarFooter();
    actualizarFooterTotal();
    recrearElementosFooter();
}

function inicializarFooter() {
    let footer = document.querySelector('.footer-total');
    
    if (!footer) {
        footer = document.createElement('footer');
        footer.className = 'footer-total';
        footer.innerHTML = `

            <div class="total-info">
                <span class="total-label">Total seleccionado:</span>
                <span id="total-precio" class="total-precio">$0.00</span>
            </div>

            <div class="total-acciones">
                <span id="total-servicios">0 servicios seleccionados</span>
            </div>
        `;
        document.body.appendChild(footer);
        
        document.body.style.paddingBottom = '80px';
    }
    
    actualizarFooterTotal();
}

function actualizarFooterTotal() {
    const total = cita.servicios.reduce((sum, servicio) => {
        return sum + parseFloat(servicio.precio);
    }, 0);
    
    const cantidad = cita.servicios.length;
    
    const totalPrecioElement = document.getElementById('total-precio');
    const totalServiciosElement = document.getElementById('total-servicios');
    
    if (!totalPrecioElement || !totalServiciosElement) {
        recrearElementosFooter();
        return;
    }
    
    totalPrecioElement.textContent = `$${total.toFixed(2)}`;
    totalServiciosElement.textContent = 
        `${cantidad} ${cantidad === 1 ? 'servicio' : 'servicios'} seleccionado${cantidad === 1 ? '' : 's'}`;
}

function recrearElementosFooter() {
    const footer = document.querySelector('.footer-total');
    if (!footer) return;
    
    footer.innerHTML = `

        <div class="total-acciones">
            <span id="total-servicios">0 servicios <br> seleccionados</span>
        </div>

        <div class="total-info">
            <span class="total-label">Total seleccionado:</span>
            <span id="total-precio" class="total-precio">$0.00</span>
        </div>

    `;
    

}


