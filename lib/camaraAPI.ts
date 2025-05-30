import axios from "axios";

export async function getCAMARADeviceStatus(deviceId: string) {
  try {
    const response = await axios.post("http://localhost:8094/device-status/open-gateway/v1/retrieve",
      {
        device: deviceId
      },
      {
        headers: {
          'Authorization': 'token',
          'Content-Type': 'application/json', // usually axios sets this automatically
        }
      });

    
    if(response.data.connectivity == undefined) {
      response.data.connectivity = ["Not Recahable"]
    } 
    return response.data;
  } catch (error) {
    throw new Error("Unable to retrieve device status data.");
  }
}