// This file contains helper functions for the authentication process.
import e from "express";
import ipaddr from "ipaddr.js";

function isValidIP(ip: string) {
    try {
        const parsedIP = ipaddr.process(ip);

        const reservedRanges = ['private', 'loopback', 'linkLocal', 'multicast', 'unspecified', 'reserved'];
        if (reservedRanges.includes(parsedIP.range())) {
            return false;
        }

        return true;
    } catch (e) {
        console.error(`Recived invalid IP address for finding location: ${ip}`);
        return false;
    }
}

export const fetchRequestLocation = async (req: e.Request) => {
    let ip = req.headers['Fly-Client-IP'] || req.socket.remoteAddress

    if (Array.isArray(ip)) {
        ip = ip[0]
    }
    if (!ip) {
        ip = "127.0.0.1"
    }

    if (isValidIP(ip)) {
        let res = await fetch(`https://ipapi.co/${ip}/json/`)
        if (res.ok) {
            let locationJson = await res.json() as any
            return {ip, location: locationJson.city + ', ' + locationJson.region + ', ' + locationJson.country_name}
        } else {
            console.error(`Error fetching location data. Error: ${res.status}, ${res.statusText}`)
        }
    } else {
        console.error("Invalid ip. using server ip.")
        let res = await fetch(`https://ipapi.co/json/`)
        if (res.ok) {
            let locationJson = await res.json() as any
            return {ip: locationJson.ip, location: locationJson.city + ', ' + locationJson.region + ', ' + locationJson.country_name}
        } else {
            console.error(`Error fetching server location. Error: ${res.status}, ${res.statusText}`)
        }
    }

    const location = "Unknown location"

    return {ip, location};
}