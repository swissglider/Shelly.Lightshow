import React, { FC } from 'react';
import { Box, Heading } from 'grommet';
import LigthListElement from './LightListElement';
import { T_Light } from '../db';

export interface I_LightList_Props {
	lights: T_Light[];
	onEditLight: any;
	onRemoveLight: any;
}

const LightList: FC<I_LightList_Props> = ({ lights, onEditLight, onRemoveLight }: I_LightList_Props) => {
	return (
		<Box border={{ color: 'dark-3', size: 'small' }} round="xsmall">
			<Heading level="3" margin="xsmall" alignSelf="center">
				Existing Lights
			</Heading>
			<Box border={[{ color: 'dark-3', size: 'small', side: 'bottom' }]} />
			{lights.map((light) => (
				<LigthListElement
					key={`hallo_${light.name}`}
					light={light}
					onEditLight={onEditLight}
					onRemoveLight={onRemoveLight}
				/>
			))}
		</Box>
	);
};

export default LightList;
