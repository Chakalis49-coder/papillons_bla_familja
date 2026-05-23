document.addEventListener("DOMContentLoaded", () => {

	// =========================
	// ✅ PATH AUTO (index ou /pages)
	// =========================
	const isSubPage = window.location.pathname.includes("/pages/");
	const DATA_PATH = isSubPage ? "../events.json" : "events.json";

	// =========================
	// ✅ MENU BURGER
	// =========================
	const hamburger = document.getElementById("hamburger") || document.querySelector(".hamburger");
	const navLinks = document.getElementById("navLinks") || document.querySelector(".nav-links");

	if (hamburger && navLinks) {

		hamburger.addEventListener("click", () => {
			navLinks.classList.toggle("active");
		});

		document.querySelectorAll(".nav-links a").forEach(link => {
			link.addEventListener("click", () => {
				navLinks.classList.remove("active");
			});
		});
	}

	// =========================
	// ✅ EVENTS (WIDGET + PAGE)
	// =========================
	let currentEvent = null;

	fetch(DATA_PATH)
		.then(res => res.json())
		.then(events => {

			const now = new Date();

			// ✅ PROCHAIN EVENT (widget)
			const nextEvent = events
				.map(e => ({ ...e, dateObj: new Date(e.date) }))
				.filter(e => e.dateObj >= now)
				.sort((a, b) => a.dateObj - b.dateObj)[0];

			if (nextEvent && document.getElementById("event-title")) {

				currentEvent = nextEvent;

				document.getElementById("event-title").textContent = nextEvent.title;
				document.getElementById("event-date").textContent = "📅 " + formatDate(nextEvent.date);
				document.getElementById("event-heure").textContent = "🕒 " + nextEvent.heure;
				document.getElementById("event-image").src = nextEvent.image;

				startPreciseCountdown(nextEvent.date, nextEvent.heure, "event-countdown");
			}

			// ✅ PAGE EVENEMENTS
			const container = document.getElementById("events-container");

			if (container) {

				const sortedEvents = events
					.map(e => ({ ...e, dateObj: new Date(e.date) }))
					.sort((a, b) => a.dateObj - b.dateObj);

				sortedEvents.forEach(event => {

					const card = document.createElement("div");
					card.classList.add("event-card");

					const id = "count-" + event.date.replace(/-/g, "");
					const imagePath = isSubPage ? "../" + event.image : event.image;

					card.innerHTML = `
                        <img src="${imagePath}" alt="event">
                        <h3>${event.title}</h3>
                        <p>📅 ${formatDate(event.date)}</p>
                        <p class="event-heure">🕒 ${event.heure}</p>
                        <p class="countdown" id="${id}"></p>

                        <button class="calendar-btn">Ajouter au calendrier</button>
                        <button class="share-btn">Partager</button>
                    `;

					container.appendChild(card);

					startPreciseCountdown(event.date, event.heure, id);

					// ✅ bouton calendrier
					const btn = card.querySelector(".calendar-btn");
					btn.addEventListener("click", () => {
						const date = event.date.replace(/-/g, "");
						const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${date}/${date}`;
						window.open(url, "_blank");
					});

					// ✅ ✅ ✅ BOUTON PARTAGER (CARD)
					const shareBtn = card.querySelector(".share-btn");

					shareBtn.addEventListener("click", async () => {

						const text = `${event.title}
📅 ${formatDate(event.date)}
🕒 ${event.heure}

🔥 Rejoins-nous en live !
https://www.tiktok.com/${event.alias}`;

						const imageUrl = isSubPage ? "../" + event.image : event.image;

						if (navigator.share && navigator.canShare) {

							try {
								const response = await fetch(imageUrl);
								const blob = await response.blob();
								const file = new File([blob], "event.jpg", { type: blob.type });

								await navigator.share({
									title: event.title,
									text: text,
									files: [file]
								});

							} catch (err) {

								// fallback sans image
								await navigator.share({
									title: event.title,
									text: text,
									url: `https://www.tiktok.com/${event.alias}`
								});
							}

						} else {
							navigator.clipboard.writeText(text);
							alert("Texte copié 📋");
						}
					});
				});
			}

			// ✅ GOOGLE CALENDAR (widget)
			const calendarBtn = document.getElementById("calendarBtn");

			if (calendarBtn) {
				calendarBtn.addEventListener("click", () => {

					if (!currentEvent) return;

					const date = currentEvent.date.replace(/-/g, "");
					const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(currentEvent.title)}&dates=${date}/${date}`;
					window.open(url, "_blank");
				});
			}

			// ✅ ✅ ✅ PARTAGE WIDGET
			const shareBtnWidget = document.getElementById("shareBtn");

			if (shareBtnWidget) {
				shareBtnWidget.addEventListener("click", async () => {

					if (!currentEvent) return;

					const text = `${currentEvent.title}
📅 ${formatDate(currentEvent.date)}
🕒 ${currentEvent.heure}

🔥 Rejoins-nous en live !
https://www.tiktok.com/${currentEvent.alias}`;

					if (navigator.share && navigator.canShare) {

						try {
							const response = await fetch(currentEvent.image);
							const blob = await response.blob();
							const file = new File([blob], "event.jpg", { type: blob.type });

							await navigator.share({
								title: currentEvent.title,
								text: text,
								files: [file]
							});

						} catch (err) {

							await navigator.share({
								title: currentEvent.title,
								text: text,
								url: `https://www.tiktok.com/${currentEvent.alias}`
							});
						}

					} else {
						navigator.clipboard.writeText(text);
						alert("Texte copié 📋");
					}
				});
			}

		})
		.catch(err => console.error("Erreur events:", err));
});


// =========================
// ✅ FORMAT DATE
// =========================
function formatDate(dateStr) {
	const date = new Date(dateStr);
	return date.toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric"
	});
}


// =========================
// ✅ COUNTDOWN
// =========================
function startPreciseCountdown(dateStr, heureStr, elementId) {

	const el = document.getElementById(elementId);
	if (!el) return;

	el.classList.add("countdown");

	const cleanHeure = heureStr.replace("H", ":");
	const target = new Date(`${dateStr}T${cleanHeure}:00`).getTime();

	function update() {
		const now = new Date().getTime();
		const diff = target - now;

		if (diff <= 0) {
			el.textContent = "🔥 EN COURS !";
			return;
		}

		const d = Math.floor(diff / (1000 * 60 * 60 * 24));
		const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
		const m = Math.floor((diff / (1000 * 60)) % 60);
		const s = Math.floor((diff / 1000) % 60);

		el.textContent = `⏳ ${d}j ${h}h ${m}m ${s}s`;
	}

	update();
	setInterval(update, 1000);
}


// =========================
// ✅ CHALLENGE
// =========================
fetch("challenge.json")
	.then(res => res.json())
	.then(challenge => {

		document.getElementById("challenge-title").textContent = challenge.title;
		document.getElementById("challenge-date").textContent =
			"📅 Fin : " + formatDate(challenge.date);

		document.getElementById("challenge-heure").textContent =
			"🕒 " + challenge.heure;

		document.getElementById("challenge-image").src = challenge.image;

		startPreciseCountdown(
			challenge.date,
			challenge.heure,
			"challenge-countdown"
		);
	})
	.catch(err => console.error("Erreur challenge:", err));
