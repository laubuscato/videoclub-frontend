import React from 'react';
import './footer.css'; 

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">CINE RENT</div>
                    <div className="footer-sub">Videoclub</div>
                </div>
                <p className="footer-copy">
                    © {new Date().getFullYear()} Cine Rent · Todos los derechos reservados
                </p>
            </div>
        </footer>
    );
}

export default Footer;