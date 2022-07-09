<template>
  <div>
    <b-row>
      <b-col>
        <h2 class="bg-sal-orange">{{ $tc("contact.contact", 2) }}</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div>
          <b-table
            small
            :fields="contactFields"
            :items="contacts"
            sort-by="type"
            hover
          >
            <template v-slot:cell(remove)="data">
              <div>
                <b-button
                  class="btn-danger"
                  v-on:click="deleteConfirm(data.item)"
                >
                  {{ $t("remove") }}
                </b-button>
              </div>
            </template>
          </b-table>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h2 class="bg-sal-orange">{{ $t("contact.add") }}</h2>
      </b-col>
    </b-row>
    <b-form>
      <b-row>
        <b-col>
          <b-form-group
            :id="'contact-add-type'"
            :label="$t('contact.type')"
            label-for="input-type"
          >
            <b-form-select
              id="input-type"
              v-model="addContact.type"
              :options="contactTypes"
              textField="name"
              valueField="key"
              required
            ></b-form-select>
          </b-form-group>
          <b-form-group
            :id="'contact-add-first-name'"
            :label="$t('contact.first_name')"
            label-for="input-order"
          >
            <b-form-input
              id="input-order"
              v-model="addContact.first_name"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :id="'contact-add-last-name'"
            :label="$t('contact.last_name')"
            label-for="input-order"
          >
            <b-form-input
              id="input-order"
              v-model="addContact.last_name"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :id="'contact-add-email'"
            :label="$t('contact.email')"
            label-for="input-order"
          >
            <b-form-input
              id="input-order"
              v-model="addContact.email"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :id="'contact-add-phone'"
            :label="$t('contact.phone')"
            label-for="input-order"
          >
            <b-form-input
              id="input-order"
              v-model="addContact.phone"
            ></b-form-input>
          </b-form-group>
          <div>
            <b-button
              type="submit"
              variant="light"
              class="btn-orange space-right"
              v-on:click="postContact(addContact)"
            >
              {{ $t("create") }}
            </b-button>
          </div>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
/**
 * Event create and edit form
 */
import { HTTP } from "../api/BaseApi.js";
import getCookie from "../utils/GetCookie";
import errorParser from "../utils/ErrorParser";

export default {
  name: "EventFormContacts",
  props: {
    eventId: String
  },
  data() {
    return {
      config: {
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        }
      },
      contacts: [],
      edit: false,
      errors: {},
      addContact: {
        event: this.eventId,
        type: null,
        first_name: null,
        last_name: null,
        email: "",
        phone: ""
      }
    };
  },
  computed: {
    /**
     * Sets fields list for the contacts table
     *
     * @returns {array} fields list
     */
    contactFields: function () {
      return [
        { key: "type", label: this.$t("contact.type"), sortable: true },
        {
          key: "first_name",
          label: this.$tc("contact.first_name", 1),
          sortable: true
        },
        {
          key: "last_name",
          label: this.$t("contact.last_name"),
          sortable: true
        },
        { key: "email", label: this.$tc("contact.email", 1) },
        { key: "phone", label: this.$tc("contact.phone", 1) },
        "remove"
      ];
    },
    contactTypes: function () {
      return [
        { key: "contact", name: this.$t("contact.generic_contact") },
        { key: "manager", name: this.$t("contact.competition_manager") },
        { key: "head judge", name: this.$t("contact.head_judge") },
        { key: "technical", name: this.$t("contact.technical_manager") }
      ];
    }
  },
  mounted() {
    this.getContacts(this.eventId);
  },
  methods: {
    /**
     * Fetch contacts from API
     * @returns {Promise<void>}
     */
    async getContacts(eventId) {
      HTTP.get("eventcontacts/?event=" + eventId)
        .then((response) => {
          this.contacts = response.data.results;
        })
        .catch((error) => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Add a new event contact (API post)
     *
     * @param {object} contact
     * @returns {Promise<void>}
     */
    async postContact(contact) {
      HTTP.post("eventcontacts/", contact, this.config)
        .then((response) => {
          if (response.status === 201) {
            this.getContacts(this.eventId);
          }
        })
        .catch((error) => {
          this.$set(
            this.errors,
            "main",
            errorParser.partialResult.bind(this)(error)
          );
        });
    },
    /**
     * Confirmation message for contact deletion
     *
     * @param {object} contact
     */
    deleteConfirm(contact) {
      this.$bvModal
        .msgBoxConfirm(this.$t("confirm.delete"), {
          okTitle: this.$t("confirm.yes"),
          cancelTitle: this.$t("confirm.cancel")
        })
        .then((value) => {
          if (value === true) {
            this.deleteContact(contact);
          }
        });
    },
    /**
     * Deletes the event contact (API delete)
     *
     * @param {object} contact
     */
    async deleteContact(contact) {
      HTTP.delete("eventcontacts/" + contact.id + "/", this.config)
        .then((response) => {
          if (response.status === 204) {
            this.getContacts(this.eventId);
          }
        })
        .catch((error) => {
          this.$set(
            this.errors,
            contact.id,
            errorParser.partialResult.bind(this)(error)
          );
        });
    }
  }
};
</script>

<style scoped></style>
