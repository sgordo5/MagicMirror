var riddlesData = [];

Module.register("MMM-Riddles", {
	// Default module config.
	defaults: {
		showCategory: true,
		showQuestion: true,
		showAnswer: false,
		filePath: "./MMM-Riddles.json",
		skippedSets: []
	},

	start () {
		this.sendSocketNotification("GET_RIDDLE_DATA",{ 
			filePath: this.file(this.config.filePath),
			skippedSets: this.config.skippedSets
		});
	},

	getTemplate () {
		return "MMM-Riddles.njk";
	},

	getTemplateData () {
		const now = new Date(Date.now());
		const start = new Date(2025, 11, 3);
		
		// Get difference in days
		const diff = Math.abs(now - start)/1000/60/60/24;
		
		if (riddlesData.length > 0) {
			// One riddle per day
			const riddleIndex = Math.trunc(diff % riddlesData.length);

			const riddle = riddlesData[riddleIndex];

			return {
				showCategory: this.config.showCategory,
				showQuestion: this.config.showQuestion,
				showAnswer: this.config.showAnswer,
				category: riddle.category,
				question: riddle.question,
				answer: riddle.answer
			};
		} else {
			return {
				showCategory: this.config.showCategory,
				showQuestion: this.config.showQuestion,
				showAnswer: this.config.showAnswer,
				category: "",
				question: "",
				answer: ""
			}
		}
		
	},

	getStyles () {
		return ["MMM-Riddles.css"];
	},

	socketNotificationReceived (notification, payload) {
		if (notification === "RIDDLES_DATA") {
			riddlesData = payload;
			this.updateDom();
		}
	},

	notificationReceived (notification, payload, sender) {
		if(notification === "FLIP_SHOW_RIDDLE_ANSWER") {
			this.config.showAnswer = !this.config.showAnswer;
			this.updateDom();
			console.log("Flipped riddle answer showing")
		}
	}
});
