import axios from "axios";

// https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript
export function getIP() {
  return axios
    .get("https://www.cloudflare.com/cdn-cgi/trace")
    .then((res) => {
      const { data } = res;
      const ip = data.split("ip=")[1].split("ts=")[0];

      return ip;
    })
    .catch((err) => Promise.reject(err));
}

export function getGeoFromIP(ip: string) {
  // const url = `https://free-geo-ip.p.rapidapi.com/json/${ip}`;
  const url = `https://api.ipbase.com/v2/info?ip=${ip}`;

  return axios
    .get(url, {
      headers: {
        apikey: process.env.REACT_APP_IPBASE_API_KEY
      }
    })
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
}

export async function getGeoByIp() {
  const ip = await getIP();
  const {
    data: { location }
  } = await getGeoFromIP(ip);

  return {
    lat: location.latitude,
    lng: location.longitude
  };
}
