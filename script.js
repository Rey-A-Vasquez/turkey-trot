        // --- JavaScript (Robust Version) ---
        
        // Get elements
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        const targetDateEl = document.getElementById('target-date'); // Added

        let timerInterval = null; // To store the interval ID

        /**
         * Calculates the 4th Thursday of November for a given year.
         * Target time is 8:00 AM PST (UTC-8), which is 16:00 UTC.
         */
        function findThanksgiving(year) {
            // Find the first day of November (month is 0-indexed, so 10 is November)
            const firstOfNov = new Date(Date.UTC(year, 10, 1));
            const firstDayOfWeek = firstOfNov.getUTCDay(); // 0 = Sunday, 4 = Thursday

            // Find the date of the first Thursday
            const firstThursday = 1 + (4 - firstDayOfWeek + 7) % 7;

            // The 4th Thursday is 3 weeks (21 days) after the 1st Thursday
            const fourthThursday = firstThursday + 21;

            // Set the target date in UTC. 8:00 AM PST (UTC-8) is 16:00 UTC.
            // Note: PST is UTC-8, PDT is UTC-7. We stick to GMT-8 as requested.
            return new Date(Date.UTC(year, 10, fourthThursday, 16, 0, 0));
        }

        /**
         * Determines the correct *upcoming* Thanksgiving target date.
         */
        function getNextTargetDate() {
            const now = new Date();
            let year = now.getFullYear();
            let target = findThanksgiving(year);

            // If this year's Thanksgiving (at 8am PST) has already passed
            if (target < now) {
                // Get next year's Thanksgiving
                target = findThanksgiving(year + 1);
            }
            return target;
        }

        // Add leading zero to numbers < 10
        function formatTime(time) {
            return time < 10 ? `0${time}` : time;
        }

        // Main countdown function
        function startCountdown() {
            // Get the target date *once*
            const targetDate = getNextTargetDate();

            // --- Display the target date (for debugging) ---
            // We show it in the user's local time
            const targetLocaleString = targetDate.toLocaleString("en-US", {
                dateStyle: "full",
                timeStyle: "full"
            });
            targetDateEl.textContent = `Target: ${targetLocaleString}`;
            // --- End of display ---

            // Clear any existing timer
            if (timerInterval) {
                clearInterval(timerInterval);
            }

            // Start a new timer
            timerInterval = setInterval(() => {
                const now = new Date();
                const diff = targetDate - now; // Difference in milliseconds

                if (diff <= 0) {
                    // Time is up!
                    clearInterval(timerInterval);
                    // Set to 0 while we recalculate
                    daysEl.textContent = '0';
                    hoursEl.textContent = '00';
                    minutesEl.textContent = '00';
                    secondsEl.textContent = '00';
                    
                    // Recalculate for *next* year and restart
                    startCountdown(); 
                    return;
                }

                // Calculate time units
                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);

                // Update the HTML
                daysEl.textContent = d;
                hoursEl.textContent = formatTime(h);
                minutesEl.textContent = formatTime(m);
                secondsEl.textContent = formatTime(s);
            }, 1000);
        }

        // Run the timer immediately on page load
        startCountdown();