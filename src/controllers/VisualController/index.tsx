import React, { FC, useEffect, useRef, useState } from 'react';
import { Box } from 'grommet';

export interface I_VisualController_Props {
	analyser: AnalyserNode | null;
	running: boolean;
}

const VisualController: FC<I_VisualController_Props> = ({ analyser, running }: I_VisualController_Props) => {
	const canvasRef = useRef<any>();
	const [canvasCtx, setCanvasCtx] = useState<any>(null);
	const [drawVisual, setDrawVisual] = useState<number>(0);

	useEffect(() => {
		setCanvasCtx(canvasRef.current.getContext('2d'));
	}, []);

	const visualize = () => {
		const WIDTH = canvasRef.current.width;
		const HEIGHT = canvasRef.current.height;

		if (!running || !analyser) return;

		const bufferLength = analyser.frequencyBinCount;
		console.log(bufferLength);
		const dataArray = new Uint8Array(bufferLength);

		canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

		//reference this using self
		const draw = () => {
			if (!running || !analyser) return;
			const setDrawVisual_ = requestAnimationFrame(draw);
			setDrawVisual(setDrawVisual_);
			analyser.getByteFrequencyData(dataArray);
			canvasCtx.fillStyle = 'rgb(0, 0, 0)';
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
			// const barWidth = (WIDTH / bufferLength) * 2.5;
			const barWidth = WIDTH / (bufferLength + 0.7);
			let barHeight;
			let x = 0;
			for (let i = 0; i < bufferLength; i++) {
				barHeight = dataArray[i];
				canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
				canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
				x += barWidth + 1;
			}
		};

		draw();
	};

	const stop = () => {
		if (canvasCtx) {
			window.cancelAnimationFrame(drawVisual);
			const WIDTH = canvasRef.current.width;
			const HEIGHT = canvasRef.current.height;
			canvasCtx.fillStyle = '#7D4CDB';
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
		}
	};

	useEffect(() => {
		if (running && analyser) {
			visualize();
		} else {
			stop();
		}
	}, [running]);

	return (
		<>
			<Box width="large" border={{ color: 'brand', size: 'small' }} pad="xsmall" alignSelf="center">
				<canvas height="100" ref={canvasRef}></canvas>
			</Box>
		</>
	);
};

export default VisualController;
