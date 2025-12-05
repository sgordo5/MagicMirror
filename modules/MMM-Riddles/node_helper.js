const NodeHelper = require("node_helper");
const Log = require("logger");
const fs = require("node:fs");

var riddlesData = [];

module.exports = NodeHelper.create({
    // Override start method.

    start () {
        Log.log(`Starting node helper for: ${this.name}`);
    },

    socketNotificationReceived (notification, payload) {
        if (notification == "GET_RIDDLE_DATA") return this.getRiddleDataFromFile(payload);
    },

    getRiddleDataFromFile (payload) {
        Log.log('Received request to read riddles file')
        fs.readFile( payload.filePath, (err, data) => {
			if (err) {
				Log.error('Error reading riddles file:', err);
			}
			try {
				const parsed = JSON.parse(data);

				parsed.forEach(set => {
					if (!payload.skippedSets.includes(set.category)) {
						set.riddles.forEach(riddle => {
                            riddle.category = set.category;
							riddlesData.push(riddle);
                        });
					}
                });
                
				Log.log("Successfully read and parsed riddles");
                this.sendSocketNotification("RIDDLES_DATA", riddlesData);
			} catch (parseError) {
				console.error('Error parsing riddles JSON:', parseError);
			}
    	});
    }
});