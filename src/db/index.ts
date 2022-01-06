import Dexie, { Table } from 'dexie';

export const L_ShellyTypes_List = ['shelly1', 'shelly2.5', 'shelly1PM'];
export type T_ShellyTypes = typeof L_ShellyTypes_List[number];

export const L_LightTypes_List = ['volumeChangedLight', 'avarageLight', 'maxLight', 'avarageLong'];
export type T_LightTypes = typeof L_LightTypes_List[number];

export type T_Light = {
	id?: number;
	name: string;
	channelID: number;
	lightType: T_LightTypes;
	shellyType: T_ShellyTypes;
	ip: string;
};

export class MySubClassedDexie extends Dexie {
	// 'lights' is added by dexie when declaring the stores()
	// We just tell the typing system this is the case
	lights!: Table<T_Light>;

	constructor() {
		super('myDatabase');
		this.version(1).stores({
			lights: `++id, name, channelID, lightType, shellyType, ip`, // Primary key and indexed props
		});
	}
}

export const db = new MySubClassedDexie();
