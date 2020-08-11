<template>
  <b-modal :id="result.id.toString()" :title="getTitle(result)" ok-only>
    <table
      class="table table-sm"
      :aria-describedby="result.id.toString() + '-athlete-info'"
    >
      <tr class="bg-sal-orange">
        <th scope="col" :id="result.id.toString() + '-athlete-info'">
          {{ $tc("athlete.athlete", 1) }}
        </th>
        <td></td>
      </tr>
      <tr v-if="!result.team">
        <th scope="row">{{ $t("first_name") }}</th>
        <td class="text-right">{{ result.first_name }}</td>
      </tr>
      <tr v-if="!result.team">
        <th scope="row">{{ $t("last_name") }}</th>
        <td class="text-right">{{ result.last_name }}</td>
      </tr>
      <tr v-for="member in result.team_members" :key="member.id">
        <td>{{ member.first_name }} {{ member.last_name }}</td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">{{ $t("athlete.club") }}</th>
        <td class="text-right">{{ result.organization }}</td>
      </tr>
    </table>

    <table
      class="table table-sm"
      :aria-describedby="result.id.toString() + '-result-info'"
    >
      <tr class="bg-sal-orange">
        <th scope="col" :id="result.id.toString() + '-result-info'">
          {{ $t("result.details") }}
        </th>
        <td></td>
      </tr>
      <tr>
        <th scope="row">{{ $t("result.category") }}</th>
        <td class="text-right">{{ result.category }}</td>
      </tr>
      <tr>
        <th scope="row">{{ $t("result.position") }}</th>
        <td class="text-right">{{ result.position }}</td>
      </tr>
      <tr>
        <th scope="row">{{ $tc("result.result", 1) }}</th>
        <td class="text-right" v-if="result.result_code && !result.result">
          {{ result.result_code }}
        </td>
        <td class="text-right" v-else-if="result.result_code && result.result">
          {{ result.result_code }}
          ({{ result.result | roundValue(result.decimals) }})
        </td>
        <td class="text-right" v-else>
          {{ result.result | roundValue(result.decimals) }}
        </td>
      </tr>
      <tr>
        <th scope="row">{{ $t("result.info") }}</th>
        <td class="text-right">
          {{ result.info }}
          {{ result.record | parseRecords(true) }}
          <div v-if="!result.approved">
             ({{ $t("result.unconfirmed") }})
          </div>
        </td>
      </tr>
    </table>

    <table
      class="table table-sm"
      v-for="(block, index) in resultBlocks"
      v-bind:key="index"
      :aria-describedby="result.id.toString() + '-block-' + index.toString()"
    >
      <tr class="bg-sal-orange">
        <th
          scope="col"
          v-if="block['label'] === 'final'"
          :id="result.id.toString() + '-block-' + index.toString()"
        >
          {{ $tc("result.final", 2) }}
        </th>
        <th
          scope="col"
          v-else-if="block['label'] === 'preliminary'"
          :id="result.id.toString() + '-block-' + index.toString()"
        >
          {{ $t("result.preliminary") }}
        </th>
        <th scope="col" v-else>{{ block["label"] }}</th>
        <td></td>
      </tr>
      <tr v-for="field in resultRowsExtra[index + 1]" v-bind:key="field.id">
        <th scope="col">{{ field.label }}</th>
        <td class="text-right" v-if="field.name === 'result'">
          {{ result.result | roundValue(result.decimals) }}
        </td>
        <td class="text-right" v-else>
          {{ result.partial | partialValue(field.name) }}
        </td>
      </tr>
    </table>
  </b-modal>
</template>

<script>
/**
 * Creates a modal for a single result information
 */
import parseRecords from "../utils/ParseRecordsFilter";
import partialValue from "../utils/PartialValueFilter";
import roundValue from "../utils/RoundValueFilter";

export default {
  name: "CompetitionResultsDetail",
  filters: {
    parseRecords,
    partialValue,
    roundValue
  },
  props: {
    customFields: {},
    maxBlock: Number,
    result: {},
    resultBlocks: {}
  },
  computed: {
    /**
     * Filters extra fields, ones including '-' symbol, from layout
     * - sort fields by order parameter
     *
     * @returns {[]|*[]} - array of sorted extra field arrays for each block
     */
    resultRowsExtra: function() {
      if (!this.customFields || this.customFields.length === 0) {
        return [];
      }
      let filtered = [];
      for (let i = 1; i <= this.maxBlock; i++) {
        filtered[i] = this.customFields.filter(f => f.block === i && f.order);
        filtered[i].sort((a, b) => parseInt(a.order) > parseInt(b.order));
      }
      return filtered;
    }
  },
  methods: {
    /**
     * Get title for a modal
     *
     * @param {object} result
     * @returns {string} title
     */
    getTitle(result) {
      if (result.team) {
        return this.$t("team") + ": " + result.last_name;
      } else {
        return result.first_name + " " + result.last_name;
      }
    }
  }
};
</script>

<style scoped></style>
