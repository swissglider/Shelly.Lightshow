import axios from 'axios';
import isReachable from 'is-reachable';
import { isIPv4 } from 'net';
import { T_Light } from '../db';

export const isValidIp = (value: string) =>
	/^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/.test(value) ? true : false;

export const getShelly1Available = async (light: T_Light): Promise<boolean> => {
	if (!isIPv4(light.ip)) {
		alert(`IP (${light.ip}) from Light [${light.name}] is not a valid IPv4 adress`);
		return false;
	}
	const reachable = await isReachable(light.ip);
	if (!reachable) {
		alert(`IP (${light.ip}) from Light [${light.name}] is not a reachable`);
		return false;
	}
	return true;
};

export const getShelly1StatusOnOff = async (light: T_Light): Promise<boolean> => {
	const isShelly1Available = await getShelly1Available(light);
	if (!isShelly1Available) return false;
	return true;
};

export const switchShelly = (light: T_Light, turn: 'on' | 'off', timeout?: number): void => {
	const _timoutString = timeout && timeout !== 0 ? `&timer=${(timeout / 1000).toString()}` : '';
	try {
		axios
			// .get(`http://${light.ip}/relay/${light.channelID.toString()}?turn=${turn}${_timoutString}`)
			.get(`http://${light.ip}/relay/${light.channelID.toString()}?turn=${turn}`)
			.then(function (response) {
				// no response because of the http error
			})
			.catch(function (error) {
				// there is an error because of not https - but it is working
			})
			.then(function () {
				// always executed
			});
	} catch (error) {
		// there is an error because of not https - but it is working
	}
};
