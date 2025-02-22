// Enable nested dropdowns
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (this.classList.contains('dropdown-item')) {
                e.stopPropagation();
                e.preventDefault();
                const submenu = this.nextElementSibling;
                const allSubmenus = document.querySelectorAll('.dropdown-menu .dropdown-menu');
                allSubmenus.forEach(menu => {
                    if (menu !== submenu) {
                        menu.style.display = 'none';
                    }
                });
                submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
});
