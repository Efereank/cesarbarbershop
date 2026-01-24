document.addEventListener('DOMContentLoaded', function() {
    iniciarAlertas();

})

    function iniciarAlertas(){
        autoOcultarAlertas(1000);
    }




    function autoOcultarAlertas(tiempo = 1000) {
    const alertas = document.querySelectorAll('.alerta');
    
    alertas.forEach(function(alerta) {
        setTimeout(function() {
            alerta.style.transition = 'all 0.5s ease';
            alerta.style.opacity = '0';
            alerta.style.transform = 'translateY(-20px)';
            alerta.style.maxHeight = '0';
            alerta.style.padding = '0';
            alerta.style.margin = '0';
            alerta.style.overflow = 'hidden';
            
            setTimeout(function() {
                if (alerta.parentNode) {
                    alerta.parentNode.removeChild(alerta);
                }
            }, 500);
            
        }, tiempo);
    });
}
