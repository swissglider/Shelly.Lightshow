import React, { FC } from 'react';
import { Box, TextInput } from 'grommet';
import { T_Light } from '../db';
import { Edit, Trash } from 'grommet-icons';

export interface I_LigthListElement_Props {
	light: T_Light;
	onEditLight: any;
	onRemoveLight: any;
}

const LigthListElement: FC<I_LigthListElement_Props> = ({
	light,
	onEditLight,
	onRemoveLight,
}: I_LigthListElement_Props) => {
	return (
		<Box margin="medium" direction="row" gap="small" justify="around" align="center">
			<Box>
				<TextInput size="small" value={light.name} plain />
			</Box>
			<Box>
				<TextInput size="small" value={light.ip} plain />
			</Box>
			<Box direction="row" gap="small" margin={{ right: 'small' }}>
				<Edit color="status-warning" size="medium" onClick={() => onEditLight(light)} />
				<Trash color="status-error" size="medium" onClick={() => onRemoveLight(light)} />
			</Box>
		</Box>
	);
};

export default LigthListElement;
