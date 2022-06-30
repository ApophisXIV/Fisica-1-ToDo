// document.querySelectorAll(".chapter").forEach((chapter) => {
// 	const chapter_title = chapter.querySelector(".chapter-title");
// 	const pills = chapter.querySelectorAll(".card-pill-clickable");
// 	const pills_completed = Array.from(pills).filter((pill) => pill.classList.contains("complete")).length;
// 	chapter_title.innerHTML += ` (${pills_completed}/${pills.length})`;
// });

import initialize_cards_filters from "./card_filters.js";

/* -------------------------------------------------------------------------- */
/*                                     DB                                     */
/* -------------------------------------------------------------------------- */
const db_update = () => {
	const db = {};
	document.querySelectorAll(".card-pill-clickable").forEach((pill) => {
		const id = pill.id.replace("-status", "");
		const is_complete = pill.classList.contains("complete");
		const is_favorite = document.querySelector(`#${id}-fav`).classList.contains("fa-solid");

		db[id] = { is_complete, is_favorite };
	});

	localStorage.setItem("db", JSON.stringify(db));
};

const db_get_IDs = () => Object.keys(JSON.parse(localStorage.getItem("db")));

const init_cards_from_local_storage = () => {
	if (localStorage.getItem("db") === null) db_update();
	const db = JSON.parse(localStorage.getItem("db"));

	db_get_IDs().forEach((id) => {
		const pill = document.querySelector(`#${id}-status`);
		if (db[id].is_complete) pill.classList.replace("incomplete", "complete");
		if (db[id].is_favorite) document.querySelector(`#${id}-fav`).classList.replace("fa-regular", "fa-solid");
	});
};
/* -------------------------------------------------------------------------- */

const toggle_classes = (element, state_1, state_2, force_first_state = false) => {
	if (element.classList.contains(state_1)) element.classList.replace(state_1, state_2);
	else element.classList.replace(state_2, state_1);

	if (force_first_state) element.classList.replace(state_2, state_1);
};

const initialize_cards_ui = () => {
	// Click Listeners complete state
	document.querySelectorAll(".card-pill-clickable").forEach((pill) => {
		pill.addEventListener("click", (e) => {
			toggle_classes(e.target, "complete", "incomplete");
			db_update();
		});
	});
	// Click Listeners watch button
	document.querySelectorAll(".card-watch-btn").forEach((button) => {
		button.addEventListener("click", (e) => {
			const pill = document.getElementById(e.target.id.replace("-watch", "-status"));
			toggle_classes(pill, "complete", "incomplete", true); // Force complete state
			db_update();
		});
	});

	// Click Listeners fav state
	document.querySelectorAll(".fa-star").forEach((star) => {
		star.addEventListener("click", (e) => {
			toggle_classes(e.target, "fa-regular", "fa-solid");
			db_update();
		});
	});

	// Initialize from local storage
	init_cards_from_local_storage();

	// Initialize filters
	initialize_cards_filters();
};

export default initialize_cards_ui;
