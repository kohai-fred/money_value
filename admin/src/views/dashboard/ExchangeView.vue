<script setup>
  import { ref } from "vue";
  import TitlePage from "../../components/TitlePage.vue";
  import { useExchanges, useAvailableExchanges } from "../../composables/exchanges";
  import { isoToEmoji } from "../../utils/isoToEmoji";
  import { useDisplay } from "vuetify/lib/framework.mjs";
  import { reactive } from "vue";
  import { createExchange, updateExchange, deleteExchange } from "../../services/exchanges";
  import { alertStore } from "../../store/alert.store";

  const { exchanges, isLoading, error } = useExchanges();
  const { availableExchanges, fetchAvailableExchanges } = useAvailableExchanges();
  const { showAlert } = alertStore();
  const { smAndDown } = useDisplay();

  const isDeleteModalOpen = ref([]);
  const exchangeUpdate = ref(false);
  const exchange2ForRemove = ref();

  const indexPair1 = ref(null);
  const indexPair2 = ref(null);

  function getIdPair(index) {
    const exchangesList =
      exchangeUpdate.value || isDeleteModalOpen.value.length ? exchanges.value : availableExchanges.value;
    return {
      currency_id_1: exchangesList[+index].currency_1.id,
      currency_id_2: exchangesList[+index].currency_2.id,
    };
  }

  const findOppositePair = (indexOfRemove = null) => {
    indexPair1.value = formExchange.exchange_1 ? formExchange.exchange_1.split("-")[0] : indexPair1.value;
    const { currency_id_1, currency_id_2 } = getIdPair(indexPair1.value);
    const exchangesList =
      exchangeUpdate.value || isDeleteModalOpen.value.length ? exchanges.value : availableExchanges.value;

    for (let i = 0; i < exchangesList.length; i++) {
      const element = exchangesList[i];
      const id1 = element.currency_1.id;
      const id2 = element.currency_2.id;

      if (id2 === currency_id_1 && id1 === currency_id_2) {
        indexPair2.value = i;
        if (indexOfRemove === null) break;
        if (i !== indexOfRemove) {
          exchange2ForRemove.value = element;
          break;
        }
      }
    }

    if (!isDeleteModalOpen.value.length) {
      formExchange.exchange_2 = exchangesList[indexPair2.value];
    }
  };

  function formatLabel(exchange) {
    const label = `${isoToEmoji(exchange.currency_1.code)} ${exchange.currency_1.name} → ${
      exchange.currency_2.name
    } ${isoToEmoji(exchange.currency_2.code)}`;
    return label;
  }

  const formState = ref();
  const formExchange = reactive({
    exchange_1: "",
    exchange_2: "",
    exchange_rate_1: "",
    exchange_rate_2: "",
  });

  function addChange(item, index) {
    exchangeUpdate.value = item;
    formExchange.exchange_1 = `${index} - ${formatLabel(item)}`;
    formExchange.exchange_rate_1 = item.exchange_rate;
    findOppositePair(index);
    countRate2();
  }

  function countRate2() {
    formExchange.exchange_rate_1 = (+formExchange.exchange_rate_1).toFixed(4);
    formExchange.exchange_rate_2 = (1 / formExchange.exchange_rate_1).toFixed(4);
  }

  async function handleRemoveExchange(item, index) {
    indexPair1.value = index;
    findOppositePair(index);
    try {
      const [res1, res2] = await deleteExchange({ exchange1: item, exchange2: exchange2ForRemove.value });
      exchanges.value = res2.length > res1.length ? res1 : res2;

      await fetchAvailableExchanges();
      clearForm();
      indexPair1.value = null;
      exchange2ForRemove.value = null;
      showAlert.value({
        color: "success",
        title: "Suppresion réussi 👍",
      });
    } catch (err) {
      console.error("📛 Error create exchange", err);
      showAlert.value({ color: "error", title: "Une erreur est survenue" });
    } finally {
      isDeleteModalOpen.value = [];
    }
  }

  function clearForm() {
    formExchange.exchange_1 = "";
    formExchange.exchange_2 = "";
    formExchange.exchange_rate_1 = "";
    formExchange.exchange_rate_2 = "";
  }

  async function submitForm() {
    const exchange1 = {
      ...getIdPair(indexPair1.value),
      exchange_rate: formExchange.exchange_rate_1,
    };
    const exchange2 = {
      ...getIdPair(indexPair2.value),
      exchange_rate: formExchange.exchange_rate_2,
    };

    const updateRequest = {
      id1: exchangeUpdate.value?.id,
      id2: formExchange.exchange_2.id,
      exchange1,
      exchange2,
    };
    try {
      const [res1, res2] = exchangeUpdate.value
        ? await updateExchange(updateRequest)
        : await createExchange(exchange1, exchange2);
      exchanges.value = res2;

      await fetchAvailableExchanges();
      clearForm();
      exchangeUpdate.value = null;
      showAlert.value({
        color: "success",
        title: `Les conversions ont bien été ${exchangeUpdate.value ? "modifées" : "ajoutées"}`,
      });
    } catch (err) {
      console.error("📛 Error create exchange", err);
      showAlert.value({ color: "error", title: "Une erreur est survenue" });
    }
  }
</script>

<template>
  <TitlePage title="taux de changes" />

  <div align-items="center" class="d-flex align-top justify-space-around flex-wrap gap-5 mt-16" width="100%">
    <v-card v-if="exchanges" class="mx-3 my-3" max-width="750" min-width="250px" width="100%">
      <v-card-title>Les taux existants</v-card-title>

      <v-divider></v-divider>

      <v-virtual-scroll :items="exchanges" height="320" item-height="48">
        <template v-slot:default="{ item, index }">
          <v-list-item>
            {{ formatLabel(item) }}
            <span class="mdi mdi-arrow-right-thin mx-2"></span>
            {{ item.exchange_rate }}
            <span class="mx-2 text-caption">(call x {{ item.request_count }})</span>
            <v-divider v-if="smAndDown" />
            <template v-slot:append>
              <v-btn
                size="x-small"
                color="info"
                variant="outlined"
                icon="mdi mdi-pencil-outline"
                class="mr-2"
                @click="() => addChange(item, index)"
              ></v-btn>
              <!-- MODAL -->
              <v-btn :id="item.id" size="x-small" color="error" variant="outlined" icon="mdi mdi-trash-can-outline">
                <v-icon color="error">mdi mdi-trash-can-outline</v-icon>
                <v-dialog v-model="isDeleteModalOpen[index]" activator="parent" width="auto">
                  <v-card class="px-4 py-4">
                    <v-card-title>Vous êtes sur le point d'effacer définitivement le change :</v-card-title>
                    <v-card-text>
                      <p class="text-center my-4">
                        {{ formatLabel(item) }}
                        <b>ET</b>
                        son opposé
                      </p>
                      <p class="text-center">⚠️ L'action est irreversible</p>
                    </v-card-text>
                    <v-card-actions class="my-4 mx-4">
                      <v-row>
                        <v-col>
                          <v-btn color="primary" variant="outlined" block @click="isDeleteModalOpen = []">
                            Annuler
                          </v-btn>
                        </v-col>
                        <v-col>
                          <v-btn
                            color="error"
                            variant="outlined"
                            block
                            @click="() => handleRemoveExchange(item, index)"
                          >
                            Supprimer
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-btn>
            </template>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-card>

    <!-- !FORM -->
    <v-card
      v-if="availableExchanges"
      class="d-flex flex-column justify-space-between mx-3 my-3"
      max-width="750"
      min-width="250px"
      width="100%"
    >
      <div>
        <v-card-title>
          {{
            exchangeUpdate
              ? `Modifier - ${exchangeUpdate.currency_1.name} & ${exchangeUpdate.currency_2.name}`
              : "Ajouter un nouveau taux de change"
          }}
        </v-card-title>
        <v-divider class="mb-4"></v-divider>
      </div>
      <v-form
        id="exchangeForm"
        class="mb-8 px-8"
        min-height="320"
        @submit.prevent="submitForm"
        validate-on="blur"
        v-model="formState"
      >
        <v-row>
          <v-col>
            <v-select
              label="Devises 1"
              v-model="formExchange.exchange_1"
              :items="
                availableExchanges.map((curr, index) => {
                  return `${index} - ${formatLabel(curr)}`;
                })
              "
              @update:modelValue="findOppositePair"
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              class="mb-2"
              density="default"
              label="Taux de change 1"
              v-model="formExchange.exchange_rate_1"
              @blur="countRate2"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field :label="formExchange.exchange_2 ? formatLabel(formExchange.exchange_2) : ''" disabled />
          </v-col>
          <v-col>
            <v-text-field
              type="number"
              class="mb-2"
              density="default"
              label="Taux de change 2"
              v-model="formExchange.exchange_rate_2"
              :disabled="!formExchange.exchange_rate_1"
            />
          </v-col>
        </v-row>
      </v-form>
      <v-card-actions class="px-8 mb-2">
        <v-row>
          <v-col>
            <v-btn
              block
              @click="clearForm"
              color="red"
              :disabled="!formExchange.exchange_1 && !formExchange.exchange_rate_1 && !formExchange.exchange_rate_2"
              :variant="
                !formExchange.exchange_1 && !formExchange.exchange_rate_1 && !formExchange.exchange_rate_2
                  ? 'outlined'
                  : 'flat'
              "
            >
              Annuler
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              :disabled="!formExchange.exchange_1 || !formExchange.exchange_rate_1 || !formExchange.exchange_rate_2"
              type="submit"
              form="exchangeForm"
              block
              :color="exchangeUpdate ? 'primary' : 'teal'"
              :variant="
                !formExchange.exchange_1 || !formExchange.exchange_rate_1 || !formExchange.exchange_rate_2
                  ? 'outlined'
                  : 'flat'
              "
            >
              {{ exchangeUpdate ? "Modifier" : "Ajouter" }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style lang="scss" scoped></style>
