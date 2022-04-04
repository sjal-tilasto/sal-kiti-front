<template>
  <div>
    <b-row>
      <b-col>
        <b-alert v-if="errors.main" variant="danger" show>
          <ul>
            <li v-for="e in errors.main" v-bind:key="e">{{ e }}</li>
          </ul>
        </b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h4 class="bg-sal-orange">{{ $tc("result.import", 2) }}</h4>
        <b-form @submit="onSubmitFile">
          <b-form-group
            id="input-group-file"
            label-for="input-file"
            :description="$t('import.file.select_or_drop')"
          >
            <b-form-file
              v-model="form.file"
              :state="Boolean(form.file)"
              :placeholder="$t('import.file.select')"
              :drop-placeholder="$t('import.file.drop')"
              required
            >
            </b-form-file>
          </b-form-group>
          <b-form-group
            id="input-group-type"
            label-for="input-type"
            :description="$t('import.type')"
          >
            <b-form-radio v-model="form.fileType" name="filetype" value="excel"
              >Excel / CSV</b-form-radio
            >
            <b-form-radio v-model="form.fileType" name="filetype" value="sius"
              >SIUS CSV</b-form-radio
            >
          </b-form-group>
          <b-form-group
            id="input-group-categories"
            :label="$t('import.default_category')"
            label-for="input-categories"
            v-if="form.fileType === 'sius'"
          >
            <b-form-select
              id="input-categories"
              v-model="form.category"
              :options="categories"
              textField="name"
              valueField="id"
            >
            </b-form-select>
          </b-form-group>
          <b-form-checkbox
            id="checkbox-dry-run"
            v-model="form.dryRun"
            name="checkbox-dry-run"
          >
            {{ $t("import.dry_run") }}
          </b-form-checkbox>
          <b-button
            type="submit"
            variant="light"
            class="btn-orange space-right"
            >{{ $t("submit") }}</b-button
          >
        </b-form>
      </b-col>
    </b-row>
    <b-row v-if="results.length > 0">
      <b-col>
        <p>{{ $t("search.count") }}: {{ results.length }}</p>
        <b-table small :items="results" :fields="importFields" ref="table">
          <template v-slot:cell(error)="data">
            <ul>
              <li v-for="(e, index) in data.item.error" v-bind:key="index">
                {{ e }}
              </li>
            </ul>
          </template>
          <template v-slot:cell(warning)="data">
            <ul>
              <li v-for="(e, index) in data.item.warning" v-bind:key="index">
                {{ e }}
              </li>
            </ul>
          </template>
          <template v-slot:cell(result)="data">
            <div v-if="data.item.result_code">
              {{ data.item.result_code }}
              <div v-if="data.item.result">({{ data.item.result }})</div>
            </div>
            <div v-else>{{ data.item.result }}</div>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button
          v-if="finished"
          :to="{
            name: 'competition',
            params: {
              competition_id: competition.id
            }
          }"
          variant="light"
          class="btn-orange"
          >{{ $t("import.show_results") }}
        </b-button>
        <b-button
          v-if="finished"
          variant="outline-info"
          v-on:click="getDebugExcel()"
          class="space-right float-right"
        >
          {{ $t("import.debug_excel") }}
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Import results from various sources
 */
import XLSX from "xlsx";
import getCookie from "../utils/GetCookie";
import errorParser from "../utils/ErrorParser";
import Papa from "papaparse";
import parseSiusData from "../utils/ParseSiusData";
import apiGet from "../mixins/ApiGet";
import resultImport from "../mixins/ResultImport";

export default {
  name: "ResultImport",
  mixins: [apiGet, resultImport],
  data() {
    return {
      categories: [],
      competition: {},
      competitionType: {},
      competitionResults: [],
      config: {
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        }
      },
      debugResults: null,
      errors: [],
      finished: false,
      form: {
        file: null,
        fileType: "excel",
        category: null,
        dryRun: null
      },
      headers: [],
      results: [],
      organizations: [],
      reader: null,
      competitionResultTypes: [],
      result: {},
      staticFields: [
        "category",
        "wtype",
        "info",
        "elimination_category",
        "sport_id",
        "first_name",
        "last_name",
        "organization",
        "team_members",
        "team_name",
        "position",
        "position_pre",
        "result",
        "result_code",
        "sport_id_a",
        "first_name_a",
        "last_name_a",
        "organization_a",
        "sport_id_b",
        "first_name_b",
        "last_name_b",
        "organization_b",
        "sport_id_c",
        "first_name_c",
        "last_name_c",
        "organization_c"
      ]
    };
  },
  computed: {
    /**
     * Sets table fields for import status
     *
     * @returns {array} fields
     */
    importFields: function() {
      return [
        { key: "status", label: this.$t("import.status.label") },
        { key: "sport_id", label: this.$t("athlete.sport_id") },
        { key: "first_name", label: this.$t("first_name") },
        { key: "last_name", label: this.$t("last_name") },
        { key: "category", label: this.$t("result.category") },
        { key: "result", label: this.$tc("result.result", 1) },
        { key: "warning", label: this.$t("import.warning.label") },
        { key: "error", label: this.$t("import.error.label") }
      ];
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    /**
     * Fetch required information for the import
     *
     * @returns {Promise<void>}
     */
    async getData() {
      await this.getCompetition(this.$route.params.competition_id);
      await this.getCategories(this.competition.type_info.sport);
      await this.getCompetitionType(this.competition.type);
      await this.getCompetitionResultTypes(this.competitionType.id);
      await this.getOrganizations(true, false, false);
      await this.getResults(this.$route.params.competition_id);
    },
    /**
     * Check submitted file type and trigger correct parser
     *
     * @param event
     * @returns {Promise<void>}
     */
    async onSubmitFile(event) {
      this.errors = [];
      event.stopPropagation();
      event.preventDefault();
      try {
        let file = this.form.file;
        let resultData = [];
        if (
          file &&
          file.name &&
          this.form.fileType === "excel" &&
          (file.name.toLowerCase().endsWith(".csv") ||
            file.name.toLowerCase().endsWith(".xls") ||
            file.name.toLowerCase().endsWith(".xlsx") ||
            file.name.toLowerCase().endsWith(".ods"))
        ) {
          resultData = await this.parseExcel(file);
          this.results = resultData;
          if (!this.errors.main) {
            await this.parseResults();
          }
        } else if (
          file &&
          file.type &&
          this.form.fileType === "sius" &&
          (file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv"))
        ) {
          resultData = await this.parseCSV(file);
          if (resultData && resultData.data && resultData.data.length > 1) {
            this.results = parseSiusData(resultData.data);
            await this.parseResults();
          }
        } else {
          if (this.form.fileType === "excel") {
            this.$set(this.errors, "main", [
              this.$t("import.error.unknown_file_type_excel")
            ]);
          } else {
            this.$set(this.errors, "main", [
              this.$t("import.error.unknown_file_type")
            ]);
          }
        }
      } catch (error) {
        this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
      }
    },
    /**
     * Read CSV file
     *
     * @param file
     * @returns {Promise<unknown>}
     */
    parseCSV(file) {
      return new Promise((complete, error) => {
        Papa.parse(file, { complete, error });
      });
    },
    /**
     * Modify Excel headers to technical versions
     *
     * @param worksheet
     * @returns []
     */
    parseExcelGetHeaders(worksheet) {
      let range = XLSX.utils.decode_range(worksheet["!ref"]);
      let formattedNames = [];
      for (let C = range.s.c; C <= range.e.c; ++C) {
        let addr = XLSX.utils.encode_cell({ r: range.s.r, c: C });
        let cell = worksheet[addr];
        if (!cell || !cell.v) {
          formattedNames.push("missing_header");
        } else {
          formattedNames.push(cell.v.replace(/\s/g, "_").toLowerCase());
        }
      }
      let headers = [];
      let competitionResultTypes = [];
      this.competitionResultTypes.forEach(resultType => {
        competitionResultTypes.push(resultType.abbreviation);
      });
      formattedNames.forEach(name => {
        if (this.staticFields.includes(name)) {
          headers.push(name);
        } else if (name === "final_category") {
          headers.push("elimination_category");
        } else if (name.includes("-")) {
          headers.push(name);
        } else if (
          competitionResultTypes.includes(name) &&
          !formattedNames.includes(name.concat("-1"))
        ) {
          headers.push(name.concat("-1"));
        } else {
          headers.push(name);
        }
      });
      return headers;
    },
    /**
     * Read xls file
     *
     * @param file
     * @returns {Promise<unknown>}
     */
    parseExcel(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = e => {
          let data = new Uint8Array(e.target.result);
          let workbook = XLSX.read(data, { type: "array" });
          let firstSheetName = workbook.SheetNames[0];
          let worksheet = workbook.Sheets[firstSheetName];
          let headers = this.parseExcelGetHeaders(worksheet);
          resolve(
            XLSX.utils.sheet_to_json(worksheet, { header: headers, range: 1 })
          );
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    }
  }
};
</script>

<style scoped></style>
