module.exports = {
	networks: {},

	// Set default mocha options here, use special reporters etc.
	mocha: {
		useColors: false,
		reporter: "mochawesome",
		reporterOptions: {
			reportFilename: process.env.UNIT_TEST_OUTPUT_FILE + ".json",
			json: true,
			html: false,
		},
	},

	// Configure your compilers
	compilers: {
		solc: {
			version: "0.8.19",
			settings: {
				optimizer: {
					enabled: false,
				},
			},
		},
	},
};
