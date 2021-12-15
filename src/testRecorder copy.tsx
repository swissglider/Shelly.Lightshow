import React from 'react';
import PropTypes from 'prop-types'; // ES6
import { watchFile } from 'fs';

// export const AudioReactRecorder = ({ text }) => {
//   return <div className={styles.test}>BULLSWEET: {text}</div>
// }

export const RecordState = Object.freeze({
	START: 'start',
	PAUSE: 'pause',
	STOP: 'stop',
	NONE: 'none',
});

export default class AudioReactRecorder extends React.Component {
	canvasRef: any;
	leftchannel: any;
	rightchannel: any;
	volume: any;
	audioInput: any;
	sampleRate: any;
	AudioContext: any;
	context: any;
	analyser: any;
	canvas: any;
	canvasCtx: any;
	stream: any;
	tested: any;
	WIDTH: any;
	HEIGHT: any;
	CENTERX: any;
	CENTERY: any;
	leftBuffer: any;
	rightBuffer: any;
	drawVisual: any;
	//0 - constructor
	constructor(props: any) {
		super(props);

		this.canvasRef = React.createRef();
	}

	//TODO: add the props definitions
	static propTypes = {
		state: PropTypes.string,
		type: PropTypes.string.isRequired,
		backgroundColor: PropTypes.string,
		foregroundColor: PropTypes.string,
		canvasWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		canvasHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

		//method calls
		onStop: PropTypes.func,
	};
	static defaultProps = {
		state: RecordState.NONE,
		type: 'audio/wav',
		backgroundColor: 'rgb(200, 200, 200)',
		foregroundColor: 'rgb(0, 0, 0)',
		canvasWidth: 500,
		canvasHeight: 300,
	};

	//2 - mount
	componentDidMount() {
		this.init();
	}

	componentDidUpdate(prevProps: any) {
		// const { state } = this.props as any;

		this.checkState(prevProps.state);
	}

	checkState(previousState: any) {
		switch (previousState) {
			case RecordState.START:
				this.doIfState(RecordState.PAUSE, this.pause);
				this.doIfState(RecordState.STOP, this.stop);
				break;
			case RecordState.PAUSE:
				this.doIfState(RecordState.START, this.resume);
				this.doIfState(RecordState.STOP, this.stop);
				break;
			case RecordState.STOP:
				this.doIfState(RecordState.START, this.start);
				break;
			default:
				this.doIfState(RecordState.START, this.start);
				break;
		}
	}

	doIfState(state: any, cb: any) {
		if ((this.props as any).state == state) {
			cb && cb();
		}
	}

	//TODO: destroy request animation frame
	// componentWillUnmount() {}

	//TODO: change to state some conditionals
	init = async () => {
		this.leftchannel = [];
		this.rightchannel = [];
		this.volume = null;
		this.audioInput = null;
		this.sampleRate = null;
		this.AudioContext = window.AudioContext || (window as any).webkitAudioContext;
		this.context = null;
		this.analyser = null;
		this.canvas = this.canvasRef.current;
		this.canvasCtx = this.canvas.getContext('2d');
		this.stream = null;
		this.tested = false;

		(navigator as any).getUserMedia =
			(navigator as any).getUserMedia ||
			(navigator as any).webkitGetUserMedia ||
			(navigator as any).mozGetUserMedia;
	};

	//get mic stream
	getStream = (constraints: any) => {
		if (!constraints) {
			constraints = { audio: true, video: false };
		}

		return navigator.mediaDevices.getUserMedia(constraints);
	};

	setUpRecording = () => {
		this.context = new this.AudioContext();
		this.sampleRate = this.context.sampleRate;

		// creates a gain node
		this.volume = this.context.createGain();

		// creates an audio node from teh microphone incoming stream
		this.audioInput = this.context.createMediaStreamSource(this.stream);

		// Create analyser
		this.analyser = this.context.createAnalyser();

		// connect audio input to the analyser
		this.audioInput.connect(this.analyser);

		// connect analyser to the volume control
		// analyser.connect(volume);

		this.visualize();
		this.test();
	};

	test = () => {
		if (!this.analyser) return;

		this.analyser.fftSize = 2048;
		const bufferLength = this.analyser.fftSize;
		const dataArray = new Uint8Array(bufferLength);

		const self = this;

		while (this.analyser) {
			self.analyser.getByteTimeDomainData(dataArray);
			if (dataArray.some((e) => e > 200)) {
				console.log(dataArray.find((e) => e > 200));
			}
		}
	};

	visualize = () => {
		const { backgroundColor, foregroundColor } = this.props as any;

		this.WIDTH = this.canvas.width;
		this.HEIGHT = this.canvas.height;
		this.CENTERX = this.canvas.width / 2;
		this.CENTERY = this.canvas.height / 2;

		if (!this.analyser) return;

		this.analyser.fftSize = 2048;
		const bufferLength = this.analyser.fftSize;
		const dataArray = new Uint8Array(bufferLength);

		this.canvasCtx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

		//reference this using self
		const self = this;
		const draw = function () {
			self.drawVisual = requestAnimationFrame(draw);

			self.analyser.getByteTimeDomainData(dataArray);

			self.canvasCtx.fillStyle = backgroundColor;
			self.canvasCtx.fillRect(0, 0, self.WIDTH, self.HEIGHT);

			self.canvasCtx.lineWidth = 2;
			self.canvasCtx.strokeStyle = foregroundColor;

			self.canvasCtx.beginPath();

			const sliceWidth = (self.WIDTH * 1.0) / bufferLength;
			let x = 0;

			for (let i = 0; i < bufferLength; i++) {
				const v = dataArray[i] / 128.0;
				const y = (v * self.HEIGHT) / 2;

				if (i === 0) {
					self.canvasCtx.moveTo(x, y);
				} else {
					self.canvasCtx.lineTo(x, y);
				}

				x += sliceWidth;
			}

			self.canvasCtx.lineTo(self.canvas.width, self.canvas.height / 2);
			self.canvasCtx.stroke();
		};

		draw();
	};

	setupMic = async () => {
		//TODO: only get stream after clicking start
		try {
			(window as any).stream = this.stream = await this.getStream('');
			//TODO: on got stream
		} catch (err) {
			//TODO: error getting stream
			console.log('Error: Issue getting mic', err);
		}

		this.setUpRecording();
	};

	start = async () => {
		await this.setupMic();
	};

	stop = () => {
		this.closeMic();
	};

	pause = () => {
		this.closeMic();
	};

	resume = () => {
		this.setupMic();
	};

	closeMic = () => {
		this.stream.getAudioTracks().forEach((track: any) => {
			track.stop();
		});
		this.audioInput.disconnect(0);
		this.analyser.disconnect(0);
	};

	//1 - render
	render() {
		const { canvasWidth, canvasHeight } = this.props as any;

		return (
			<div className="audio-react-recorder">
				<canvas
					ref={this.canvasRef}
					width={canvasWidth}
					height={canvasHeight}
					className="audio-react-recorder__canvas"
				></canvas>
				<div>{this.analyser && this.analyser.fftSize ? this.analyser.fftSize : '-'}</div>
			</div>
		);
	}
}
