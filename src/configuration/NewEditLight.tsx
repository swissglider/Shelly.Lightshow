import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Heading, Select, TextInput } from 'grommet';
import { db, L_LightTypes_List, L_ShellyTypes_List, T_Light, T_LightTypes, T_ShellyTypes } from '../db';
import { Add, Save } from 'grommet-icons';
import { isValidIp } from '../lighthandler/shelly1Handler';

export interface I_NewEditLight_Props {
	method: 'new' | 'edit';
	toEditLight?: T_Light;
	onClose: any;
}

const NewEditLight: FC<I_NewEditLight_Props> = ({ method, toEditLight, onClose }: I_NewEditLight_Props) => {
	const [lightName, setLightName] = useState<string>('');
	const [lightIP, setLightIP] = useState<string>('');
	const [shellyType, setShellyType] = useState<T_ShellyTypes | null>(null);
	const [lightType, setlightType] = useState<T_LightTypes | null>(null);
	const [channelID, setChannelID] = useState<number>(0);
	const [title, setTitle] = useState<string>('Add new Light');

	useEffect(() => {
		if (method === 'edit' && toEditLight) {
			setLightName(toEditLight.name);
			setChannelID(toEditLight.channelID);
			setLightIP(toEditLight.ip);
			setShellyType(toEditLight.shellyType);
			setlightType(toEditLight.lightType);
			setTitle('Edit Light');
		}
	}, []);

	const saveAdd = async () => {
		if (lightName !== '' && isValidIp(lightIP) && shellyType !== null && lightType !== null) {
			if (method === 'new') {
				try {
					// add to db
					const id = await db.lights.add({
						name: lightName,
						channelID: channelID,
						lightType: lightType,
						shellyType: shellyType,
						ip: lightIP,
					});
					console.log('ID = ' + id);
					// reset
					setLightName('');
					setLightIP('');
					setChannelID(0);
					setShellyType(null);
					setlightType(null);
				} catch (error) {
					console.log(`Failed to add ${name}: ${error}`);
				}
			} else {
				if (toEditLight && toEditLight.id)
					db.lights.put(
						{
							id: toEditLight.id,
							name: lightName,
							channelID: channelID,
							lightType: lightType,
							shellyType: shellyType,
							ip: lightIP,
						},
						toEditLight.id,
					);
				onClose();
			}
		} else {
			alert('Everything is mandatory, or somthing is wrong like the IP');
		}
	};

	return (
		<Box border={{ color: 'dark-3', size: 'small' }} round="xsmall">
			<Heading level="3" margin="xsmall" alignSelf="center">
				{title}
			</Heading>
			<Box border={[{ color: 'dark-3', size: 'small', side: 'bottom' }]} />
			<Box margin="medium" direction="row" gap="small" align="center" wrap>
				<Box>
					<TextInput
						size="small"
						placeholder="Light Name..."
						value={lightName}
						plain
						onChange={(event) => setLightName(event.target.value)}
					/>
					{shellyType && shellyType === 'shelly2.5' && (
						<Select
							size="small"
							placeholder="select ChannelID"
							value={channelID.toString() ?? ''}
							options={['0', '1']}
							onChange={({ option }) => setChannelID(parseInt(option))}
						/>
					)}
				</Box>
				<Box>
					<TextInput
						size="small"
						placeholder="Light IP..."
						value={lightIP}
						plain
						onChange={(event) => setLightIP(event.target.value)}
					/>
				</Box>
				<Select
					size="small"
					placeholder="select Shelly Type..."
					value={shellyType ?? ''}
					options={L_ShellyTypes_List}
					onChange={({ option }) => setShellyType(option)}
				/>
				<Select
					size="small"
					placeholder="select Light Type..."
					value={lightType ?? ''}
					options={L_LightTypes_List}
					onChange={({ option }) => setlightType(option)}
				/>

				<Box round="full" overflow="hidden" background="status-ok" alignSelf="center">
					<Button
						icon={method === 'new' ? <Add size="small" /> : <Save size="small" />}
						onClick={() => saveAdd()}
						hoverIndicator
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default NewEditLight;
