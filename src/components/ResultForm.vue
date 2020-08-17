<template>
  <div>
    <b-row>
      <b-col>
        <h1 v-if="edit">{{ $t("result.edit") }}</h1>
        <h1 v-else>{{ $t("result.add") }}</h1>
      </b-col>
      <b-col v-if="$store.state.user.is_superuser">
        <b-button
          :to="{
            name: 'changelog',
            params: { model_name: 'result', object_id: form.id }
          }"
          variant="light"
          class="btn-orange float-right"
          >{{ $t("change_log") }}
        </b-button>
      </b-col>
    </b-row>
    <h2 class="bg-sal-orange">{{ $tc("result.result", 1) }}</h2>
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
        <b-form @submit="onSubmit">
          <b-form-group
            id="input-group-first-name"
            :label="$t('first_name')"
            label-for="input-first-name"
          >
            <b-form-input
              id="first-name"
              v-model="form.first_name"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-last-name"
            :label="$t('last_name')"
            label-for="input-last-name"
          >
            <b-form-input
              id="last-name"
              v-model="form.last_name"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-organization"
            :label="$t('athlete.club')"
            label-for="input-organization"
          >
            <b-form-select
              id="input-organization"
              v-model="form.organization"
              :options="organizations"
              textField="name"
              valueField="id"
              required
            >
            </b-form-select>
          </b-form-group>
          <b-form-group
            id="input-group-category"
            :label="$t('result.category')"
            label-for="input-category"
          >
            <b-form-select
              id="input-category"
              v-model="form.category"
              :options="categories"
              textField="name"
              valueField="id"
              required
            >
            </b-form-select>
          </b-form-group>
          <b-form-group
            id="input-group-elimination-category"
            :label="$t('result.elimination_category')"
            label-for="input-elimination-category"
          >
            <b-form-select
              id="input-elimination-category"
              v-model="form.elimination_category"
              :options="categories"
              textField="name"
              valueField="id"
            >
            </b-form-select>
          </b-form-group>
          <b-form-group
            id="input-group-result"
            :label="$tc('result.result', 1)"
            label-for="input-result"
          >
            <b-form-input
              id="input-result"
              v-model="form.result"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-decimals"
            :label="$t('result.decimals')"
            label-for="input-decimals"
          >
            <b-form-input
              id="input-decimals"
              v-model="form.decimals"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-result-code"
            :label="$t('result.result_code')"
            label-for="input-result-code"
          >
            <b-form-input
              id="input-result-code"
              v-model="form.result_code"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-position"
            :label="$t('result.position')"
            label-for="input-position"
          >
            <b-form-input
              id="input-position"
              v-model="form.position"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-position-pre"
            :label="$t('result.position_pre')"
            label-for="input-position-pre"
          >
            <b-form-input
              id="input-position-pre"
              v-model="form.position_pre"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-info"
            :label="$t('result.info')"
            label-for="input-info"
          >
            <b-form-input id="input-info" v-model="form.info"></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-approved"
            :aria-label="$t('result.approved')"
            label-for="input-approved"
          >
            <b-form-checkbox
              id="input-approved"
              v-model="form.approved"
              name="checkbox-approved"
              value="true"
              unchecked-value="false"
            >
              {{ $t("result.approved") }}
            </b-form-checkbox>
          </b-form-group>

          <b-button
            type="submit"
            variant="light"
            class="btn-orange space-right space-down"
          >
            <section v-if="edit">{{ $t("update") }}</section>
            <section v-else>{{ $t("create") }}</section>
          </b-button>
          <b-button
            class="btn-danger space-right space-down"
            v-on:click="deleteConfirm(form, 'result')"
            v-if="edit"
          >
            {{ $t("remove") }}
          </b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h2 class="bg-sal-orange">{{ $tc("result.partial", 2) }}</h2>
      </b-col>
    </b-row>
    <b-form v-for="partial in form.partial" :key="partial.id">
      <b-row>
        <b-col>
          <b-alert v-if="errors[partial.id]" variant="danger" show>
            <ul>
              <li v-for="e in errors[partial.id]" v-bind:key="e">{{ e }}</li>
            </ul>
          </b-alert>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group
            :id="'partial-' + partial.id + '-1'"
            :label="$t('result.type')"
            label-for="input-type"
          >
            <b-form-select
              id="input-type"
              v-model="partial.type"
              :options="competitionResultTypes"
              textField="name"
              valueField="id"
              required
            ></b-form-select>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            :id="'partial-' + partial.id + '-2'"
            :label="$t('result.order')"
            label-for="input-order"
          >
            <b-form-input
              id="input-order"
              v-model="partial.order"
              required
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            :id="'partial-' + partial.id + '-3'"
            :label="$tc('result.result', 1)"
            label-for="input-value"
          >
            <b-form-input
              id="input-value"
              v-model="partial.value"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            :id="'partial-' + partial.id + '-4'"
            :label="$t('result.decimals')"
            label-for="input-decimals"
          >
            <b-form-input
              id="input-decimals"
              v-model="partial.decimals"
              required
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            :id="'partial-' + partial.id + '-5'"
            :label="$t('result.timestamp')"
            label-for="input-time"
          >
            <b-form-input id="input-time" v-model="partial.time"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            :id="'partial-' + partial.id + '-6'"
            :label="$t('result.text')"
            label-for="input-text"
          >
            <b-form-input id="input-text" v-model="partial.text"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            :id="'partial-' + partial.id + '-7'"
            :label="$t('update')"
            label-for="save-result"
          >
            <b-button
              type="submit"
              variant="light"
              class="btn-orange space-right"
              v-on:click="putPartial(partial)"
            >
              {{ $t("update") }}
            </b-button>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            :id="'partial-' + partial.id + '-8'"
            :label="$t('remove')"
            label-for="save-result"
          >
            <b-button
              class="btn-danger space-right"
              v-on:click="deleteConfirm(partial, 'partial')"
            >
              {{ $t("remove") }}
            </b-button>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
    <b-row>
      <b-col>
        <h3 class="bg-sal-orange">{{ $t("result.create_partial") }}</h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-alert v-if="errors.addPartialResult" variant="danger" show>
          <ul>
            <li v-for="e in errors.addPartialResult" v-bind:key="e">{{ e }}</li>
          </ul>
        </b-alert>
      </b-col>
    </b-row>
    <b-form>
      <b-row>
        <b-col>
          <b-form-group
            :id="'partial-add-1'"
            :label="$t('result.type')"
            label-for="input-type"
          >
            <b-form-select
              id="input-type"
              v-model="addPartialResult.type"
              :options="competitionResultTypes"
              textField="name"
              valueField="id"
              required
            ></b-form-select>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            :id="'partial-add-2'"
            :label="$t('result.order')"
            label-for="input-order"
          >
            <b-form-input
              id="input-order"
              v-model="addPartialResult.order"
              required
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            :id="'partial-add-3'"
            :label="$tc('result.result', 1)"
            label-for="input-value"
          >
            <b-form-input
              id="input-value"
              v-model="addPartialResult.value"
              required
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            :id="'partial-add-4'"
            :label="$t('result.decimals')"
            label-for="input-decimals"
          >
            <b-form-input
              id="input-decimals"
              v-model="addPartialResult.decimals"
              required
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            :id="'partial-add-5'"
            :label="$t('result.timestamp')"
            label-for="input-time"
          >
            <b-form-input
              id="input-time"
              v-model="addPartialResult.time"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            :id="'partial-add-6'"
            :label="$t('update')"
            label-for="save-result"
          >
            <b-button
              type="submit"
              variant="light"
              class="btn-orange space-right"
              v-on:click="postPartial(addPartialResult)"
            >
              {{ $t("create") }}
            </b-button>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
/**
 * Result edit form
 */
import { HTTP } from "../api/BaseApi.js";
import getCookie from "../utils/GetCookie";
import errorParser from "../utils/ErrorParser";
import apiGet from "../mixins/ApiGet";

export default {
  name: "ResultForm",
  mixins: [apiGet],
  data() {
    return {
      addPartialResult: {
        result: this.$route.params.result_id
      },
      categories: [],
      competition: {},
      config: {
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        }
      },
      edit: false,
      errors: {},
      event: {},
      form: {},
      organizations: [],
      loading: false,
      competitionResultTypes: []
    };
  },
  mounted() {
    if (this.$route.params.result_id) {
      this.edit = true;
      this.getResult(this.$route.params.result_id);
      this.getOrganizations();
    }
  },
  methods: {
    /**
     * Confirmation message for result deletion
     *
     * @param {object} result
     * @param {string} type - result/partial
     */
    deleteConfirm(result, type) {
      this.$bvModal
        .msgBoxConfirm(this.$t("confirm.delete"), {
          okTitle: this.$t("confirm.yes"),
          cancelTitle: this.$t("confirm.cancel")
        })
        .then(value => {
          if (value === true) {
            if (type === "result") {
              this.deleteResult(result);
            } else if (type === "partial") {
              this.deletePartial(result);
            }
          }
        });
    },
    /**
     * Deletes a partial result (API delete)
     *
     * @param {object} partial
     */
    async deletePartial(partial) {
      this.$set(this.errors, partial.id, null);
      HTTP.delete("partialresults/" + partial.id + "/", this.config)
        .then(response => {
          if (response.status === 204) {
            this.getResult(this.$route.params.result_id);
          }
        })
        .catch(error => {
          this.$set(
            this.errors,
            partial.id,
            errorParser.partialResult.bind(this)(error)
          );
        });
    },
    /**
     * Deletes a partial result (API delete)
     *
     * @param {object} partial
     */
    async deleteResult(result) {
      this.$set(this.errors, "main", null);
      HTTP.delete("results/" + result.id + "/", this.config)
        .then(response => {
          if (response.status === 204) {
            this.$router.push({
              name: "competition",
              params: { competition_id: result.competition }
            });
          }
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.result.bind(this)(error));
        });
    },
    /**
     * Fetch competition information from API
     * - trigger competition type based API calls
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async getCompetition(id) {
      HTTP.get("competitions/" + id + "/")
        .then(response => {
          this.competition = response.data || {};
          this.getCompetitionResultTypes(response.data.type);
          this.getCompetitionType(response.data.type);
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch competition type information from API
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async getCompetitionType(id) {
      HTTP.get("competitiontypes/" + id + "/")
        .then(response => {
          this.getCategories(response.data.sport);
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Fetch result information from API
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async getResult(id) {
      this.$set(this.errors, "main", null);
      this.loading = true;
      HTTP.get("results/" + id + "/")
        .then(response => {
          this.form = response.data || {};
          this.getCompetition(response.data.competition);
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loading = false));
    },
    /**
     * Edit or add result on submit
     *
     * @param evt
     */
    onSubmit(evt) {
      evt.preventDefault();
      if (this.$route.params.result_id) {
        this.putResult(this.$route.params.result_id);
      } else {
        this.postResult();
      }
    },
    /**
     * Add a new partial result (API post)
     *
     * @param {object} partial result
     * @returns {Promise<void>}
     */
    async postPartial(partial) {
      this.$set(this.errors, partial.id, null);
      HTTP.post("partialresults/", partial, this.config)
        .then(response => {
          this.getResult(response.data.result);
        })
        .catch(error => {
          this.$set(
            this.errors,
            "addPartialResult",
            errorParser.partialResult.bind(this)(error)
          );
        });
    },
    /**
     * Add a new result (API post)
     *
     * @returns {Promise<void>}
     */
    async postResult() {
      this.$set(this.errors, "main", null);
      HTTP.post("results/", this.form, this.config)
        .then(response => {
          this.$router.push({
            name: "result",
            params: { result_id: response.data.id }
          });
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.result.bind(this)(error));
        });
    },
    /**
     * Edit a partial result (API put)
     *
     * @param {object} partial result
     * @returns {Promise<void>}
     */
    async putPartial(partial) {
      this.$set(this.errors, partial.id, null);
      partial.result = this.$route.params.result_id;
      HTTP.put("partialresults/" + partial.id + "/", partial, this.config)
        .then(response => {
          partial = response.data;
        })
        .catch(error => {
          this.$set(
            this.errors,
            partial.id,
            errorParser.partialResult.bind(this)(error)
          );
        });
    },
    /**
     * Edit a result (API put)
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async putResult(id) {
      this.$set(this.errors, "main", null);
      HTTP.put("results/" + id + "/", this.form, this.config)
        .then(response => {
          this.$router.push({
            name: "competition",
            params: { competition_id: response.data.competition }
          });
        })
        .catch(error => {
          this.$set(this.errors, "main", errorParser.result.bind(this)(error));
        });
    }
  }
};
</script>

<style scoped></style>
