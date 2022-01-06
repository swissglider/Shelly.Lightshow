import { Box, Button } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
import VisualController from './VisualController';

const Controller: FC<any> = () => {
	const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
	const [audioInput, setAudioInput] = useState<MediaStreamAudioSourceNode | null>(null);
	const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
	const [running, setRunning] = useState<boolean>(false);
	const [stream, setStream] = useState<MediaStream | null>(null);

	useEffect(() => {
		// Some browsers partially implement mediaDevices. We can't just assign an object
		// with getUserMedia as it would overwrite existing properties.
		// Here, we will just add the getUserMedia property if it's missing.
		if (navigator.mediaDevices.getUserMedia === undefined) {
			navigator.mediaDevices.getUserMedia = function (constraints) {
				// First get ahold of the legacy getUserMedia, if present
				const getUserMedia =
					(navigator as any).webkitGetUserMedia ||
					(navigator as any).mozGetUserMedia ||
					(navigator as any).msGetUserMedia;

				// Some browsers just don't implement it - return a rejected promise with an error
				// to keep a consistent interface
				if (!getUserMedia) {
					return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
				}

				// Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
				return new Promise(function (resolve, reject) {
					getUserMedia.call(navigator, constraints, resolve, reject);
				});
			};
		}

		// (navigator as any).getUserMedia =
		// 	(navigator as any).getUserMedia ||
		// 	(navigator as any).webkitGetUserMedia ||
		// 	(navigator as any).mozGetUserMedia;

		const _audioCtx: AudioContext = new window.AudioContext() || (window as any).webkitAudioContext;
		setAudioCtx(_audioCtx);
	}, []);

	const setupMic = async () => {
		if (audioCtx === null) return;
		try {
			const analyser_ = audioCtx.createAnalyser();
			analyser_.minDecibels = -90;
			analyser_.maxDecibels = -10;
			analyser_.smoothingTimeConstant = 0.85;
			// analyser_.fftSize = 256;
			analyser_.fftSize = 64;
			setAnalyser(analyser_);

			const distortion = audioCtx.createWaveShaper();
			const gainNode = audioCtx.createGain();
			const biquadFilter = audioCtx.createBiquadFilter();
			const convolver = audioCtx.createConvolver();

			let stream_: MediaStream;
			(window as any).stream = stream_ = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
			const audioInput_ = audioCtx.createMediaStreamSource(stream_);
			setStream(stream_);

			audioInput_.connect(distortion);
			distortion.connect(biquadFilter);
			biquadFilter.connect(gainNode);
			convolver.connect(gainNode);
			gainNode.connect(analyser_);

			setAudioInput(audioInput_);

			// distortion.oversample = '2x';
			biquadFilter.gain.setTargetAtTime(0, audioCtx.currentTime, 0);
			biquadFilter.disconnect(0);
			biquadFilter.connect(gainNode);

			biquadFilter.type = 'lowshelf';
			biquadFilter.frequency.setTargetAtTime(1000, audioCtx.currentTime, 0);
			// biquadFilter.gain.setTargetAtTime(25, audioCtx.currentTime, 0);

			setRunning(true);
		} catch (err) {
			//TODO: error getting stream
			console.log('Error: Issue getting mic', err);
		}
	};

	const start = async () => {
		await setupMic();
	};

	const closeMic = () => {
		setRunning(false);
		if (analyser) {
			analyser.disconnect(0);
			setAnalyser(null);
		}
		if (audioInput) {
			audioInput.disconnect(0);
			setAudioInput(null);
		}
		if (stream) {
			stream.getAudioTracks().forEach((track: any) => {
				track.stop();
			});
			setStream(null);
		}
	};

	const stop = () => {
		closeMic();
	};

	return (
		<>
			<Box direction="row" justify="center" gap="medium" margin="small">
				{!running ? <Button onClick={start} label="Start" /> : <Button onClick={stop} label="Stop" />}
			</Box>

			<VisualController running={running} analyser={analyser} />
		</>
	);
};

export default Controller;
