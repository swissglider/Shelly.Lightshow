const config = {
	ipRangePrefix: '192.168.0',
	defaultDelay: 200,
	channels: [
		{
			name: 'Schneemann links',
			// threshold: 165,
			threshold: 1,
			devices: [
				{
					ip: '11',
					type: 'shelly1',
					name: 'Schneemann links',
				},
			],
		},
		{
			name: 'channel2',
			threshold: 180,
			delay: 100,
			devices: [
				{
					ip: '12',
					type: 'shelly1',
					name: 'Lichter links',
				},
				{
					ip: '13',
					type: 'shelly1',
					name: 'Lichter rechts',
				},
			],
		},
		{
			name: 'channel4',
			threshold: 140,
			devices: [
				{
					ip: '15',
					type: 'shelly1',
					name: 'Schneemann rechts',
				},
			],
		},
	],
};

export default config;
