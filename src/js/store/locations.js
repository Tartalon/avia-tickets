import api from "../services/apiService";

class Locations {
  constructor(api) {
    this.api = api;
    this.countries = null;
    this.cities = null;
  }
  async init() {
    const response = await Promise.all([this.api.countries(), this.api.cities()]);

    console.log(response);
    return response;
  }
}

const locations = new Locations(api);

export default locations;
