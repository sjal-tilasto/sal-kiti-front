import { HTTP } from "@/api/BaseApi";
import errorParser from "@/utils/ErrorParser";

export default {
  methods: {
    /**
     * Fetch areas from API
     *
     * @returns {Promise<void>}
     */
    async getAreas() {
      this.loadingAreas = true;
      HTTP.get("areas/")
        .then(response => {
          this.areas = response.data.results || [];
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingAreas = false));
    },
    /**
     * Fetch athlete information from API
     *
     * @param {number} athleteId
     * @returns {Promise<void>}
     */
    async getAthlete(athleteId) {
      this.loadingAthlete = true;
      this.$set(this.errors, "main", null);
      this.athlete = {};
      HTTP.get("athletes/" + athleteId + "/")
        .then(response => {
          this.athlete = response.data || {};
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingAthlete = false));
    },
    /**
     * Fetch current categories for a sport from API
     *
     * @param {number} sportId
     * @param {boolean} historical
     * @returns {Promise<void>}
     */
    async getCategories(sportId, historical = false) {
      this.loadingCategories = true;
      let url = "categories/?sport=" + sportId;
      if (!historical) {
        url = url + "&historical=false";
      }
      HTTP.get(url)
        .then(response => {
          this.categories = response.data.results;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingCategories = false));
    },
    /**
     * Fetch competition information from API
     *
     * @param {number} competitionId
     * @returns {Promise<void>}
     */
    async getCompetition(competitionId) {
      this.loadingCompetition = true;
      this.competition = {};
      await HTTP.get("competitions/" + competitionId + "/")
        .then(response => {
          this.competition = response.data || {};
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingCompetition = false));
    },
    /**
     * Fetch competition levels from API
     *
     * @returns {Promise<void>}
     */
    async getCompetitionLevels() {
      this.loadingCompetitionLevels = true;
      HTTP.get("competitionlevels/")
        .then(response => {
          this.competitionLevels = response.data.results;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingCompetitionLevels = false));
    },
    /**
     * Fetch competition result types from API
     *
     * @param {number} competitionType
     * @returns {Promise<void>}
     */
    async getCompetitionResultTypes(competitionType) {
      this.loadingCompetitionResultTypes = true;
      HTTP.get("competitionresulttypes/?competition_type=" + competitionType)
        .then(response => {
          this.competitionResultTypes = response.data.results || [];
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingCompetitionResultTypes = false));
    },
    /**
     * Fetch competition type information from API
     *
     * @param {number} competitionTypeId
     * @returns {Promise<void>}
     */
    async getCompetitionType(competitionTypeId) {
      this.loadingCompetitionType = true;
      this.competitionType = {};
      await HTTP.get("competitiontypes/" + competitionTypeId + "/")
        .then(response => {
          this.competitionType = response.data || {};
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingCompetitionType = false));
    },
    /**
     * Fetch current competition types for a sport from API
     *
     * @param {number} sportId
     * @param {boolean} historical
     * @returns {Promise<void>}
     */
    async getCompetitionTypes(sportId, historical = false) {
      this.loadingCompetitionTypes = true;
      let url = "competitiontypes/?sport=" + sportId;
      if (!historical) {
        url = url + "&historical=false";
      }
      HTTP.get(url)
        .then(response => {
          this.competitionTypes = response.data.results;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingCompetitionTypes = false));
    },
    /**
     * Fetch event information from API
     *
     * @param {number} eventId
     * @returns {Promise<void>}
     */
    async getEvent(eventId) {
      this.loadingEvent = true;
      HTTP.get("events/" + eventId + "/")
        .then(response => {
          this.event = response.data || {};
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingEvent = false));
    },
    /**
     * Fetch organizations from API
     *
     * @param {boolean} external
     * @param {boolean} historical
     * * @param {boolean} own, limit to own organizations
     * @returns {Promise<void>}
     */
    async getOrganizations(external = true, historical = true, own = false) {
      this.loadingOrganizations = true;
      let url = "organizations/?";
      if (!external) {
        url = url + "&external=false";
      }
      if (!historical) {
        url = url + "&historical=false";
      }
      if (own) {
        url = url + "&own=true";
      }
      HTTP.get(url)
        .then(response => {
          this.organizations = response.data.results;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingOrganizations = false));
    },
    /**
     * Fetch sports from API
     *
     * @returns {Promise<void>}
     */
    async getSports() {
      this.loadingSports = true;
      HTTP.get("sports/")
        .then(response => {
          this.sports = response.data.results;
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingSports = false));
    }
  }
};
