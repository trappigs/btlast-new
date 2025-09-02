// wwwroot/scripts/contact-appointment-form.js (DÜZELTİLMİŞ VE TAM VERSİYON)
(function () {
    'use strict';

    const form = document.getElementById('contactAppointmentForm');
    if (!form) return;

    // --- DEĞİŞKENLER ---
    const formContainer = document.getElementById('contactFormContainer');
    const submitButton = form.querySelector('.btn-submit');
    const appointmentTypes = form.querySelectorAll('input[name="AppointmentType"]');
    const dateTimeWrapper = document.getElementById('appointment-date-time-wrapper');
    const dateField = form.querySelector('#apptDate');
    const timeField = form.querySelector('#apptTime');
    let datepickerContainer = null;
    let currentDate = new Date(); // Takvimin o anki ayını tutar

    // --- BAŞLATMA ---
    function initializeForm() {
        initializeAppointmentTypeListener();
        initializeDatepicker();
        form.addEventListener('submit', handleFormSubmit);
    }

    // --- RANDEVU TÜRÜ DEĞİŞİKLİĞİ ---
    function initializeAppointmentTypeListener() {
        appointmentTypes.forEach(radio => {
            radio.addEventListener('change', handleAppointmentTypeChange);
        });
        handleAppointmentTypeChange();
    }

    function handleAppointmentTypeChange() {
        const selectedType = form.querySelector('input[name="AppointmentType"]:checked').value;
        const showDateTime = selectedType === 'Online Görüşme' || selectedType === 'Yüz Yüze Görüşme';

        if (showDateTime) {
            dateTimeWrapper.style.display = 'flex';
            dateField.required = true;
            timeField.required = true;
        } else {
            dateTimeWrapper.style.display = 'none';
            dateField.required = false;
            timeField.required = false;
            dateField.value = '';
            timeField.value = '';
        }
    }

    // --- ÖZEL TARİH SEÇİCİ (DATEPICKER) ---
    function initializeDatepicker() {
        if (!dateField) return;

        dateField.addEventListener('click', (e) => {
            e.stopPropagation(); 
            if (!datepickerContainer) {
                createDatepicker();
            }
            const isVisible = datepickerContainer.style.display === 'block';
            if (isVisible) {
                datepickerContainer.style.display = 'none';
            } else {
                currentDate = new Date(); 
                renderDatepicker();
                datepickerContainer.style.display = 'block';
                positionDatepicker();
            }
        });

        document.addEventListener('click', (e) => {
            if (datepickerContainer && !datepickerContainer.contains(e.target) && e.target !== dateField) {
                datepickerContainer.style.display = 'none';
            }
        });
    }

    function createDatepicker() {
        datepickerContainer = document.createElement('div');
        datepickerContainer.className = 'datepicker-container';
        dateField.parentElement.appendChild(datepickerContainer);
    }

    function renderDatepicker() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
        
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const now = new Date();
        const isPrevMonthDisabled = year < now.getFullYear() || (year === now.getFullYear() && month <= now.getMonth());

        datepickerContainer.innerHTML = `
            <div class="datepicker-header">
                <button type="button" class="datepicker-nav prev-month" ${isPrevMonthDisabled ? 'disabled' : ''}>&lt;</button>
                <div class="datepicker-month-year">${monthNames[month]} ${year}</div>
                <button type="button" class="datepicker-nav next-month">&gt;</button>
            </div>
            <div class="datepicker-days-header">
                <div>Pzt</div><div>Sal</div><div>Çrş</div><div>Prş</div><div>Cum</div><div>Cmt</div><div>Paz</div>
            </div>
            <div class="datepicker-days"></div>
        `;

        const daysContainer = datepickerContainer.querySelector('.datepicker-days');
        const dayOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

        for (let i = 0; i < dayOffset; i++) {
            daysContainer.innerHTML += `<div class="datepicker-day-empty"></div>`;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const thirtyDaysFromNow = new Date(today);
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        for (let day = 1; day <= daysInMonth; day++) {
            const dayButton = document.createElement('button');
            dayButton.type = 'button';
            dayButton.className = 'datepicker-day';
            dayButton.textContent = day;

            const currentDayDate = new Date(year, month, day);

            if (currentDayDate >= tomorrow && currentDayDate <= thirtyDaysFromNow) {
                dayButton.classList.add('available');
                dayButton.addEventListener('click', () => {
                    const selectedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    dateField.value = selectedDate;
                    datepickerContainer.style.display = 'none';
                    validateField(dateField);
                });
            } else {
                dayButton.classList.add('disabled');
                dayButton.disabled = true;
            }
            
            if (currentDayDate.getTime() === today.getTime()) {
                dayButton.classList.add('today');
            }
            if (dateField.value === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`) {
                dayButton.classList.add('selected');
            }

            daysContainer.appendChild(dayButton);
        }
        
        // DÜZELTME: Navigasyon butonlarına tıklandığında olayın yayılmasını engelle
        datepickerContainer.querySelector('.prev-month').addEventListener('click', (e) => {
            e.stopPropagation();
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderDatepicker();
        });
        datepickerContainer.querySelector('.next-month').addEventListener('click', (e) => {
            e.stopPropagation();
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderDatepicker();
        });
    }

    function positionDatepicker() {
        if (!datepickerContainer) return;
        datepickerContainer.style.top = `${dateField.offsetHeight + 5}px`;
        datepickerContainer.style.left = '0';
    }

    // --- FORM GÖNDERİMİ VE DOĞRULAMA (Değişiklik yok) ---
    async function handleFormSubmit(event) {
        event.preventDefault();
        if (!validateForm()) {
            showGlobalError('Lütfen işaretli alanları doğru bir şekilde doldurunuz.');
            return;
        }

        submitButton.disabled = true;
        submitButton.classList.add('loading');

        const formData = new FormData(form);
        const actionUrl = form.getAttribute('action');
        const token = form.querySelector('input[name="__RequestVerificationToken"]').value;

        try {
            const response = await fetch(actionUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'RequestVerificationToken': token,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            const data = await response.json();
            handleServerResponse(data);

        } catch (error) {
            console.error('Sunucuya gönderilirken hata oluştu:', error);
            showGlobalError('Ağ hatası oluştu. Lütfen daha sonra tekrar deneyin.');
        } finally {
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    }

    function handleServerResponse(data) {
        clearAllErrors();
        if (data.success) {
            formContainer.innerHTML = `
                <div class="success-message">
                     <div class="success-icon">✓</div>
                     <h3>Teşekkür Ederiz!</h3>
                     <p>${data.message}</p>
                </div>`;
            formContainer.scrollIntoView({ behavior: 'smooth' });
        } else if (data.errors) {
            displayFieldErrors(data.errors);
            showGlobalError('Lütfen formdaki hataları düzelterek tekrar deneyin.');
        } else if (data.error) {
            showGlobalError(data.error);
        }
    }

    function validateForm() {
        clearAllErrors();
        let isValid = true;
        
        form.querySelectorAll('[required]:not([disabled])').forEach(field => {
            if (!validateField(field)) isValid = false;
        });

        const emailField = form.querySelector('#apptEmail');
        if (emailField && emailField.value.trim() !== '' && !validateField(emailField)) {
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateField(field) {
        const group = field.closest('.form-group, .checkbox-label, .appointment-types');
        let message = '';
        clearFieldErrors(group); 

        if (field.required) {
             if (field.type === 'radio') {
                const radioGroup = form.querySelectorAll(`input[name="${field.name}"]`);
                if (![...radioGroup].some(r => r.checked)) message = 'Lütfen bir seçim yapınız.';
            } else if (field.type === 'checkbox') {
                if (!field.checked) message = 'Bu alanı onaylamanız gerekmektedir.';
            } else if (!field.value.trim()) {
                message = 'Bu alan zorunludur.';
            }
        }
        
        if (field.type === 'email' && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            message = 'Geçerli bir e-posta adresi giriniz.';
        } else if (field.type === 'tel' && field.required && !/^[0-9\s\(\)\-\+]{10,}$/.test(field.value)) {
            message = 'Geçerli bir telefon numarası giriniz.';
        }

        if (message) {
            showFieldError(group, message);
            return false;
        }
        return true;
    }
    
    // --- HATA YÖNETİMİ (Değişiklik yok) ---
    function showFieldError(group, message) {
        group.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error-message';
        errorElement.textContent = message;
        if (group.classList.contains('checkbox-label')) {
             group.appendChild(errorElement);
        } else {
             group.insertAdjacentElement('beforeend', errorElement);
        }
    }
    
    function showGlobalError(message) {
        let container = form.querySelector('#global-error-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'global-error-container';
            container.style.width = '100%';
            form.insertBefore(container, form.firstChild);
        }
        container.innerHTML = `<div class="global-error" role="alert">${message}</div>`;
    }

    function clearAllErrors() {
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        form.querySelectorAll('.form-error-message, .global-error, #global-error-container').forEach(el => el.remove());
    }

    function clearFieldErrors(group) {
        group.classList.remove('error');
        const error = group.querySelector('.form-error-message');
        if(error) error.remove();
    }
    
    function displayFieldErrors(errors) {
        Object.keys(errors).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                const group = field.closest('.form-group, .checkbox-label, .appointment-types');
                if (group) showFieldError(group, errors[key][0]);
            }
        });
    }

    // --- FORMU BAŞLAT ---
    initializeForm();

})();