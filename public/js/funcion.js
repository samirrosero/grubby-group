document.addEventListener('DOMContentLoaded', async function () {
    const path = window.location.pathname;
    const API_PATIENTS = '/api/pacientes';
    const API_APPOINTMENTS = '/api/citas';

    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const toast = document.getElementById('toast');

    // --- LÓGICA DEL MENÚ RESPONSIVE ---
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Cambia el icono de hamburguesa por una X
            menuToggle.innerHTML = navLinks.classList.contains('active') ? '&times;' : '&#9776;';
        });
    }

    function showToast(msg, type = 'success') {
        if (!toast) return;
        toast.textContent = msg;
        toast.className = `toast ${type}`; // Cambia color según el tipo
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    function renderTable(headers, rows) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const trh = document.createElement('tr');
        headers.forEach(h => {
            const th = document.createElement('th');
            th.textContent = h;
            trh.appendChild(th);
        });
        thead.appendChild(trh);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        rows.forEach(r => {
            const tr = document.createElement('tr');
            r.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        return table;
    }

    // --- SECCIÓN REGISTRO ---
    if (path === '/registro') {
        const form = document.getElementById('patient-form');
        const listEl = document.getElementById('patient-list');

        async function loadPatients() {
            const res = await fetch(API_PATIENTS);
            const patients = await res.json();
            // 1. GUARDAR EN LOCAL STORAGE PARA INSPECCIÓN
            localStorage.setItem('debug_pacientes', JSON.stringify(patients));
            
            if (listEl && patients.length) {
                listEl.innerHTML = '';
                const headers = ['ID', 'Nombre', 'Nacimiento', 'Género'];
                const rows = patients.map(p => [p.id, p.nombre, p.fecha_nacimiento, p.genero]);
                listEl.appendChild(renderTable(headers, rows));
            }
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                nombre: document.getElementById('nombre').value,
                fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
                genero: document.getElementById('genero').value
            };

            const res = await fetch(API_PATIENTS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                showToast('Paciente guardado en SQL y LocalStorage');
                form.reset();
                loadPatients();
            }
        });
        loadPatients();
    }

    // --- SECCIÓN AGENDAR ---
    if (path === '/agendar') {
        const form = document.getElementById('appointment-form');
        const patientSelect = document.getElementById('patient-select');

        async function init() {
            // Cargar pacientes para el select
            const resP = await fetch(API_PATIENTS);
            const patients = await resP.json();
            patients.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.textContent = p.nombre;
                patientSelect.appendChild(opt);
            });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                paciente_id: document.getElementById('patient-select').value,
                fecha: document.getElementById('fecha').value,
                hora: document.getElementById('hora').value,
                medico: document.getElementById('medico').value,
                motivo: document.getElementById('motivo').value
            };

            const res = await fetch(API_APPOINTMENTS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                // 1. guardar en localstorage todas las citas en un arreglo
                const existing = JSON.parse(localStorage.getItem('citas_agendadas') || '[]');
                existing.push(data);
                localStorage.setItem('citas_agendadas', JSON.stringify(existing));
                showToast('Cita agendada con éxito');
                form.reset();
            }
        });
        init();
    }
});