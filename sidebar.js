
const tabs = document.querySelectorAll('.icon-button');
    const content = document.getElementById('main-content');

    async function loadPage(url) {
      try {
        content.innerHTML = '<p>Loading...</p>';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Page not found');
        const html = await response.text();
        content.innerHTML = html;
        if(url == 'calendar.html') renderCalendar();
      } catch (err) {
        content.innerHTML = `<p style="color:red;">${err.message}</p>`;
      }
    }

    // Load default page
    loadPage('calendar.html');


    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Load page dynamically
        loadPage(tab.dataset.page);
      });
    });