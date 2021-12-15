import React from 'react';

export default class AudioReactRecorder extends React.Component {
	canvasRef: any;
	audioInput: any;
	analyser: any;
	canvas: any;
	canvasCtx: any;
	stream: any;
	//0 - constructor
	constructor(props: any) {
		super(props);

		this.canvasRef = React.createRef();
	}

	static defaultProps = {
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

	//TODO: destroy request animation frame
	// componentWillUnmount() {}

	//TODO: change to state some conditionals
	init = async () => {
		this.audioInput = null;
		this.analyser = null;
		this.canvas = this.canvasRef.current;
		this.canvasCtx = this.canvas.getContext('2d');
		this.stream = null;
	};

	setUpRecording = () => {
		const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
		const context = new AudioContext();
		const sampleRate = context.sampleRate;

		// creates a gain node
		const volume = context.createGain();

		// creates an audio node from teh microphone incoming stream
		this.audioInput = context.createMediaStreamSource(this.stream);

		// Create analyser
		this.analyser = context.createAnalyser();

		// connect audio input to the analyser
		this.audioInput.connect(this.analyser);

		// connect analyser to the volume control
		// analyser.connect(volume);

		this.visualize();
	};

	visualize = () => {
		const { backgroundColor, foregroundColor } = this.props as any;

		const WIDTH = this.canvas.width;
		const HEIGHT = this.canvas.height;

		if (!this.analyser) return;

		this.analyser.fftSize = 2048;
		const bufferLength = this.analyser.fftSize;
		const dataArray = new Uint8Array(bufferLength);

		this.canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

		//reference this using self
		const self = this;
		const draw = function () {
			requestAnimationFrame(draw);

			self.analyser.getByteTimeDomainData(dataArray);

			self.canvasCtx.fillStyle = backgroundColor;
			self.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

			self.canvasCtx.lineWidth = 2;
			self.canvasCtx.strokeStyle = foregroundColor;

			self.canvasCtx.beginPath();

			const sliceWidth = (WIDTH * 1.0) / bufferLength;
			let x = 0;

			for (let i = 0; i < bufferLength; i++) {
				const v = dataArray[i] / 128.0;
				const y = (v * HEIGHT) / 2;

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
			(window as any).stream = this.stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false,
			});
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
			<>
				<div className="App">
					<header className="App-header">
						{/* <video id="video-chat" src={source}></video> */}
						<div>
							<div className="audio-react-recorder">
								<canvas
									ref={this.canvasRef}
									width={canvasWidth}
									height={canvasHeight}
									className="audio-react-recorder__canvas"
								></canvas>
								<div>{this.analyser && this.analyser.fftSize ? this.analyser.fftSize : '-'}</div>
							</div>

							<button onClick={this.start}>Start</button>
							<button onClick={this.stop}>Stop</button>
						</div>
					</header>
				</div>
			</>
		);
	}
}
