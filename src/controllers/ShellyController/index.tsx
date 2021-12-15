import React, { FC, useEffect, useState } from 'react';
import { Box, Heading } from 'grommet';
import config from './config';

type T_ShellyTypes = 'shelly1' | 'shelly2' | 'shelly2.5' | 'shelly1pm';
type T_Endpoints = 'relay';
type T_Device = { ip: string; type: T_ShellyTypes; name: string };
type T_Channel = { name: string; threshold: number; devices: T_Device[]; delay?: number };

type T_DebugHTMLStatus_Value = { turn: 'on' | 'off'; timer?: string };
type T_DebugHTMLStatus = Record<string, T_DebugHTMLStatus_Value>;

type T_ShellyEndPoint = { endpoint: T_Endpoints; aliases: T_ShellyTypes[] };
type T_ShellyEndPoints = Record<T_Endpoints, T_ShellyEndPoint>;
type T_ShellyEndPointsMap = Record<T_Endpoints | T_ShellyTypes, T_Endpoints>;

const shellyEndPoints: T_ShellyEndPoints = {
	relay: {
		endpoint: 'relay',
		aliases: ['shelly1', 'shelly1pm', 'shelly2', 'shelly2.5'],
	},
};

const debug = true;
const threshold = 100;
const numberOflastTurnOns = 5;

export interface I_ShellyController_Props {
	analyser: AnalyserNode | null;
	running: boolean;
}

const ShellyController: FC<I_ShellyController_Props> = ({ analyser, running }: I_ShellyController_Props) => {
	const [channels, setChannels] = useState<T_Channel[]>([]);
	const [debugHTMLStatus, setDebugHTMLStatus] = useState<T_DebugHTMLStatus>({});
	const [shellyEndPointsMap, setShellyEndPointsMap] = useState<T_ShellyEndPointsMap>({} as T_ShellyEndPointsMap);
	const [percentFactor, setPercentFactor] = useState<number>(0);
	const [ipRangePrefix, setIpRangePrefix] = useState<string>('');

	let lastCalculatedChannel: number;
	let channelValuesSum: number;
	let channelValuesCount: number;
	let audioData: Uint8Array;

	const lastStatus: Record<string, boolean> = {};
	const statusHistory: Record<string, boolean[]> = {};
	const throttleTimer: Record<string, any> = {};

	useEffect(() => {
		const shellyEndPointsMap_: T_ShellyEndPointsMap = {} as T_ShellyEndPointsMap;
		for (const item in shellyEndPoints) {
			const _item = item as T_Endpoints;
			shellyEndPointsMap_[_item] = _item;
			for (const alias in shellyEndPoints[_item].aliases) {
				shellyEndPointsMap_[shellyEndPoints[_item].aliases[alias]] = _item;
			}
		}
		setShellyEndPointsMap(shellyEndPointsMap_);

		const channels_ = config.channels as T_Channel[];
		setChannels(channels_);
		setIpRangePrefix(config.ipRangePrefix);
		setPercentFactor(100 / channels_.length);
		const _debugHTMLStatus: T_DebugHTMLStatus = {};
		channels_.forEach((channel) => {
			channel.devices.forEach((device) => {
				_debugHTMLStatus[device.name] = { turn: 'off' };
			});
		});
		setDebugHTMLStatus(_debugHTMLStatus);
	}, []);

	const throttle = (callable: any, delay: number, timerId: string, ...args: any) => {
		if (throttleTimer[timerId]) {
			return;
		}
		callable(timerId, ...args);
		throttleTimer[timerId] = setTimeout(function () {
			throttleTimer[timerId] = undefined;
		}, delay);
	};

	const fillHTMLDebugData = (channelName: string, value: T_DebugHTMLStatus_Value) => {
		if (debug !== true) {
			return;
		}
		const _debugHTMLStatus: T_DebugHTMLStatus = { ...debugHTMLStatus };
		_debugHTMLStatus[channelName] = value;
		setDebugHTMLStatus(_debugHTMLStatus);
	};

	const shellyEndPoint = (item: T_ShellyTypes) => {
		return shellyEndPoints[shellyEndPointsMap[item]].endpoint;
	};

	const lights = (channelId: number, turnOn: boolean) => {
		if (channelId === undefined) {
			return;
		}
		statusHistory[channelId].push(turnOn);

		if (false === turnOn && turnOn === lastStatus[channelId]) {
			return;
		}

		lastStatus[channelId] = turnOn;
		const channel = channels[channelId];
		const turn = turnOn ? 'on' : 'off';
		const timer = turnOn ? '&timer=1' : '';
		const requestOptions = {
			method: 'GET',
			redirect: 'follow',
			mode: 'no-cors',
		};

		if (channel.devices === undefined) {
			return;
		}

		channel.devices.forEach(async (device: T_Device, deviceId: number) => {
			fillHTMLDebugData(device.name, { turn, timer });

			// console.log(
			// 	`http://${ipRangePrefix}.${device.ip}/${shellyEndPoint(
			// 		device.type,
			// 	)}/0?turn=${turn}${timer}${brightness}${color}`,
			// );
			// fetch(
			// 	`http://${ipRangePrefix}.${device.ip}/${shellyEndPoint(
			// 		device.type,
			// 	)}/0?turn=${turn}${timer}${brightness}${color}`,
			// 	requestOptions as any,
			// )
			// 	.then((response) => response.text())
			// 	.then((result) => console.log(result))
			// 	.catch((error) => console.log('error', error));
		});
	};

	const drawLightShow = (channelNumber: number, audioValue: number, bar: number) => {
		if (channelNumber > lastCalculatedChannel) {
			if (statusHistory[lastCalculatedChannel] === undefined) {
				statusHistory[lastCalculatedChannel] = [];
			}
			let channelThreshold = channels[lastCalculatedChannel].threshold || threshold;
			const lastFiveHistoricalStatus = statusHistory[lastCalculatedChannel].slice(-numberOflastTurnOns);
			const throttleDelay = channels[lastCalculatedChannel].delay || config.defaultDelay || 500;

			if (lastFiveHistoricalStatus.length > 0) {
				const lastTurnOns = lastFiveHistoricalStatus.reduce(
					(accumulator, currentValue) => (currentValue ? accumulator + 1 : accumulator),
					0,
				);
				const turnOnsFactor = lastTurnOns / numberOflastTurnOns;
				if (turnOnsFactor >= 1) {
					channelThreshold = channelThreshold * 1.5;
				} else if (turnOnsFactor <= 0.3) {
					channelThreshold = channelThreshold * 0.8;
				}
			}

			const calculatedValue = Math.floor(channelValuesSum / channelValuesCount);
			const turnOn = calculatedValue >= channelThreshold;
			if (turnOn) {
				console.log(
					channels[lastCalculatedChannel].name,
					'on',
					channelValuesSum,
					channelValuesCount,
					channelThreshold,
					audioValue,
				);
			}
			if (!turnOn) {
				console.log(
					channels[lastCalculatedChannel].name,
					'off',
					channelValuesSum,
					channelValuesCount,
					channelThreshold,
					audioValue,
				);
			}

			throttle(lights, throttleDelay, lastCalculatedChannel.toString(), turnOn);
			channelValuesCount = 1;
			channelValuesSum = 0;
		}
		channelValuesCount++;
		channelValuesSum = channelValuesSum + audioValue;
		lastCalculatedChannel = channelNumber;
	};

	const calculateChannel = (bar: number): number => {
		const percent = Math.floor((bar / 200) * 100);
		let channel = Math.ceil(percent / percentFactor) - 1;

		if (channel < 0) {
			channel = 0;
		} else if (channel >= channels.length) {
			channel = channels.length - 1;
		}
		return channel;
	};

	const draw = (audioData: Uint8Array) => {
		const _audioData = [...audioData];
		channelValuesSum = 0;
		channelValuesCount = 1;
		lastCalculatedChannel = 0;
		// _audioData.forEach((audioValue, bar) => {
		// 	if (audioValue > 170) {
		// 		console.log(audioValue, bar);
		// 		const channelNumber = calculateChannel(bar);
		// 		if (channelNumber) {
		// 			drawLightShow(channelNumber, audioValue, bar);
		// 		}
		// 	}
		// });
		const max = Math.max(..._audioData);
		const amount = _audioData.length;
		const indexOf = _audioData.indexOf(max);
		if (max > 170 && indexOf > 800) {
			console.log(max, amount, indexOf);
		}
	};

	const loopingFunction = () => {
		if (!running || !analyser) return;
		requestAnimationFrame(loopingFunction);
		// analyser.getByteFrequencyData(audioData);
		analyser.getByteTimeDomainData(audioData);
		draw(audioData);
	};

	useEffect(() => {
		if (running && analyser) {
			audioData = new Uint8Array(analyser.frequencyBinCount);
			loopingFunction();
		}
	}, [running]);

	return (
		<>
			{debug && debugHTMLStatus && (
				<Box direction="row" alignSelf="center" justify="center" margin="small" wrap flex>
					{Object.entries(debugHTMLStatus).map(([key, values], index: number) => (
						<Box key={`device-${index}`} pad="xsmall" margin="small">
							<Box>
								<Heading level="5" margin="none">
									{key}
								</Heading>
								<Box background={values.turn === 'off' ? 'light-3' : 'accent-4'}>
									<Box alignSelf="center">{values.turn ?? '-'}</Box>
								</Box>
							</Box>
						</Box>
					))}
				</Box>
			)}
		</>
	);
};

export default ShellyController;
