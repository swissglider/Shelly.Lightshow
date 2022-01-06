import { Box, Button, grommet, Grommet, Header, Heading, Layer, Main } from 'grommet';
import React, { useState } from 'react';
import './App.css';
import Controller from './controllers/controller';
import Configuration from './configuration/config';

const App = (): JSX.Element => {
	const [showConfig, setShowConfig] = useState<boolean>(false);

	return (
		<>
			<Grommet theme={grommet} background="dark-1">
				{!showConfig && (
					<Box
						justify="center"
						alignSelf="center"
						margin="small"
						border={{ color: 'dark-3', size: 'small' }}
						round="medium"
						background="dark-1"
					>
						<Header
							height="xxsmall"
							round={{ corner: 'top', size: 'large' }}
							justify="between"
							margin={{ horizontal: 'small' }}
						>
							<Heading level="3" margin="none">
								Lightshow with Shellys V0.0.17
							</Heading>
							<Box>
								<Button size="small" label="Settings" onClick={() => setShowConfig(true)} />
							</Box>
						</Header>
						<Box border={[{ color: 'dark-3', size: 'small', side: 'bottom' }]} />
						<Main alignSelf="center" pad="small" justify="center">
							<Controller />
						</Main>
					</Box>
				)}
				{showConfig && (
					<Configuration
						setClose={() => {
							setShowConfig(false);
						}}
					/>
				)}
			</Grommet>
		</>
	);
};

export default App;
