import React, { FC, useEffect, useRef, useState } from 'react';
import { Box, Heading } from 'grommet';
import { RadialSelected } from 'grommet-icons';
import { db, L_LightTypes_List, T_LightTypes } from '../../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { switchShelly } from '../../lighthandler/shelly1Handler';

export interface I_VisualController_Props {
	analyser: AnalyserNode | null;
	running: boolean;
}

const config: Record<string, any> = {
	volumeChangedLight: {
		timeout: 0, // timeout wait to switch off --> 0 no switch off
		waitTime: 500, // wait till next change in ms
		threshold: 0, // threshold if 0 no threshold
	},
	avarageLight: {
		timeout: 500,
		waitTime: 500,
		threshold: 1.2,
	},
	maxLight: {
		timeout: 500,
		waitTime: 500,
		threshold: 1.8,
	},
	avarageLong: {
		timeout: 5000,
		waitTime: 5000,
		threshold: 1.6,
	},
};

const lightStates: Record<T_LightTypes, boolean> = {};
const lightTypeStatus: Record<T_LightTypes, boolean> = L_LightTypes_List.reduce(
	(a, v) => ({ ...a, [v]: false }),
	{} as Record<T_LightTypes, boolean>,
);

// const lightTypeStatus: Record<T_LightTypes, boolean> = {
// 	volumeChangedLight: false,
// 	avarageLight: false,
// 	maxLight: false,
// 	avarageLong: false,
// };

const lastUpdates: Record<T_LightTypes, number> = L_LightTypes_List.reduce(
	(a, v) => ({ ...a, [v]: Date.now() }),
	{} as Record<T_LightTypes, number>,
);

// const lastUpdates: Record<T_LightTypes, number> = {
// 	volumeChangedLight: Date.now(),
// 	avarageLight: Date.now(),
// 	maxLight: Date.now(),
// 	avarageLong: Date.now(),
// };

const timeouts: Record<T_LightTypes, any> = L_LightTypes_List.reduce(
	(a, v) => ({ ...a, [v]: null }),
	{} as Record<T_LightTypes, any>,
);

// const timeouts: Record<T_LightTypes, any> = {
// 	volumeChangedLight: null,
// 	avarageLight: null,
// 	maxLight: null,
// 	avarageLong: null,
// };

const avarageLightTotalArray: number[] = [];
const avarageLongLightTotalArray: number[] = [];

const VisualController: FC<I_VisualController_Props> = ({ analyser, running }: I_VisualController_Props) => {
	const canvasRefBar = useRef<any>();
	const [canvasCtxBar, setCanvasCtxBar] = useState<any>(null);
	const [drawVisualBar, setDrawVisualBar] = useState<number>(0);

	const canvasRefTotal = useRef<any>();
	const [canvasCtxTotal, setCanvasCtxTotal] = useState<any>(null);
	const [drawVisualTotal, setDrawVisualTotal] = useState<number>(0);

	// to force render
	const [, updateState] = React.useState();
	const forceUpdate = React.useCallback(() => updateState({} as any), []);

	const lights = useLiveQuery(() => db.lights.toArray());

	useEffect(() => {
		setCanvasCtxBar(canvasRefBar.current.getContext('2d'));
		setCanvasCtxTotal(canvasRefTotal.current.getContext('2d'));
	}, []);

	useEffect(() => {
		console.log('useEffect');
		if (lights) {
			for (const lightConf of lights) {
				lightStates[lightConf.name] = false;
				// switch off real shelly
				switchShelly(lightConf, 'off');
			}
		}
	}, [lights]);

	const switchLight = (lightType: T_LightTypes, on: boolean) => {
		const _now = Date.now();
		if (_now - lastUpdates[lightType] >= config[lightType].waitTime && lightTypeStatus[lightType] !== on) {
			clearTimeout(timeouts[lightType]);
			lastUpdates[lightType] = _now;

			lightTypeStatus[lightType] = on;

			if (lights) {
				for (const lightConf of lights) {
					if (lightConf.lightType === lightType) {
						lightStates[lightConf.name] = on;
						// switch real shelly
						switchShelly(lightConf, on ? 'on' : 'off');
					}
				}
			}

			if (config[lightType].timeout !== 0) {
				timeouts[lightType] = setTimeout(() => {
					lightTypeStatus[lightType] = false;
					if (lights) {
						for (const lightConf of lights) {
							if (lightConf.lightType === lightType) {
								lightStates[lightConf.name] = false;
								switchShelly(lightConf, on ? 'off' : 'on');
							}
						}
					}
				}, config[lightType].timeout);
			}
		}
	};

	const visiualizeTotal = (bufferLength: number, dataArray: Uint8Array) => {
		const WIDTH = canvasRefTotal.current.width;
		const HEIGHT = canvasRefTotal.current.height;

		if (!running || !analyser) return;

		canvasCtxTotal.clearRect(0, 0, WIDTH, HEIGHT);

		let firstTime = true;

		const draw = () => {
			if (!running || !analyser) return;
			analyser.getByteFrequencyData(dataArray);
			const setDrawVisual_ = requestAnimationFrame(draw);
			setDrawVisualTotal(setDrawVisual_);
			canvasCtxTotal.fillStyle = 'rgb(51, 51, 51)';
			canvasCtxTotal.fillRect(0, 0, WIDTH, HEIGHT);
			// const barWidth = (WIDTH / bufferLength) * 2.5;
			const barWidth = WIDTH / 10;

			// total avarage (volumeChanged)
			const _totalAv =
				avarageLightTotalArray.reduce((accumulator, curr) => accumulator + curr, 0) /
				avarageLightTotalArray.length;
			const _last50totalAv = avarageLightTotalArray.slice(avarageLightTotalArray.length < -64 ? -1 : -6);
			const _last50totalAv_av =
				_last50totalAv.reduce((accumulator, curr) => accumulator + curr, 0) / _last50totalAv.length;
			canvasCtxTotal.fillStyle = 'rgb(' + (_totalAv + 100) + ',200,200)';
			canvasCtxTotal.fillRect(
				((WIDTH + 6) / 5 - barWidth / 2) * 1,
				HEIGHT - _totalAv / 2,
				barWidth,
				_totalAv / 2,
			);

			// volume getting up
			if (_totalAv < _last50totalAv_av) {
				switchLight('volumeChangedLight', true);
			}
			// volume getting down
			if (_totalAv > _last50totalAv_av) {
				switchLight('volumeChangedLight', false);
			}

			//avarage * 3 (avarage)
			const _last500totalAv = avarageLightTotalArray.slice(avarageLightTotalArray.length < -30 ? -1 : -30);
			const _last500totalAv_av =
				_last500totalAv.reduce((accumulator, curr) => accumulator + curr, 0) / _last500totalAv.length;
			const _avX3 = (dataArray.reduce((accumulator, curr) => accumulator + curr, 0) / bufferLength) * 3;
			canvasCtxTotal.fillStyle = 'rgb(' + (_avX3 + 100) + ',200,200)';
			canvasCtxTotal.fillRect(((WIDTH + 6) / 5 - barWidth / 2) * 2, HEIGHT - _avX3 / 2, barWidth, _avX3 / 2);
			if (_avX3 > _last500totalAv_av * config['avarageLight'].threshold) {
				switchLight('avarageLight', true);
			}
			avarageLightTotalArray.push(_avX3);

			// max (max)
			const _max = dataArray.reduce((accumulator, curr) => (accumulator < curr ? curr : accumulator), 0);
			canvasCtxTotal.fillStyle = 'rgb(' + (_max + 100) + ',200,200)';
			canvasCtxTotal.fillRect(((WIDTH + 6) / 5 - barWidth / 2) * 3, HEIGHT - _max / 2, barWidth, _max / 2);
			if (_max > _last500totalAv_av * config['maxLight'].threshold) {
				switchLight('maxLight', true);
			}

			//avarage without 0 (avarageLong)
			const _last50Without0Av = avarageLongLightTotalArray.slice(
				avarageLongLightTotalArray.length < -100 ? -1 : -100,
			);
			const _last50Without0Av_av =
				_last50Without0Av.reduce((accumulator, curr) => accumulator + curr, 0) / _last50Without0Av.length;
			const _countAVWithout0 = dataArray.filter((e) => e !== 0).length;
			const _avWithout0 = dataArray.reduce((accumulator, curr) => accumulator + curr, 0) / _countAVWithout0;
			canvasCtxTotal.fillStyle = 'rgb(' + (_avWithout0 + 100) + ',200,200)';
			canvasCtxTotal.fillRect(
				((WIDTH + 6) / 5 - barWidth / 2) * 4,
				HEIGHT - _avWithout0 / 2,
				barWidth,
				_avWithout0 / 2,
			);
			if (_avWithout0 > _last50Without0Av_av * config['avarageLong'].threshold) {
				switchLight('avarageLong', true);
			}
			avarageLongLightTotalArray.push(_avWithout0);

			if (firstTime) console.log(dataArray);
			firstTime = false;
		};
		draw();
	};

	const visualizeBar = (bufferLength: number, dataArray: Uint8Array) => {
		const WIDTH = canvasRefBar.current.width;
		const HEIGHT = canvasRefBar.current.height;

		if (!running || !analyser) return;

		console.log(bufferLength);

		canvasCtxBar.clearRect(0, 0, WIDTH, HEIGHT);

		//reference this using self
		const draw = () => {
			if (!running || !analyser) return;
			const setDrawVisual_ = requestAnimationFrame(draw);
			setDrawVisualBar(setDrawVisual_);
			analyser.getByteFrequencyData(dataArray);
			canvasCtxBar.fillStyle = 'rgb(51, 51, 51)';
			canvasCtxBar.fillRect(0, 0, WIDTH, HEIGHT);
			// const barWidth = (WIDTH / bufferLength) * 2.5;
			const barWidth = WIDTH / (bufferLength + 0.7);
			let barHeight;
			let x = 0;
			for (let i = 0; i < bufferLength; i++) {
				barHeight = dataArray[i];
				canvasCtxBar.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
				canvasCtxBar.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
				x += barWidth + 1;
			}
		};

		draw();
	};

	const stop = () => {
		if (canvasCtxBar) {
			window.cancelAnimationFrame(drawVisualBar);
			const WIDTH = canvasRefBar.current.width;
			const HEIGHT = canvasRefBar.current.height;
			canvasCtxBar.clearRect(0, 0, WIDTH, HEIGHT);
		}
		if (canvasCtxTotal) {
			window.cancelAnimationFrame(drawVisualTotal);
			const WIDTH1 = canvasRefTotal.current.width;
			const HEIGHT1 = canvasRefTotal.current.height;
			canvasCtxTotal.clearRect(0, 0, WIDTH1, HEIGHT1);
		}
	};

	useEffect(() => {
		if (running && analyser) {
			Object.keys(lightStates).forEach((key) => {
				lightStates[key] = false;
			});
			const bufferLength = analyser.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			visualizeBar(bufferLength, dataArray);
			visiualizeTotal(bufferLength, dataArray);
		} else {
			stop();
		}
	}, [running]);

	const switchLightState = (lightName: string, lightCurrentState: boolean) => {
		if (running) {
			console.log('only if animation is off');
			return;
		}

		lightStates[lightName] = !lightCurrentState;
		console.log(lightStates, lightName, !lightCurrentState);
		forceUpdate();
		const _light = lights?.find((e) => e.name == lightName);
		if (_light) switchShelly(_light, !lightCurrentState ? 'on' : 'off');
	};

	return (
		<Box alignSelf="center" pad="small" justify="center" gap="medium">
			<Box direction="row" gap="small" justify="center">
				<Box
					pad="xsmall"
					alignSelf="center"
					border={{ color: 'dark-2', size: 'medium' }}
					round="medium"
					// elevation="small"
				>
					<Box alignSelf="center">Bar</Box>
					<canvas width="300" height="100" ref={canvasRefBar}></canvas>
					<Box direction="row" justify="around" margin="small">
						<Box>
							<RadialSelected color="brand" size="small" opacity="0" />
						</Box>
					</Box>
				</Box>
				<Box
					pad="xsmall"
					alignSelf="center"
					border={{ color: 'dark-2', size: 'medium' }}
					round="medium"
					// elevation="small"
				>
					<Box alignSelf="center">Total</Box>
					<canvas width="50" height="100" ref={canvasRefTotal}></canvas>
					<Box direction="row" justify="around" margin="small">
						{Object.entries(lightTypeStatus).map(([key, value]) => (
							<Box key={'lightTypeStatus_' + key}>
								<RadialSelected color={value ? 'status-warning' : 'status-disabled'} size="small" />
							</Box>
						))}
					</Box>
				</Box>
			</Box>
			{lights && (
				<Box pad="xsmall" alignSelf="center">
					<Box direction="row" justify="around" margin="small">
						{Object.entries(lights).map(([key, value]) => (
							<Box key={`lights-${key}`} pad="small" margin="small" align="center" gap="small">
								<Heading level="5" margin="none">
									{(value as any).name}
								</Heading>
								<RadialSelected
									color={lightStates[(value as any).name] ? 'status-warning' : 'status-disabled'}
									size="large"
									onClick={() =>
										switchLightState((value as any).name, lightStates[(value as any).name])
									}
								/>
							</Box>
						))}
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default VisualController;
