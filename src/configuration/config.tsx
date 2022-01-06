import React, { FC, useState } from 'react';
import { Box, Button, Header, Heading, Main } from 'grommet';
import { db, T_Light } from '../db';
import NewEditLight from './NewEditLight';
import LightList from './LightList';
import { useLiveQuery } from 'dexie-react-hooks';

export interface I_Configuration_Props {
	setClose: any;
}

const Configuration: FC<I_Configuration_Props> = ({ setClose }: I_Configuration_Props) => {
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [selectedLight, setSelectedLight] = useState<T_Light | null>(null);
	const lights = useLiveQuery(() => db.lights.toArray());

	const onClose = () => {
		setIsEdit(false);
	};

	const onEditLight = (light: T_Light) => {
		setIsEdit(true);
		setSelectedLight(light);
	};

	const onRemoveLight = (light: T_Light) => {
		console.log(light);
		if (light.id) db.lights.delete(light.id);
	};

	return (
		<>
			<Box
				justify="center"
				alignSelf="center"
				margin="small"
				border={{ color: 'dark-3', size: 'small' }}
				round="medium"
				background="dark-1"
			>
				<Header
					justify="between"
					margin={{ horizontal: 'small' }}
					height="xxsmall"
					round={{ corner: 'top', size: 'medium' }}
				>
					<Heading level="2" margin="none">
						Config
					</Heading>
					<Box>
						<Button size="small" label="Close" onClick={() => setClose()} />
					</Box>
				</Header>
				<Box border={[{ color: 'dark-3', size: 'small', side: 'bottom' }]} />
				<Main alignSelf="center">
					{!isEdit && (
						<Box pad="small" justify="center" gap="large">
							<NewEditLight method="new" onClose={onClose} />
							{lights && (
								<LightList lights={lights} onEditLight={onEditLight} onRemoveLight={onRemoveLight} />
							)}
						</Box>
					)}
					{isEdit && selectedLight && (
						<Box pad="small" justify="center" gap="large">
							<NewEditLight method="edit" toEditLight={selectedLight} onClose={onClose} />
						</Box>
					)}
				</Main>
			</Box>
			<button
				className="large-button"
				onClick={() => {
					db.transaction('rw', db.tables, async () => {
						await Promise.all(db.tables.map((table) => table.clear()));
					});
				}}
			>
				Clear Database
			</button>
		</>
	);
};

export default Configuration;
