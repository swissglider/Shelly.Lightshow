import { grommet, Grommet } from 'grommet';
import React from 'react';
import './App.css';
import Controller from './controllers/controller';

const App = (): JSX.Element => {
	return (
		<>
			<Grommet theme={grommet}>
				<Controller />
			</Grommet>
		</>
	);
};

export default App;
